export type Status = 'waiting' | 'review' | 'accepted' | 'rejected' | 'terverifikasi';

export interface Applicant {
  id: string;
  name: string;
  nim: string;
  university: string;
  faculty: string;
  major: string;
  semester: number;
  phone: string;
  email?: string;
  division: string;
  program: string;
  period: string;
  registrationDate: string;
  status: Status;
  skills: string[];
  recommendationLetterNo: string;
  documents: { name: string; type: string; path?: string; url?: string }[];
  adminNotes: string;
  action?: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  registrationStart: string;
  registrationEnd: string;
  internshipStart: string;
  internshipEnd: string;
  quota: number;
  status: 'open' | 'closed' | 'draft';
  applicants: number;
  accepted: number;
}

export interface Division {
  id: string;
  name: string;
  description: string;
  requirements: string;
  quota: number;
  active: boolean;
  applicants: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  year: number;
  isbn: string;
  status: 'available' | 'borrowed' | 'reserved';
  type: 'physical' | 'digital';
  cover?: string;
  description: string;
  stock: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  registrationDate: string;
  status: 'active' | 'suspended';
  avatar?: string;
}

export const APPLICANTS: Applicant[] = [
  {
    id: '1', name: 'Rizky Fadillah Putra', nim: '195150201111023',
    university: 'Universitas Brawijaya', faculty: 'Teknik', major: 'Teknik Informatika',
    semester: 6, phone: '081234567890', division: 'Social Media', program: 'BI Regular Internship',
    period: 'Januari – Maret 2025', registrationDate: '2024-11-01', status: 'accepted',
    skills: ['React', 'Figma', 'Canva', 'Social Media', 'Content Creation'],
    recommendationLetterNo: 'SK/FAK/TI/2024/045',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'Proposal', type: 'pdf' },
      { name: 'KTP', type: 'jpg' }, { name: 'Portfolio', type: 'pdf' }
    ],
    adminNotes: 'Kandidat sangat potensial, pengalaman desain sangat baik.'
  },
  {
    id: '2', name: 'Siti Nurhaliza Amd', nim: '205150400111008',
    university: 'Universitas Negeri Malang', faculty: 'Ekonomi', major: 'Akuntansi',
    semester: 5, phone: '082345678901', division: 'Research', program: 'BI Regular Internship',
    period: 'Januari – Maret 2025', registrationDate: '2024-11-03', status: 'review',
    skills: ['Excel', 'SPSS', 'Python', 'Analisis Data', 'Public Speaking'],
    recommendationLetterNo: 'SK/FE/AK/2024/112',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' }
    ],
    adminNotes: ''
  },
  {
    id: '3', name: 'Ahmad Fauzan Ibrahim', nim: '215150807111015',
    university: 'Universitas Islam Malang', faculty: 'Hukum', major: 'Ilmu Hukum',
    semester: 4, phone: '083456789012', division: 'Administration', program: 'BI Malabar Internship',
    period: 'April – Juni 2025', registrationDate: '2024-11-05', status: 'waiting',
    skills: ['Microsoft Office', 'Administrasi', 'Hukum Bisnis'],
    recommendationLetterNo: 'SK/FH/IH/2024/078',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' },
      { name: 'Proposal', type: 'pdf' }
    ],
    adminNotes: ''
  },
  {
    id: '4', name: 'Dewi Kusuma Wardani', nim: '195150500111031',
    university: 'Universitas Brawijaya', faculty: 'Pertanian', major: 'Agribisnis',
    semester: 7, phone: '084567890123', division: 'UMKM Assistance', program: 'BI Regular Internship',
    period: 'Januari – Maret 2025', registrationDate: '2024-10-28', status: 'accepted',
    skills: ['Agribisnis', 'Analisis Pasar', 'Excel', 'Presentasi'],
    recommendationLetterNo: 'SK/FP/AB/2024/034',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' },
      { name: 'NPWP', type: 'pdf' }, { name: 'Portfolio', type: 'pdf' }
    ],
    adminNotes: 'Latar belakang agribisnis sangat relevan dengan program UMKM.'
  },
  {
    id: '5', name: 'Muhammad Hendra Saputra', nim: '205150201111044',
    university: 'Institut Teknologi Malang', faculty: 'Teknik Elektro', major: 'Sistem Komputer',
    semester: 6, phone: '085678901234', division: 'Library', program: 'BI Regular Internship',
    period: 'Januari – Maret 2025', registrationDate: '2024-11-08', status: 'rejected',
    skills: ['Python', 'Database', 'Pemrograman Web'],
    recommendationLetterNo: 'SK/FTE/SK/2024/091',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' }
    ],
    adminNotes: 'Nilai akademik tidak memenuhi persyaratan minimum.'
  },
  {
    id: '6', name: 'Anisa Rahmawati', nim: '215150600111009',
    university: 'Universitas Muhammadiyah Malang', faculty: 'Psikologi', major: 'Psikologi',
    semester: 5, phone: '086789012345', division: 'Social Media', program: 'BI Malabar Internship',
    period: 'April – Juni 2025', registrationDate: '2024-11-12', status: 'review',
    skills: ['Komunikasi', 'Canva', 'Instagram', 'Copywriting', 'Public Speaking'],
    recommendationLetterNo: 'SK/FPSI/PSI/2024/056',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' },
      { name: 'Portfolio', type: 'pdf' }
    ],
    adminNotes: ''
  },
  {
    id: '7', name: 'Budi Santoso Prasetyo', nim: '195150300111017',
    university: 'Universitas Brawijaya', faculty: 'FISIP', major: 'Administrasi Bisnis',
    semester: 8, phone: '087890123456', division: 'Research', program: 'BI Regular Internship',
    period: 'Januari – Maret 2025', registrationDate: '2024-10-25', status: 'accepted',
    skills: ['Riset', 'Penulisan Laporan', 'Analisis Kebijakan', 'Excel', 'SPSS'],
    recommendationLetterNo: 'SK/FISIP/AB/2024/023',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' },
      { name: 'NPWP', type: 'pdf' }
    ],
    adminNotes: 'Pengalaman penelitian sangat baik, direkomendasikan oleh 2 dosen.'
  },
  {
    id: '8', name: 'Nurul Hidayah Putri', nim: '205150401111022',
    university: 'Universitas Negeri Malang', faculty: 'Ekonomi', major: 'Manajemen',
    semester: 5, phone: '088901234567', division: 'UMKM Assistance', program: 'BI Malabar Internship',
    period: 'April – Juni 2025', registrationDate: '2024-11-15', status: 'waiting',
    skills: ['Manajemen', 'Keuangan', 'Excel', 'PowerPoint'],
    recommendationLetterNo: 'SK/FE/MJ/2024/089',
    documents: [
      { name: 'CV', type: 'pdf' }, { name: 'Transkrip Nilai', type: 'pdf' },
      { name: 'Surat Rekomendasi', type: 'pdf' }, { name: 'KTP', type: 'jpg' }
    ],
    adminNotes: ''
  }
];

