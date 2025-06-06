# BakuBantu

BakuBantu adalah aplikasi web berbasis Next.js yang berfokus pada pemberdayaan dan penyaluran bantuan untuk anak-anak dan komunitas rentan di Sulawesi Utara. Kami menjembatani kepedulian masyarakat dengan kebutuhan nyata di lapangan melalui kolaborasi, gotong royong, dan transparansi.

## Daftar Isi

- [Tentang](#tentang)
- [Fitur Utama](#fitur-utama)
- [Layanan](#layanan)
- [Cara Instalasi & Menjalankan](#cara-instalasi--menjalankan)
- [Struktur Proyek](#struktur-proyek)
- [Kontak](#kontak)
- [Lisensi](#lisensi)
- [Hak Cipta](#hak-cipta)

---

## Tentang

BakuBantu adalah organisasi non-pemerintah yang fokus pada komunitas. Kami membantu menghubungkan sumber daya dengan mereka yang membutuhkan, khususnya anak-anak di panti asuhan dan komunitas rentan di Sulawesi Utara. Kami percaya pada kekuatan kolaborasi dan gotong royong untuk menciptakan dampak positif yang berkelanjutan.

## Fitur Utama

- **Landing Page Interaktif**: Menampilkan informasi utama, statistik, dan ajakan untuk bergabung.
- **Profil Organisasi**: Penjelasan visi, misi, dan tim.
- **Layanan & Program**: Rincian layanan seperti perawatan anak, pendidikan, kegiatan sosial, bimbingan psikologis, dan program kemandirian.
- **Proyek & Kegiatan**: Dokumentasi proyek yang telah dan sedang berjalan.
- **Donasi Transparan**: Visualisasi penggunaan donasi.
- **Formulir Kontak**: Hubungi tim BakuBantu secara langsung.
- **Responsif & Modern**: Desain responsif dengan TailwindCSS dan animasi Framer Motion.

## Layanan

1. **Perawatan & Pengasuhan Anak**: Tempat tinggal aman, pengasuh terlatih, makanan bergizi, pemeriksaan kesehatan, dan dukungan emosional.
2. **Pendidikan & Pengembangan Diri**: Akses pendidikan formal, bimbingan belajar, pelatihan komputer, pengembangan bakat, dan program bahasa asing.
3. **Kegiatan Sosial & Rekreasi**: Olahraga, seni, rekreasi edukatif, kegiatan komunitas, dan perayaan hari besar.
4. **Bimbingan Rohani & Psikologis**: Konseling, terapi, pengembangan karakter, dan pendampingan personal.
5. **Program Kemandirian**: Pelatihan keterampilan hidup, vokasional, magang, perencanaan keuangan, dan persiapan pendidikan lanjutan.

## Cara Instalasi & Menjalankan

### Prasyarat

- Node.js >= 18.x
- npm

### Instalasi

```bash
git clone https://github.com/username/fe_bakubantu.git
cd fe_bakubantu
npm install
```

### Menjalankan Aplikasi

#### Mode Pengembangan

```bash
npm run dev
```

Akses di [http://localhost:3000](http://localhost:3000)

#### Build & Start Produksi

```bash
npm run build
npm start
```

### Linter

```bash
npm run lint
```

## Struktur Proyek

```
.
├── src/
│   ├── app/                # Routing dan halaman utama Next.js
│   ├── components/         # Komponen UI modular
│   ├── pages/              # (Jika ada) API routes
│   ├── lib/                # Library utilitas
│   ├── services/           # Service layer (API, dsb)
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript types
│   ├── modules/            # Modul fitur
│   ├── providers/          # Context Providers
│   └── contexts/           # React Contexts
├── public/                 # Asset publik (gambar, favicon, dsb)
├── package.json            # Konfigurasi npm & dependencies
├── tailwind.config.js      # Konfigurasi TailwindCSS
├── tsconfig.json           # Konfigurasi TypeScript
└── README.md               # Dokumentasi proyek
```

## Stack Teknologi

- **Next.js 15**
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion**
- **Recharts**
- **Axios**
- **Zod** (validasi)
- **ESLint** (linter)

## Kontak

- **Telepon**: +62 853-3715-2513 (Krisan - Lead Coordinator)
- **Email**: bakubantusulut@gmail.com
- **Alamat**: Walian, Tomohon Selatan, Kota Tomohon, Sulawesi Utara
- **Instagram**: [@bakubantusulut](https://www.instagram.com/bakubantusulut/)
- **LinkedIn**: [Baku Bantu Sulut](https://www.linkedin.com/company/baku-bantu-sulut/)

## Lisensi

Proyek ini bersifat open source dan dapat digunakan untuk tujuan sosial dan edukasi.

## Hak Cipta

&copy; 2024 Habibi  
Email: habibiramadhan.dev@gmail.com
