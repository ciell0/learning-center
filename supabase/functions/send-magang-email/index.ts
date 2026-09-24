import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const EMAIL_TEMPLATES: Record<string, { subject: string; text: string }> = {
  terverifikasi: {
    subject: '[BI Malang] Status Magang Anda: Terverifikasi',
    text: `Yth. {{nama_lengkap}},\n\nSelamat! Anda telah terverifikasi untuk program magang {{jenis_program}} di divisi {{divisi}} untuk periode {{periode_magang}}.\n\nTim kami akan menghubungi Anda lebih lanjut melalui email ini.\n\nHormat kami,\nTim Rekrutmen BI Malang`,
  },
  accepted: {
    subject: '[BI Malang] Selamat! Anda Diterima',
    text: `Yth. {{nama_lengkap}},\n\nSelamat! Anda dinyatakan DITERIMA sebagai peserta magang di divisi {{divisi}} pada program {{jenis_program}} periode {{periode_magang}}.\n\nKami menantikan kehadiran Anda.\n\nHormat kami,\nTim Rekrutmen BI Malang`,
  },
  rejected: {
    subject: '[BI Malang] Hasil Seleksi Magang',
    text: `Yth. {{nama_lengkap}},\n\nTerima kasih atas minat dan waktu Anda mengikuti proses seleksi magang {{jenis_program}} di {{universitas}}.\n\nSetelah evaluasi, saat ini Anda belum lolos pada divisi {{divisi}}. Semoga kesempatan dapat terulang di kesempatan berikutnya.\n\nHormat kami,\nTim Rekrutmen BI Malang`,
  },
  waiting: {
    subject: '[BI Malang] Status Pendaftaran Magang',
    text: `Yth. {{nama_lengkap}},\n\nPendaftaran Anda untuk program magang {{jenis_program}} masih dalam tahap proses administrasi dan review. Kami akan menginformasikan status selanjutnya melalui email ini.\n\nHormat kami,\nTim Rekrutmen BI Malang`,
  },
  review: {
    subject: '[BI Malang] Pendaftaran Magang Sedang Ditinjau',
    text: `Yth. {{nama_lengkap}},\n\nPendaftaran Anda untuk program magang {{jenis_program}} sedang dalam tahap review oleh tim admin. Mohon menunggu informasi lebih lanjut.\n\nHormat kami,\nTim Rekrutmen BI Malang`,
  },
};

function applyTemplate(templateText: string, payload: Record<string, string | number | null | undefined>) {
  return templateText.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    const value = payload[key];
    return value == null ? '' : String(value);
  });
}

Deno.serve(async (req) => {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'Supabase server environment not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = await req.json();
    const pelamarId = payload?.pelamar_id;

    if (!pelamarId) {
      return new Response(JSON.stringify({ success: false, error: 'pelamar_id is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: pelamar, error: pelamarError } = await supabase
      .from('pelamar_magang')
      .select('*')
      .eq('id', pelamarId)
      .single();

    if (pelamarError || !pelamar) {
      return new Response(JSON.stringify({ success: false, error: pelamarError?.message || 'Pelamar not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const recipientEmail = String(pelamar.email || '').trim();
    const status = String(pelamar.status || 'waiting');

    if (!recipientEmail) {
      return new Response(JSON.stringify({ success: false, error: 'Email pelamar tidak tersedia.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const template = EMAIL_TEMPLATES[status] || EMAIL_TEMPLATES.waiting;
    const emailBody = applyTemplate(template.text, {
      nama_lengkap: pelamar.nama_lengkap,
      universitas: pelamar.universitas,
      divisi: pelamar.divisi,
      periode_magang: pelamar.periode_magang,
      status: pelamar.status,
      jenis_program: pelamar.jenis_program,
    });

    if (!RESEND_API_KEY) {
      await supabase.from('email_logs').insert({
        pelamar_id: pelamarId,
        recipient_email: recipientEmail,
        status: 'failed',
        template: status,
        error_message: 'RESEND_API_KEY is not configured.',
      });

      return new Response(JSON.stringify({ success: false, error: 'Email provider key is not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ciellobelleza@gmail.com',
        to: [recipientEmail],
        subject: template.subject,
        text: emailBody,
      }),
    });

    const providerData = await providerResponse.json().catch(() => ({}));

    if (!providerResponse.ok) {
      const errorMessage = providerData?.message || 'Email provider rejected the request.';

      await supabase.from('email_logs').insert({
        pelamar_id: pelamarId,
        recipient_email: recipientEmail,
        status: 'failed',
        template: status,
        error_message: errorMessage,
      });

      return new Response(JSON.stringify({ success: false, error: errorMessage }), {
        status: providerResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const providerMessageId = providerData?.id || null;
    const sentAt = new Date().toISOString();

    await supabase.from('email_logs').insert({
      pelamar_id: pelamarId,
      recipient_email: recipientEmail,
      status: 'sent',
      template: status,
      provider_message_id: providerMessageId,
      sent_at: sentAt,
    });

    await supabase
      .from('pelamar_magang')
      .update({
        tindakan_admin: `Mengirim email status ${status}`,
        updated_at: sentAt,
      })
      .eq('id', pelamarId);

    return new Response(JSON.stringify({
      success: true,
      message: 'Email berhasil dikirim.',
      provider_message_id: providerMessageId,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error in send-magang-email function.';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