export const PROGRAMS: Program[] = [
  {
    id: '1', name: 'BI Regular Internship',
    description: 'Program magang reguler Bank Indonesia Malang untuk mahasiswa aktif S1/D4 dari berbagai perguruan tinggi di wilayah Malang Raya.',
    registrationStart: '2024-10-01', registrationEnd: '2024-11-30',
    internshipStart: '2025-01-06', internshipEnd: '2025-03-28',
    quota: 20, status: 'open', applicants: 45, accepted: 12
  },
  {
    id: '2', name: 'BI Malabar Internship',
    description: 'Program magang intensif Bank Indonesia Malang dengan fokus pada pemberdayaan UMKM dan penelitian ekonomi regional.',
    registrationStart: '2025-01-15', registrationEnd: '2025-03-15',
    internshipStart: '2025-04-07', internshipEnd: '2025-06-27',
    quota: 15, status: 'draft', applicants: 0, accepted: 0
  }
];

export const DIVISIONS: Division[] = [
  { id: '1', name: 'UMKM Assistance', description: 'Divisi pemberdayaan dan pendampingan UMKM binaan Bank Indonesia Malang', requirements: 'Ekonomi/Manajemen/Agribisnis, min. semester 5', quota: 4, active: true, applicants: 12 },
  { id: '2', name: 'Social Media', description: 'Pengelolaan konten media sosial dan komunikasi publik Bank Indonesia Malang', requirements: 'Semua jurusan, portofolio desain/konten', quota: 3, active: true, applicants: 18 },
  { id: '3', name: 'Library', description: 'Pengelolaan perpustakaan dan layanan informasi publik BI Corner', requirements: 'Perpustakaan/Informasi atau semua jurusan', quota: 2, active: true, applicants: 7 },
  { id: '4', name: 'Research', description: 'Riset ekonomi, keuangan, dan kebijakan moneter regional', requirements: 'Ekonomi/Statistik/Matematika, GPA min 3.0', quota: 5, active: true, applicants: 15 },
  { id: '5', name: 'Administration', description: 'Administrasi perkantoran dan dukungan operasional', requirements: 'Administrasi/Hukum/Semua jurusan', quota: 3, active: true, applicants: 9 },
  { id: '6', name: 'IT Support', description: 'Dukungan teknologi informasi dan sistem internal', requirements: 'Teknik Informatika/Sistem Informasi', quota: 2, active: false, applicants: 3 }
];

