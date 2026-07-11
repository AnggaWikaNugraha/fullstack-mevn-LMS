import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson';
import QuizQuestion from '../models/QuizQuestion';

dotenv.config();

type QuestionSeed = {
  question: string;
  options: string[];
  correct_index: number;
  order: number;
};

type QuizSeed = {
  lessonTitle: string;
  passingScore: number;
  questions: QuestionSeed[];
};

// ─── Soal untuk semua quiz lesson (15 quiz × 5 soal) ──────────────────────────

const allQuizData: QuizSeed[] = [

  // ── Course 1: Belajar Vue 3 dari Nol ──────────────────────────────────────

  {
    lessonTitle: 'Quiz: Dasar JavaScript',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan utama antara `let` dan `var` di JavaScript?',
        options: [
          '`let` memiliki block scope, `var` memiliki function scope',
          '`let` hanya untuk angka, `var` untuk semua tipe',
          '`var` lebih baru dari `let`',
          'Tidak ada perbedaan',
        ],
        correct_index: 0,
        order: 1,
      },
      {
        question: 'Manakah yang merupakan tipe data primitif di JavaScript?',
        options: ['Array', 'Object', 'Function', 'Boolean'],
        correct_index: 3,
        order: 2,
      },
      {
        question: 'Apa output dari `typeof null`?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct_index: 2,
        order: 3,
      },
      {
        question: 'Manakah cara yang benar untuk mendeklarasikan konstanta?',
        options: ['let PI = 3.14', 'const PI = 3.14', 'var PI = 3.14', 'constant PI = 3.14'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa yang dimaksud dengan `undefined` di JavaScript?',
        options: [
          'Nilai yang sengaja dikosongkan',
          'Error saat program berjalan',
          'Variabel yang sudah dideklarasi tapi belum diberi nilai',
          'Tipe data khusus untuk angka tidak valid',
        ],
        correct_index: 2,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Composition API',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan utama antara `ref` dan `reactive` di Vue 3?',
        options: [
          '`ref` untuk objek, `reactive` untuk nilai primitif',
          '`ref` untuk nilai primitif (diakses via `.value`), `reactive` untuk objek',
          'Keduanya sama persis',
          '`reactive` sudah deprecated di Vue 3',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Kapan sebaiknya menggunakan `computed` di Vue 3?',
        options: [
          'Untuk menjalankan side effect saat data berubah',
          'Untuk membuat nilai yang diturunkan dari state lain secara reaktif',
          'Untuk memanggil API ke server',
          'Untuk mendefinisikan props komponen',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa fungsi `watch` di Composition API?',
        options: [
          'Membuat variabel reaktif',
          'Menghitung nilai berdasarkan state lain',
          'Menjalankan efek samping saat reactive source berubah',
          'Mendefinisikan event emitter',
        ],
        correct_index: 2,
        order: 3,
      },
      {
        question: 'Manakah cara yang benar mendefinisikan props di `<script setup>`?',
        options: [
          'props: { title: String }',
          'const props = defineProps<{ title: string }>()',
          'this.$props.title',
          'import props from "vue"',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa keuntungan utama menggunakan `<script setup>` di Vue 3?',
        options: [
          'Bisa menggunakan Options API bersamaan',
          'Semua binding otomatis ter-expose ke template tanpa return',
          'Hanya bisa dipakai di Vue 3.2+',
          'Menggantikan fungsi computed sepenuhnya',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  // ── Course 2: Node.js & Express REST API ──────────────────────────────────

  {
    lessonTitle: 'Quiz: Fundamental Node.js',
    passingScore: 60,
    questions: [
      {
        question: 'Apa yang dimaksud dengan "non-blocking I/O" di Node.js?',
        options: [
          'Node.js tidak bisa melakukan operasi file',
          'Operasi I/O berjalan di background tanpa memblokir eksekusi kode berikutnya',
          'Node.js menjalankan semua kode secara berurutan',
          'I/O hanya bisa dilakukan di main thread',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa fungsi dari `package.json` di project Node.js?',
        options: [
          'Menyimpan konfigurasi database',
          'Mendefinisikan metadata project, dependencies, dan scripts',
          'Menyimpan semua kode JavaScript',
          'File konfigurasi untuk web server',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Bagaimana cara mengimpor module bawaan Node.js?',
        options: [
          'import fs from "filesystem"',
          'const fs = require("fs")',
          'include("fs")',
          'load("fs")',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Apa itu Event Loop di Node.js?',
        options: [
          'Loop yang mengulang kode tanpa henti',
          'Mekanisme yang memungkinkan Node.js memproses operasi asinkron secara single-thread',
          'Framework untuk membuat event listener',
          'Fitur untuk membuat animasi di Node.js',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Perintah apa yang digunakan untuk menginstall package dari npm?',
        options: ['npm get <package>', 'npm install <package>', 'node add <package>', 'npm download <package>'],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: REST API Concepts',
    passingScore: 60,
    questions: [
      {
        question: 'HTTP method mana yang digunakan untuk membuat data baru di REST API?',
        options: ['GET', 'PUT', 'POST', 'DELETE'],
        correct_index: 2,
        order: 1,
      },
      {
        question: 'Apa yang disimpan di dalam JWT (JSON Web Token)?',
        options: [
          'Password user dalam bentuk terenkripsi',
          'Header, Payload (claims), dan Signature',
          'Hanya ID user',
          'Cookie session dari server',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'HTTP status code berapa yang menandakan resource berhasil dibuat?',
        options: ['200', '201', '204', '301'],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Apa fungsi middleware di Express.js?',
        options: [
          'Menggantikan controller',
          'Fungsi yang berjalan di antara request masuk dan response keluar',
          'Menghubungkan ke database',
          'Membuat route otomatis',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa perbedaan antara `PUT` dan `PATCH` dalam REST API?',
        options: [
          'Keduanya sama persis',
          '`PUT` mengganti seluruh resource, `PATCH` hanya memperbarui sebagian field',
          '`PATCH` mengganti seluruh resource, `PUT` hanya sebagian',
          '`PUT` untuk delete, `PATCH` untuk create',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  // ── Course 3: TypeScript untuk Pemula ─────────────────────────────────────

  {
    lessonTitle: 'Quiz: Type System',
    passingScore: 60,
    questions: [
      {
        question: 'Apa keuntungan utama menggunakan TypeScript dibanding JavaScript biasa?',
        options: [
          'TypeScript berjalan lebih cepat di browser',
          'TypeScript mendeteksi error tipe data saat kompilasi, sebelum runtime',
          'TypeScript bisa berjalan di server saja',
          'TypeScript tidak butuh Node.js',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Tipe apa yang digunakan untuk variabel yang bisa menyimpan nilai apa saja tapi tetap type-safe?',
        options: ['any', 'unknown', 'never', 'void'],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Bagaimana cara mendeklarasikan array of string di TypeScript?',
        options: ['string[]', 'Array(string)', 'array<string>', '[]string'],
        correct_index: 0,
        order: 3,
      },
      {
        question: 'Apa itu `enum` di TypeScript?',
        options: [
          'Tipe untuk array angka',
          'Sekumpulan konstanta bernama yang terkait',
          'Cara mendefinisikan fungsi',
          'Alias untuk tipe string',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa arti tipe `never` di TypeScript?',
        options: [
          'Nilai yang bisa null atau undefined',
          'Tipe untuk fungsi yang tidak mengembalikan nilai',
          'Tipe yang tidak pernah bisa terjadi — biasanya fungsi yang selalu throw error',
          'Sama dengan `void`',
        ],
        correct_index: 2,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Generics & Utility Types',
    passingScore: 60,
    questions: [
      {
        question: 'Apa fungsi Generics di TypeScript?',
        options: [
          'Membuat kode berjalan lebih cepat',
          'Membuat fungsi atau tipe yang bisa bekerja dengan berbagai tipe data secara type-safe',
          'Menghapus semua type annotation',
          'Menggantikan interface',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa yang dilakukan `Partial<T>` di TypeScript?',
        options: [
          'Membuat semua property wajib diisi',
          'Membuat semua property menjadi opsional',
          'Menghapus semua property',
          'Mengubah tipe semua property menjadi string',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa hasil dari `Pick<User, "name" | "email">`?',
        options: [
          'Tipe baru tanpa property name dan email',
          'Tipe baru hanya berisi property name dan email dari User',
          'Tipe baru dengan semua property User',
          'Error kompilasi',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Bagaimana cara mendeklarasikan fungsi generic di TypeScript?',
        options: [
          'function identity(arg: any): any { return arg; }',
          'function identity<T>(arg: T): T { return arg; }',
          'generic function identity(arg) { return arg; }',
          'function<T> identity(arg): T { return arg; }',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa yang dilakukan `Omit<T, K>` di TypeScript?',
        options: [
          'Membuat tipe baru hanya dengan property K',
          'Membuat tipe baru dengan semua property T kecuali K',
          'Menggabungkan dua tipe',
          'Membuat semua property menjadi readonly',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  // ── Course 4: React Native Mobile App ─────────────────────────────────────

  {
    lessonTitle: 'Quiz: React Native Basics',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan utama React Native dengan React (web)?',
        options: [
          'React Native menggunakan HTML dan CSS biasa',
          'React Native merender komponen native platform (View, Text) bukan elemen HTML',
          'React Native tidak bisa menggunakan JavaScript',
          'React Native hanya bisa untuk iOS',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Komponen apa yang digunakan untuk menampilkan teks di React Native?',
        options: ['<p>', '<span>', '<Text>', '<Label>'],
        correct_index: 2,
        order: 2,
      },
      {
        question: 'Apa yang digunakan untuk styling di React Native?',
        options: [
          'CSS file biasa',
          'StyleSheet.create() dengan properti JavaScript',
          'SCSS/SASS',
          'Tailwind CSS langsung',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Sistem layout apa yang digunakan React Native secara default?',
        options: ['CSS Grid', 'Flexbox', 'Absolute positioning', 'Float layout'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa keuntungan menggunakan Expo dibanding React Native CLI?',
        options: [
          'Expo lebih cepat saat runtime',
          'Expo memudahkan setup, menyediakan banyak API native siap pakai, dan tidak perlu Xcode/Android Studio',
          'Expo hanya untuk web',
          'Expo lebih kecil ukurannya',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Components & State',
    passingScore: 60,
    questions: [
      {
        question: 'Apa fungsi `useState` di React/React Native?',
        options: [
          'Menyimpan data ke database',
          'Membuat state lokal yang menyebabkan re-render saat berubah',
          'Memanggil API eksternal',
          'Membuat komponen baru',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Kapan `useEffect` berjalan jika dependency array-nya kosong `[]`?',
        options: [
          'Setiap kali render',
          'Hanya sekali saat komponen pertama kali di-mount',
          'Tidak pernah berjalan',
          'Hanya saat komponen di-unmount',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Komponen apa yang paling efisien untuk render list panjang di React Native?',
        options: ['ScrollView dengan map()', 'FlatList', 'ListView', 'View dengan forEach()'],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Bagaimana cara mengirim data dari komponen parent ke child?',
        options: ['Melalui state global', 'Melalui props', 'Melalui context saja', 'Tidak bisa langsung'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa itu "controlled component" dalam konteks TextInput?',
        options: [
          'TextInput yang tidak bisa diedit user',
          'TextInput yang nilainya dikendalikan oleh state React',
          'TextInput dengan validasi otomatis',
          'TextInput yang terhubung ke database',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Navigation & State',
    passingScore: 60,
    questions: [
      {
        question: 'Library apa yang paling umum digunakan untuk navigasi di React Native?',
        options: ['react-router-native', 'react-navigation', 'expo-router saja', 'native-navigate'],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Bagaimana cara mengirim parameter ke screen berikutnya di React Navigation?',
        options: [
          'navigation.push("Screen", params)',
          'navigation.navigate("Screen", { params })',
          'router.push("/screen?params")',
          'navigation.go("Screen", params)',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa perbedaan Stack Navigator dan Tab Navigator?',
        options: [
          'Stack untuk list, Tab untuk detail',
          'Stack untuk navigasi hierarkis (push/pop), Tab untuk perpindahan antar section utama',
          'Keduanya sama persis',
          'Tab lebih cepat dari Stack',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Apa keunggulan Redux Toolkit dibanding Redux klasik?',
        options: [
          'Redux Toolkit lebih lambat',
          'Redux Toolkit mengurangi boilerplate dengan createSlice, createAsyncThunk, dan Immer built-in',
          'Redux Toolkit tidak bisa digunakan di React Native',
          'Redux Toolkit menghilangkan kebutuhan akan reducer',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa itu AsyncStorage di React Native?',
        options: [
          'State management library',
          'Penyimpanan key-value persisten di device yang bersifat asinkron',
          'Database SQL untuk mobile',
          'Cache memory di RAM',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  // ── Course 5: UI/UX Design dengan Figma ───────────────────────────────────

  {
    lessonTitle: 'Quiz: Figma Basics',
    passingScore: 60,
    questions: [
      {
        question: 'Apa kelebihan utama Figma dibanding tools desain lain seperti Sketch?',
        options: [
          'Figma hanya bisa dipakai di Mac',
          'Figma berbasis browser dan mendukung kolaborasi real-time',
          'Figma tidak memiliki fitur prototyping',
          'Figma berbayar sedangkan Sketch gratis',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa fungsi "Frame" di Figma?',
        options: [
          'Hanya untuk grouping elemen saja',
          'Kontainer utama yang merepresentasikan layar atau komponen dengan constraint dan clipping',
          'Sama persis dengan Group',
          'Hanya untuk export gambar',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa yang dimaksud dengan "Auto Layout" di Figma?',
        options: [
          'Figma yang otomatis membuat desain',
          'Fitur yang membuat frame menyesuaikan ukuran secara otomatis berdasarkan kontennya',
          'Plugin untuk layout otomatis',
          'Grid system seperti CSS Grid',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Shortcut keyboard apa untuk membuat rectangle di Figma?',
        options: ['R', 'T', 'P', 'F'],
        correct_index: 0,
        order: 4,
      },
      {
        question: 'Apa itu "Constraints" pada elemen di Figma?',
        options: [
          'Batasan jumlah warna yang bisa dipakai',
          'Pengaturan bagaimana elemen berperilaku saat frame parent di-resize',
          'Cara mengunci layer agar tidak bisa diedit',
          'Pembatasan ukuran font',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Components & Design System',
    passingScore: 60,
    questions: [
      {
        question: 'Apa keuntungan membuat "Component" di Figma?',
        options: [
          'Membuat file lebih besar',
          'Perubahan pada main component otomatis diterapkan ke semua instance',
          'Hanya bisa digunakan di satu halaman',
          'Menggantikan Auto Layout',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa itu "Variants" di Figma?',
        options: [
          'Cara membuat animasi',
          'Variasi dari sebuah komponen (misal: button primary, secondary, disabled) dalam satu komponen set',
          'Template halaman yang berbeda',
          'Plugin untuk membuat variasi warna',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa itu Design System dalam konteks desain UI?',
        options: [
          'Software untuk membuat desain',
          'Kumpulan komponen, panduan gaya, dan aturan yang konsisten untuk produk digital',
          'Sistem operasi khusus untuk desainer',
          'Plugin marketplace Figma',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Apa fungsi "Local Styles" di Figma?',
        options: [
          'Style yang hanya berlaku di satu frame',
          'Menyimpan warna, font, efek, dan grid yang bisa digunakan ulang di seluruh file',
          'Style untuk mode gelap saja',
          'Style yang diunduh dari internet',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Saat menggunakan komponen dari library, apa yang terjadi jika main component diupdate?',
        options: [
          'Instance tidak berubah sama sekali',
          'Semua instance otomatis terupdate kecuali property yang sudah di-override',
          'Semua instance harus dihapus dan dibuat ulang',
          'Library harus didownload ulang',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  // ── Course 6: Python untuk Data Science ───────────────────────────────────

  {
    lessonTitle: 'Quiz: Python Dasar',
    passingScore: 60,
    questions: [
      {
        question: 'Apa output dari kode berikut: `print(type(3.14))`?',
        options: ["<class 'int'>", "<class 'float'>", "<class 'number'>", "<class 'decimal'>"],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Bagaimana cara mendefinisikan fungsi di Python?',
        options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa output dari `range(0, 5)`?',
        options: [
          '[0, 1, 2, 3, 4, 5]',
          'Sequence angka 0 sampai 4 (tidak termasuk 5)',
          '[1, 2, 3, 4, 5]',
          'Error karena range butuh 1 argumen',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Apa itu indentasi di Python?',
        options: [
          'Cara menambahkan komentar',
          'Cara Python mendefinisikan blok kode — bukan hanya gaya penulisan, tapi wajib secara sintaksis',
          'Fitur opsional untuk keterbacaan',
          'Cara mengimpor module',
        ],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa yang dilakukan `lambda x: x * 2` di Python?',
        options: [
          'Membuat variabel bernama lambda',
          'Membuat fungsi anonim yang menerima x dan mengembalikan x dikali 2',
          'Mendefinisikan konstanta',
          'Mengimpor module matematika',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Data Structures',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan antara List dan Tuple di Python?',
        options: [
          'List hanya untuk angka, Tuple untuk string',
          'List bersifat mutable (bisa diubah), Tuple bersifat immutable (tidak bisa diubah)',
          'Tuple lebih lambat dari List',
          'Tidak ada perbedaan',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Bagaimana cara mengakses nilai dari dictionary di Python?',
        options: [
          'dict.get_value("key")',
          'dict["key"] atau dict.get("key")',
          'dict->key',
          'dict.key()',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa yang dilakukan `list.append(item)` di Python?',
        options: [
          'Menambahkan item di awal list',
          'Menambahkan item di akhir list',
          'Mengganti semua item dengan item baru',
          'Menghapus item dari list',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Bagaimana cara mengambil karakter ke-2 sampai ke-4 dari string `s = "Python"`?',
        options: ['s[2:4]', 's[1:4]', 's(2,4)', 's.slice(2,4)'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa itu Set di Python?',
        options: [
          'Sama seperti List tapi lebih cepat',
          'Koleksi yang tidak berurutan dan tidak memiliki elemen duplikat',
          'Dictionary tanpa value',
          'Tuple yang bisa diubah',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Data Analysis',
    passingScore: 60,
    questions: [
      {
        question: 'Apa keunggulan NumPy Array dibanding List Python biasa untuk komputasi numerik?',
        options: [
          'NumPy Array bisa menyimpan lebih banyak data',
          'NumPy Array mendukung operasi vektor yang jauh lebih cepat menggunakan C di balik layar',
          'NumPy Array lebih mudah dibaca',
          'NumPy Array support semua tipe data',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa fungsi `df.dropna()` di Pandas?',
        options: [
          'Menghapus seluruh DataFrame',
          'Menghapus baris atau kolom yang mengandung nilai NaN (missing value)',
          'Mengisi nilai NaN dengan 0',
          'Mengurutkan data',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa yang dilakukan `df.groupby("kategori").mean()` di Pandas?',
        options: [
          'Mengurutkan kolom kategori',
          'Mengelompokkan data berdasarkan kolom kategori lalu menghitung rata-rata tiap grup',
          'Menghapus kolom kategori',
          'Memfilter baris berdasarkan kategori',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Library apa yang digunakan untuk visualisasi data statistik yang lebih indah di Python?',
        options: ['Pillow', 'Seaborn', 'OpenCV', 'Bokeh'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa fungsi `pd.read_csv("data.csv")` di Pandas?',
        options: [
          'Menyimpan DataFrame ke file CSV',
          'Membaca file CSV dan mengubahnya menjadi DataFrame',
          'Memvalidasi format CSV',
          'Membuat file CSV kosong',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },

  {
    lessonTitle: 'Quiz: Machine Learning',
    passingScore: 60,
    questions: [
      {
        question: 'Apa perbedaan antara Supervised dan Unsupervised Learning?',
        options: [
          'Supervised lebih lambat dari Unsupervised',
          'Supervised belajar dari data berlabel, Unsupervised menemukan pola dari data tanpa label',
          'Unsupervised butuh lebih banyak data berlabel',
          'Tidak ada perbedaan signifikan',
        ],
        correct_index: 1,
        order: 1,
      },
      {
        question: 'Apa itu overfitting dalam machine learning?',
        options: [
          'Model terlalu sederhana sehingga tidak bisa belajar dari data',
          'Model terlalu menghapal data training sehingga performanya buruk di data baru',
          'Model yang berjalan terlalu lama',
          'Dataset yang terlalu besar',
        ],
        correct_index: 1,
        order: 2,
      },
      {
        question: 'Apa fungsi `train_test_split` di Scikit-learn?',
        options: [
          'Membagi model menjadi dua versi',
          'Membagi dataset menjadi data training dan data testing',
          'Melatih dua model sekaligus',
          'Menguji performa dua algoritma',
        ],
        correct_index: 1,
        order: 3,
      },
      {
        question: 'Metric evaluasi apa yang cocok untuk masalah klasifikasi biner yang imbalanced?',
        options: ['Accuracy saja', 'Precision, Recall, dan F1-Score', 'MSE', 'R-squared'],
        correct_index: 1,
        order: 4,
      },
      {
        question: 'Apa itu Cross Validation dalam machine learning?',
        options: [
          'Teknik validasi dengan satu train/test split',
          'Teknik evaluasi model dengan membagi data menjadi k-fold untuk mendapat estimasi performa yang lebih robust',
          'Cara mengvalidasi format data',
          'Perbandingan dua dataset berbeda',
        ],
        correct_index: 1,
        order: 5,
      },
    ],
  },
];

// ─── Fungsi utama seed ─────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    let totalQuestions = 0;

    for (const data of allQuizData) {
      const lesson = await Lesson.findOne({ title: data.lessonTitle, type: 'quiz' });
      if (!lesson) {
        console.warn(`[SKIP] Lesson "${data.lessonTitle}" tidak ditemukan — jalankan seed:all-lessons dulu.`);
        continue;
      }

      // Update passing_score di lesson
      await Lesson.findByIdAndUpdate(lesson._id, { passing_score: data.passingScore });

      // Hapus soal lama agar idempotent
      await QuizQuestion.deleteMany({ lessonId: lesson._id });

      for (const q of data.questions) {
        await QuizQuestion.create({ lessonId: lesson._id, ...q });
        totalQuestions++;
      }

      console.log(`✓ "${data.lessonTitle}" — ${data.questions.length} soal`);
    }

    console.log(`\nTotal: ${totalQuestions} soal dari ${allQuizData.length} quiz`);
    await mongoose.disconnect();
    console.log('Selesai!');
  } catch (err) {
    console.error('Seed gagal:', err);
    process.exit(1);
  }
}

seed();