export const BOOKS: Book[] = [
  { id: '1', title: 'Ekonomi Moneter Indonesia', author: 'Prof. Dr. Soedradjad Djiwandono', publisher: 'LP3ES', genre: 'Ekonomi', year: 2022, isbn: '978-979-3490-80-1', status: 'available', type: 'physical', description: 'Analisis komprehensif kebijakan moneter Indonesia', stock: 5 },
  { id: '2', title: 'Bank Indonesia: Independensi & Kebijakan', author: 'Dr. Miranda Goeltom', publisher: 'Kompas', genre: 'Perbankan', year: 2021, isbn: '978-979-709-834-5', status: 'borrowed', type: 'physical', description: 'Sejarah dan kebijakan Bank Indonesia', stock: 3 },
  { id: '3', title: 'Manajemen UMKM Berbasis Digital', author: 'Ir. Agus Prasetyo', publisher: 'Gramedia', genre: 'Manajemen', year: 2023, isbn: '978-602-06-3245-7', status: 'available', type: 'physical', description: 'Strategi pengelolaan UMKM di era digital', stock: 8 },
  { id: '4', title: 'Sistem Keuangan Indonesia', author: 'Tim Peneliti BI', publisher: 'Bank Indonesia', genre: 'Keuangan', year: 2023, isbn: '978-979-94-4231-0', status: 'available', type: 'digital', description: 'Laporan tahunan sistem keuangan Indonesia', stock: 999 },
  { id: '5', title: 'Kebijakan Makroprudensial', author: 'Departemen Kebijakan Makroprudensial BI', publisher: 'Bank Indonesia', genre: 'Kebijakan', year: 2022, isbn: '978-979-94-4198-6', status: 'available', type: 'digital', description: 'Kerangka kebijakan makroprudensial BI', stock: 999 },
  { id: '6', title: 'Pengantar Ekonometrika', author: 'Prof. Damodar Gujarati (terjemahan)', publisher: 'Erlangga', genre: 'Statistik', year: 2020, isbn: '978-979-781-823-4', status: 'reserved', type: 'physical', description: 'Buku teks ekonometrika untuk mahasiswa', stock: 2 }
];

export const USERS: User[] = [
  { id: '1', name: 'Dr. Bambang Setyobudi', email: 'bambang.s@bi.go.id', role: 'admin', registrationDate: '2023-01-15', status: 'active' },
  { id: '2', name: 'Ibu Sri Wahyuni', email: 'sri.w@bi.go.id', role: 'staff', registrationDate: '2023-03-22', status: 'active' },
  { id: '3', name: 'Bapak Hendra Gunawan', email: 'hendra.g@bi.go.id', role: 'staff', registrationDate: '2023-06-10', status: 'active' },
  { id: '4', name: 'Rizky Fadillah Putra', email: 'rizky.f@student.ub.ac.id', role: 'user', registrationDate: '2024-11-01', status: 'active' },
  { id: '5', name: 'Siti Nurhaliza Amd', email: 'siti.n@student.um.ac.id', role: 'user', registrationDate: '2024-11-03', status: 'active' },
  { id: '6', name: 'Ahmad Fauzan Ibrahim', email: 'ahmad.f@student.unisma.ac.id', role: 'user', registrationDate: '2024-11-05', status: 'active' },
  { id: '7', name: 'Dewi Kusuma Wardani', email: 'dewi.k@student.ub.ac.id', role: 'user', registrationDate: '2024-10-28', status: 'active' },
  { id: '8', name: 'Muhammad Hendra S', email: 'hendra.s@student.itm.ac.id', role: 'user', registrationDate: '2024-11-08', status: 'suspended' }
];

export const MONTHLY_APPLICATIONS = [
  { month: 'Jan', applications: 12, accepted: 5 },
  { month: 'Feb', applications: 8, accepted: 3 },
  { month: 'Mar', applications: 5, accepted: 2 },
  { month: 'Apr', applications: 15, accepted: 7 },
  { month: 'Mei', applications: 22, accepted: 9 },
  { month: 'Jun', applications: 18, accepted: 8 },
  { month: 'Jul', applications: 10, accepted: 4 },
  { month: 'Agu', applications: 7, accepted: 3 },
  { month: 'Sep', applications: 14, accepted: 6 },
  { month: 'Okt', applications: 28, accepted: 11 },
  { month: 'Nov', applications: 45, accepted: 18 },
  { month: 'Des', applications: 20, accepted: 8 },
];

export const STATUS_DISTRIBUTION = [
  { name: 'Diterima', value: 38, color: '#10b981' },
  { name: 'Ditolak', value: 22, color: '#ef4444' },
  { name: 'On Review', value: 28, color: '#3b82f6' },
  { name: 'Menunggu', value: 12, color: '#f59e0b' },
];

export const DIVISION_STATS = [
  { division: 'Research', count: 24 },
  { division: 'Social Media', count: 20 },
  { division: 'UMKM Assist.', count: 18 },
  { division: 'Library', count: 12 },
  { division: 'Admin', count: 10 },
  { division: 'IT Support', count: 8 },
];

export const RECENT_ACTIVITIES = [
  { id: 1, type: 'applicant', text: 'Rizky Fadillah Putra mendaftar ke divisi Social Media', time: '5 menit lalu', icon: 'user' },
  { id: 2, type: 'program', text: 'Program BI Malabar Internship 2025 berhasil dibuat', time: '1 jam lalu', icon: 'program' },
  { id: 3, type: 'status', text: 'Status Siti Nurhaliza diperbarui menjadi On Review', time: '2 jam lalu', icon: 'update' },
  { id: 4, type: 'book', text: 'Buku "Ekonomi Moneter Indonesia" berhasil ditambahkan', time: '3 jam lalu', icon: 'book' },
  { id: 5, type: 'status', text: 'Dewi Kusuma Wardani dinyatakan Diterima', time: '5 jam lalu', icon: 'check' },
  { id: 6, type: 'applicant', text: 'Nurul Hidayah Putri mendaftar ke divisi UMKM Assistance', time: '6 jam lalu', icon: 'user' },
];

export const ARCHIVE_DATA = [
  { id: '1', applicant: 'Fajar Ramadan', program: 'BI Regular Internship', division: 'Research', period: 'Jan – Mar 2024', finalStatus: 'Lulus', completion: 'Selesai' },
  { id: '2', applicant: 'Lestari Wulandari', program: 'BI Regular Internship', division: 'Social Media', period: 'Jan – Mar 2024', finalStatus: 'Lulus', completion: 'Selesai' },
  { id: '3', applicant: 'Dimas Pratama', program: 'BI Malabar Internship', division: 'UMKM Assistance', period: 'Apr – Jun 2024', finalStatus: 'Lulus', completion: 'Selesai' },
  { id: '4', applicant: 'Yunita Sari', program: 'BI Regular Internship', division: 'Administration', period: 'Jan – Mar 2024', finalStatus: 'Tidak Lulus', completion: 'Tidak Selesai' },
  { id: '5', applicant: 'Rian Firmansyah', program: 'BI Malabar Internship', division: 'Research', period: 'Apr – Jun 2024', finalStatus: 'Lulus', completion: 'Selesai' },
];
