import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import Module from '../models/Module';
import Chapter from '../models/Chapter';
import Lesson from '../models/Lesson';
import Progress from '../models/Progress';

dotenv.config();

const YT = (id: string) => `https://www.youtube.com/embed/${id}`;

// ─── Tipe data untuk struktur seed ────────────────────────────────────────────

type LessonSeed = {
  title: string;
  type: 'video' | 'quiz' | 'task';
  order: number;
  duration: number;
  video_url: string | null;
  description: string;
  is_locked: boolean;
};

type ChapterSeed = {
  title: string;
  order: number;
  lessons: LessonSeed[];
};

type ModuleSeed = {
  title: string;
  order: number;
  chapters: ChapterSeed[];
};

type CourseSeed = {
  courseTitle: string;
  modules: ModuleSeed[];
};

// ─── Data seed semua course ────────────────────────────────────────────────────

const allCourses: CourseSeed[] = [
  // ── Course 1: Belajar Vue 3 dari Nol ────────────────────────────────────────
  {
    courseTitle: 'Belajar Vue 3 dari Nol',
    modules: [
      {
        title: 'Modul 1: Fundamental JavaScript',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Dasar JavaScript',
            order: 1,
            lessons: [
              {
                title: 'Pengantar JavaScript',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('hdI2bqOjy3c'),
                description: 'Kenalan dengan JavaScript — bahasa pemrograman web paling populer di dunia.',
                is_locked: false,
              },
              {
                title: 'Variabel & Tipe Data',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('PkZNo7MFNFg'),
                description: 'Pelajari var, let, const serta tipe data primitif di JavaScript.',
                is_locked: false,
              },
              {
                title: 'Quiz: Dasar JavaScript',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang variabel dan tipe data JavaScript.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: Function & Array',
            order: 2,
            lessons: [
              {
                title: 'Function & Arrow Function',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('PoRJizFvM7s'),
                description: 'Memahami function declaration, expression, dan arrow function ES6.',
                is_locked: true,
              },
              {
                title: 'Array Methods Modern',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('R8rmfD9Y5-c'),
                description: 'map, filter, reduce, find, dan method array lainnya yang wajib dikuasai.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: Vue 3 Core',
        order: 2,
        chapters: [
          {
            title: 'Bab 3: Setup & Composition API',
            order: 1,
            lessons: [
              {
                title: 'Instalasi Vue 3 & Vite',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('VySFHm3znkQ'),
                description: 'Setup project Vue 3 dengan Vite sebagai build tool modern.',
                is_locked: true,
              },
              {
                title: 'ref & reactive',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('nhBVL41-_Cw'),
                description: 'Pahami perbedaan ref dan reactive untuk state management di Vue 3.',
                is_locked: true,
              },
              {
                title: 'computed & watch',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('juocN5K1F6k'),
                description: 'Derived state dengan computed properties dan side effects dengan watch.',
                is_locked: true,
              },
              {
                title: 'Quiz: Composition API',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang Composition API Vue 3.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 4: Component & Router',
            order: 2,
            lessons: [
              {
                title: 'Props & Emit',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('4nY0R1a6M7w'),
                description: 'Komunikasi antar komponen dengan defineProps dan defineEmits.',
                is_locked: true,
              },
              {
                title: 'Slots & Provide/Inject',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('orAPczX0TJQ'),
                description: 'Pattern lanjutan untuk komposisi komponen yang fleksibel.',
                is_locked: true,
              },
              {
                title: 'Vue Router 4',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('GwkncHMVHfk'),
                description: 'Setup routing SPA dengan Vue Router — dynamic routes dan navigation guards.',
                is_locked: true,
              },
              {
                title: 'Pinia State Management',
                type: 'video',
                order: 4,
                duration: 720,
                video_url: YT('vZkH3kOsXW0'),
                description: 'Global state management yang ringan dan type-safe dengan Pinia.',
                is_locked: true,
              },
              {
                title: 'Build & Deploy ke Netlify',
                type: 'video',
                order: 5,
                duration: 360,
                video_url: YT('BVyZpRn8Tgg'),
                description: 'Build production bundle dan deploy Vue 3 app ke Netlify secara gratis.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Course 2: Node.js & Express REST API ────────────────────────────────────
  {
    courseTitle: 'Node.js & Express REST API',
    modules: [
      {
        title: 'Modul 1: Fundamental Node.js',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Pengenalan Node.js',
            order: 1,
            lessons: [
              {
                title: 'Apa itu Node.js?',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('TlB_eWDSMt4'),
                description: 'Pahami apa itu Node.js, kegunaannya, dan kenapa populer untuk backend development.',
                is_locked: false,
              },
              {
                title: 'Event Loop & Non-Blocking I/O',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('8aGhZQkoFbQ'),
                description: 'Konsep inti Node.js: event loop, call stack, dan non-blocking asynchronous I/O.',
                is_locked: false,
              },
              {
                title: 'npm & Package Management',
                type: 'video',
                order: 3,
                duration: 480,
                video_url: YT('jHDhaSSKmB0'),
                description: 'Cara kerja npm, package.json, dan mengelola dependencies project Node.js.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: Core Modules',
            order: 2,
            lessons: [
              {
                title: 'File System & Path Module',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('U57kU311-nE'),
                description: 'Baca, tulis, dan manipulasi file dengan module fs dan path bawaan Node.js.',
                is_locked: true,
              },
              {
                title: 'HTTP Module & Server Dasar',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('VShtPwEkGGo'),
                description: 'Buat HTTP server sederhana menggunakan module http tanpa framework.',
                is_locked: true,
              },
              {
                title: 'Quiz: Fundamental Node.js',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang dasar-dasar Node.js dan core modules.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: Express.js & MongoDB',
        order: 2,
        chapters: [
          {
            title: 'Bab 3: Express Framework',
            order: 1,
            lessons: [
              {
                title: 'Setup Express & Routing Dasar',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('L72fhnn2aos'),
                description: 'Install Express, buat router pertama, dan pahami struktur project REST API.',
                is_locked: true,
              },
              {
                title: 'Middleware & Error Handling',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('lY6icfhap2o'),
                description: 'Cara kerja middleware Express — logging, parsing body, dan global error handler.',
                is_locked: true,
              },
              {
                title: 'Request, Response & Status Codes',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('pKd0Rpw7O48'),
                description: 'Baca query params, body, dan headers. Kirim respons JSON dengan status code yang tepat.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 4: MongoDB & Mongoose',
            order: 2,
            lessons: [
              {
                title: 'Setup MongoDB Atlas',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('-PdjUx9JZ2E'),
                description: 'Buat cluster MongoDB gratis di Atlas dan sambungkan ke aplikasi Node.js.',
                is_locked: true,
              },
              {
                title: 'Mongoose Schema & Model',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('DZBGEVgL2eE'),
                description: 'Definisikan struktur data dengan Schema dan buat Model untuk query ke MongoDB.',
                is_locked: true,
              },
              {
                title: 'CRUD Operations',
                type: 'video',
                order: 3,
                duration: 720,
                video_url: YT('WDrU305J1yw'),
                description: 'Create, Read, Update, Delete data dengan Mongoose — lengkap dengan validasi.',
                is_locked: true,
              },
              {
                title: 'Aggregation Pipeline',
                type: 'video',
                order: 4,
                duration: 600,
                video_url: YT('A3jvoE0jGdE'),
                description: 'Query data kompleks dengan $match, $group, $lookup, dan operator aggregation lainnya.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 3: Authentication & Deploy',
        order: 3,
        chapters: [
          {
            title: 'Bab 5: JWT Authentication',
            order: 1,
            lessons: [
              {
                title: 'Register & Login dengan JWT',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('mbsmsi7l3r4'),
                description: 'Implementasi register, login, hashing password dengan bcrypt, dan generate JWT.',
                is_locked: true,
              },
              {
                title: 'Protected Routes & Middleware',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('7nafaH9SddU'),
                description: 'Buat middleware autentikasi dan otorisasi untuk mengamankan endpoint API.',
                is_locked: true,
              },
              {
                title: 'Refresh Token Strategy',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('tpkP2SVGUCQ'),
                description: 'Implementasi access token + refresh token untuk session management yang aman.',
                is_locked: true,
              },
              {
                title: 'Quiz: REST API Concepts',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang REST API, JWT authentication, dan keamanan API.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 6: Testing & Deploy',
            order: 2,
            lessons: [
              {
                title: 'Testing API dengan Postman',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('VywxIQ2ZXw4'),
                description: 'Buat collection Postman untuk testing semua endpoint REST API yang sudah dibuat.',
                is_locked: true,
              },
              {
                title: 'Environment Variables & Config',
                type: 'video',
                order: 2,
                duration: 360,
                video_url: YT('17UVejOw3zA'),
                description: 'Kelola konfigurasi app dengan dotenv — pisahkan secrets dari codebase.',
                is_locked: true,
              },
              {
                title: 'Deploy ke Railway',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('82r4SSVKP9I'),
                description: 'Deploy REST API Node.js ke Railway — dari push GitHub hingga live production URL.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Course 3: TypeScript untuk Pemula ───────────────────────────────────────
  {
    courseTitle: 'TypeScript untuk Pemula',
    modules: [
      {
        title: 'Modul 1: Dasar TypeScript',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Type System',
            order: 1,
            lessons: [
              {
                title: 'Pengenalan TypeScript',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('BwuLxPH8IDs'),
                description: 'Apa itu TypeScript, kenapa dibutuhkan, dan perbedaannya dengan JavaScript.',
                is_locked: false,
              },
              {
                title: 'Basic Types & Type Annotation',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('ahCwqrYpIuM'),
                description: 'string, number, boolean, any, unknown, never — cara annotasi tipe di TypeScript.',
                is_locked: false,
              },
              {
                title: 'Array, Tuple & Enum',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('nViEqpgwxHE'),
                description: 'Cara mendeklarasikan array bertipe, tuple dengan panjang tetap, dan enum konstanta.',
                is_locked: true,
              },
              {
                title: 'Quiz: Type System',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang sistem tipe TypeScript.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: Interface & Function',
            order: 2,
            lessons: [
              {
                title: 'Interface & Type Alias',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('crjimOr4b6M'),
                description: 'Definisikan struktur objek dengan interface dan type alias — kapan pakai yang mana.',
                is_locked: true,
              },
              {
                title: 'Function Types & Optional Params',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('JtuHVbl7hSE'),
                description: 'Annotasi parameter, return type, optional dan default parameter pada function.',
                is_locked: true,
              },
              {
                title: 'Classes & Access Modifiers',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('OsFwOzr3_sE'),
                description: 'OOP di TypeScript — class, constructor, public, private, protected, dan readonly.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: TypeScript Lanjutan',
        order: 2,
        chapters: [
          {
            title: 'Bab 3: Generics & Utility Types',
            order: 1,
            lessons: [
              {
                title: 'Generics',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('EcCTIExsqmI'),
                description: 'Buat fungsi dan tipe yang reusable dengan generics — <T> yang fleksibel.',
                is_locked: true,
              },
              {
                title: 'Utility Types (Partial, Pick, Omit)',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('lXJGBBBhU4Y'),
                description: 'Partial, Required, Pick, Omit, Record — built-in utility types yang wajib tahu.',
                is_locked: true,
              },
              {
                title: 'Quiz: Generics & Utility Types',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang generics dan utility types di TypeScript.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 4: Integrasi Project',
            order: 2,
            lessons: [
              {
                title: 'TypeScript dengan Node.js & Express',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('qy8PxD3alWw'),
                description: 'Setup TypeScript di project Express — tsconfig, @types, dan best practices.',
                is_locked: true,
              },
              {
                title: 'TypeScript dengan Vue 3 / React',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('ianigcCjQms'),
                description: 'Integrasi TypeScript ke project Vue 3 (lang="ts") dan React (TSX) secara penuh.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Course 4: React Native Mobile App ───────────────────────────────────────
  {
    courseTitle: 'React Native Mobile App',
    modules: [
      {
        title: 'Modul 1: Dasar React Native',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Setup & Fundamental',
            order: 1,
            lessons: [
              {
                title: 'Pengenalan React Native & Expo',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('0-S5a0eXPoc'),
                description: 'Apa itu React Native, bedanya dengan Flutter, dan kenapa Expo mempermudah development.',
                is_locked: false,
              },
              {
                title: 'Setup Development Environment',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('oBpNtNaFXxY'),
                description: 'Install Node.js, Expo CLI, dan setup emulator Android/iOS atau device fisik.',
                is_locked: false,
              },
              {
                title: 'JSX & Core Components',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('Hf4MJH0jDb4'),
                description: 'View, Text, Image, TouchableOpacity — komponen dasar React Native dan cara pakainya.',
                is_locked: true,
              },
              {
                title: 'StyleSheet & Flexbox',
                type: 'video',
                order: 4,
                duration: 720,
                video_url: YT('R2eqAgR_KlU'),
                description: 'Styling di React Native — StyleSheet API dan layout dengan Flexbox.',
                is_locked: true,
              },
              {
                title: 'Quiz: React Native Basics',
                type: 'quiz',
                order: 5,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang konsep dasar React Native.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: State & Props',
            order: 2,
            lessons: [
              {
                title: 'useState & useEffect',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('O6P86uwfdR0'),
                description: 'Hooks dasar React — useState untuk state lokal dan useEffect untuk side effects.',
                is_locked: true,
              },
              {
                title: 'Props & Component Reusability',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('BGTHV5YQRJM'),
                description: 'Kirim data antar komponen dengan props dan buat komponen yang reusable.',
                is_locked: true,
              },
              {
                title: 'FlatList & ScrollView',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('iMCM1NceGJY'),
                description: 'Render list data dengan FlatList yang dioptimasi dan ScrollView untuk konten panjang.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 3: Form & Input',
            order: 3,
            lessons: [
              {
                title: 'TextInput & Form Handling',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('6NHfjTqBB1s'),
                description: 'Buat form dengan TextInput — controlled component, validasi, dan submit handling.',
                is_locked: true,
              },
              {
                title: 'Keyboard Avoiding View',
                type: 'video',
                order: 2,
                duration: 360,
                video_url: YT('gUqgsYs_4_8'),
                description: 'Tangani keyboard yang menutupi input dengan KeyboardAvoidingView dan ScrollView.',
                is_locked: true,
              },
              {
                title: 'Quiz: Components & State',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang komponen, props, state, dan form di React Native.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: Navigasi & State Management',
        order: 2,
        chapters: [
          {
            title: 'Bab 4: React Navigation',
            order: 1,
            lessons: [
              {
                title: 'Stack Navigator',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('28Xr22XDcDg'),
                description: 'Navigasi antar screen dengan Stack Navigator — push, pop, dan header kustom.',
                is_locked: true,
              },
              {
                title: 'Tab Navigator',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('Q9jsn4gWYGw'),
                description: 'Buat bottom tab navigation yang umum di aplikasi mobile.',
                is_locked: true,
              },
              {
                title: 'Drawer Navigator',
                type: 'video',
                order: 3,
                duration: 480,
                video_url: YT('oZrqdJiMjS0'),
                description: 'Implementasi menu drawer slide-in untuk navigasi utama aplikasi.',
                is_locked: true,
              },
              {
                title: 'Passing Parameters antar Screen',
                type: 'video',
                order: 4,
                duration: 600,
                video_url: YT('7LPw4P_mPpk'),
                description: 'Kirim dan terima data antar screen menggunakan route.params.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 5: State Management',
            order: 2,
            lessons: [
              {
                title: 'Context API',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('35lXWvCuM8o'),
                description: 'Shared state antar komponen dengan React Context — tanpa library tambahan.',
                is_locked: true,
              },
              {
                title: 'Redux Toolkit',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('9boMnm5X9ak'),
                description: 'State management global yang scalable dengan Redux Toolkit dan slices.',
                is_locked: true,
              },
              {
                title: 'AsyncStorage (Persistent State)',
                type: 'video',
                order: 3,
                duration: 480,
                video_url: YT('k8PcFrth-2Y'),
                description: 'Simpan data secara persisten di device dengan AsyncStorage — token, preferensi user.',
                is_locked: true,
              },
              {
                title: 'Quiz: Navigation & State',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang navigasi dan state management di React Native.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 3: API & Deployment',
        order: 3,
        chapters: [
          {
            title: 'Bab 6: Fetch Data & Native Features',
            order: 1,
            lessons: [
              {
                title: 'Fetch API & Axios',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('RbfG7NLKDgQ'),
                description: 'Ambil data dari REST API dengan fetch dan Axios — loading state dan error handling.',
                is_locked: true,
              },
              {
                title: 'Loading & Error States',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('3CDnWKv5bMY'),
                description: 'Tampilkan skeleton loading, spinner, dan pesan error yang user-friendly.',
                is_locked: true,
              },
              {
                title: 'Camera & Image Picker',
                type: 'video',
                order: 3,
                duration: 720,
                video_url: YT('M6oLNbLdxAE'),
                description: 'Akses kamera dan galeri foto dengan expo-image-picker dan expo-camera.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 7: Build & Deploy',
            order: 2,
            lessons: [
              {
                title: 'Push Notifications dengan Expo',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('W6sAOzPQ3NA'),
                description: 'Implementasi push notification dengan Expo Notifications API.',
                is_locked: true,
              },
              {
                title: 'EAS Build & Submit ke Store',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('pLwmlNlYiJA'),
                description: 'Build APK/IPA dengan Expo EAS dan submit ke Google Play Store / App Store.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Course 5: UI/UX Design dengan Figma ─────────────────────────────────────
  {
    courseTitle: 'UI/UX Design dengan Figma',
    modules: [
      {
        title: 'Modul 1: Dasar Figma',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Interface & Tools',
            order: 1,
            lessons: [
              {
                title: 'Pengenalan Figma & Interface',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('FTFaQWZBqQ8'),
                description: 'Tour interface Figma — canvas, panels, toolbar, dan cara navigasi dasarnya.',
                is_locked: false,
              },
              {
                title: 'Shapes, Colors & Typography',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('svXl78HMmgs'),
                description: 'Kerja dengan shapes, fill, stroke, color styles, dan pengaturan font di Figma.',
                is_locked: false,
              },
              {
                title: 'Auto Layout',
                type: 'video',
                order: 3,
                duration: 720,
                video_url: YT('42g26OFMdSQ'),
                description: 'Auto Layout untuk buat elemen yang responsif dan mudah diubah ukurannya.',
                is_locked: true,
              },
              {
                title: 'Quiz: Figma Basics',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang dasar-dasar penggunaan Figma.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: Components & Design System',
            order: 2,
            lessons: [
              {
                title: 'Components & Variants',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('9iomYohANCI'),
                description: 'Buat komponen reusable dan variasi-nya (hover, disabled, active) di Figma.',
                is_locked: true,
              },
              {
                title: 'Design System & Styles',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('EK-pHkc5EL4'),
                description: 'Bangun design system lengkap — color palette, typography scale, dan spacing.',
                is_locked: true,
              },
              {
                title: 'Quiz: Components & Design System',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang components dan design system di Figma.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: Prototype & Handoff',
        order: 2,
        chapters: [
          {
            title: 'Bab 3: Prototyping & Handoff',
            order: 1,
            lessons: [
              {
                title: 'Interactions & Animations',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('H6BKOHH5prc'),
                description: 'Tambahkan interaksi klik, hover, dan animasi transisi antar frame di Figma.',
                is_locked: true,
              },
              {
                title: 'User Flow & Prototype Testing',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('KYul5svGRsI'),
                description: 'Rangkai frame menjadi user flow yang bisa diklik dan ditest oleh pengguna.',
                is_locked: true,
              },
              {
                title: 'Figma ke Developer (Handoff)',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('B242nuM3y2s'),
                description: 'Cara developer inspect design di Figma — spacing, font, asset export, dan dev mode.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── Course 6: Python untuk Data Science ─────────────────────────────────────
  {
    courseTitle: 'Python untuk Data Science',
    modules: [
      {
        title: 'Modul 1: Python Dasar',
        order: 1,
        chapters: [
          {
            title: 'Bab 1: Fundamental Python',
            order: 1,
            lessons: [
              {
                title: 'Pengenalan Python & Setup',
                type: 'video',
                order: 1,
                duration: 480,
                video_url: YT('kqtD5dpn9C8'),
                description: 'Install Python, setup VS Code, dan jalankan script Python pertama kamu.',
                is_locked: false,
              },
              {
                title: 'Variabel, Tipe Data & Operator',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('W8KRpG_-G6o'),
                description: 'int, float, string, bool — tipe data dasar Python dan operator aritmatika/logika.',
                is_locked: false,
              },
              {
                title: 'Control Flow (if, for, while)',
                type: 'video',
                order: 3,
                duration: 600,
                video_url: YT('DZwmZ8Usvnk'),
                description: 'Logika program dengan if-elif-else, perulangan for dan while di Python.',
                is_locked: true,
              },
              {
                title: 'Functions & Lambda',
                type: 'video',
                order: 4,
                duration: 600,
                video_url: YT('9Os0o3wzS_I'),
                description: 'Buat fungsi reusable, default arguments, *args/**kwargs, dan lambda expression.',
                is_locked: true,
              },
              {
                title: 'Quiz: Python Dasar',
                type: 'quiz',
                order: 5,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang dasar-dasar pemrograman Python.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 2: Data Structures',
            order: 2,
            lessons: [
              {
                title: 'List, Tuple & Dictionary',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('W8KRpG_-G6o'),
                description: 'Koleksi data di Python — list yang mutable, tuple immutable, dan dictionary key-value.',
                is_locked: true,
              },
              {
                title: 'String Manipulation',
                type: 'video',
                order: 2,
                duration: 480,
                video_url: YT('k9TUPpljqYo'),
                description: 'Slice, split, join, format string, dan method string lain yang sering dipakai.',
                is_locked: true,
              },
              {
                title: 'File I/O & Exception Handling',
                type: 'video',
                order: 3,
                duration: 480,
                video_url: YT('Uh2ebFW8OYM'),
                description: 'Baca dan tulis file teks/CSV dengan Python, serta tangani error dengan try-except.',
                is_locked: true,
              },
              {
                title: 'Quiz: Data Structures',
                type: 'quiz',
                order: 4,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang struktur data Python.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 2: Data Analysis',
        order: 2,
        chapters: [
          {
            title: 'Bab 3: NumPy & Pandas',
            order: 1,
            lessons: [
              {
                title: 'NumPy Array & Operasi Matriks',
                type: 'video',
                order: 1,
                duration: 720,
                video_url: YT('QUT1VHiLmmI'),
                description: 'Array N-dimensi dengan NumPy — indexing, slicing, broadcasting, dan operasi vektor.',
                is_locked: true,
              },
              {
                title: 'Pandas DataFrame',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('vmEHCJofslg'),
                description: 'Struktur data tabular dengan Pandas — buat, baca, dan manipulasi DataFrame.',
                is_locked: true,
              },
              {
                title: 'Data Cleaning',
                type: 'video',
                order: 3,
                duration: 720,
                video_url: YT('bDhvCp3_lYw'),
                description: 'Handle missing values, duplicate data, dan normalisasi kolom di Pandas.',
                is_locked: true,
              },
              {
                title: 'Aggregation & GroupBy',
                type: 'video',
                order: 4,
                duration: 600,
                video_url: YT('Wb2Tp35dZ-I'),
                description: 'Ringkas dan kelompokkan data dengan groupby, agg, pivot_table.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 4: Data Visualization',
            order: 2,
            lessons: [
              {
                title: 'Matplotlib Dasar',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('DAQNHzOcO5A'),
                description: 'Buat line chart, bar chart, scatter plot, dan histogram dengan Matplotlib.',
                is_locked: true,
              },
              {
                title: 'Seaborn & Statistical Plots',
                type: 'video',
                order: 2,
                duration: 600,
                video_url: YT('ooqXQ37XHMM'),
                description: 'Visualisasi statistik yang lebih indah dengan Seaborn — heatmap, boxplot, pairplot.',
                is_locked: true,
              },
              {
                title: 'Quiz: Data Analysis',
                type: 'quiz',
                order: 3,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang NumPy, Pandas, dan visualisasi data.',
                is_locked: true,
              },
            ],
          },
        ],
      },
      {
        title: 'Modul 3: Machine Learning',
        order: 3,
        chapters: [
          {
            title: 'Bab 5: Scikit-learn',
            order: 1,
            lessons: [
              {
                title: 'Pengenalan Machine Learning',
                type: 'video',
                order: 1,
                duration: 600,
                video_url: YT('ukzFI9rgwfU'),
                description: 'Supervised vs unsupervised learning, train/test split, dan konsep overfitting.',
                is_locked: true,
              },
              {
                title: 'Linear Regression',
                type: 'video',
                order: 2,
                duration: 720,
                video_url: YT('NUXdtN1W1FE'),
                description: 'Prediksi nilai kontinu dengan Linear Regression — fit, predict, dan evaluasi MSE/R².',
                is_locked: true,
              },
              {
                title: 'Classification (Logistic Regression & Decision Tree)',
                type: 'video',
                order: 3,
                duration: 720,
                video_url: YT('HBi-P5j0Kec'),
                description: 'Klasifikasi data dengan Logistic Regression dan Decision Tree di Scikit-learn.',
                is_locked: true,
              },
              {
                title: 'Model Evaluation & Cross Validation',
                type: 'video',
                order: 4,
                duration: 600,
                video_url: YT('fSytzGwwBVw'),
                description: 'Evaluasi model dengan accuracy, precision, recall, confusion matrix, dan k-fold CV.',
                is_locked: true,
              },
            ],
          },
          {
            title: 'Bab 6: Project & Deployment',
            order: 2,
            lessons: [
              {
                title: 'End-to-End ML Project',
                type: 'video',
                order: 1,
                duration: 900,
                video_url: YT('Wqmtf9SA_kk'),
                description: 'Proyek lengkap dari data collection, EDA, preprocessing, training, hingga evaluasi akhir.',
                is_locked: true,
              },
              {
                title: 'Quiz: Machine Learning',
                type: 'quiz',
                order: 2,
                duration: 0,
                video_url: null,
                description: 'Uji pemahaman kamu tentang konsep dan implementasi machine learning.',
                is_locked: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

// ─── Fungsi utama seed ─────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    for (const courseData of allCourses) {
      const course = await Course.findOne({ title: courseData.courseTitle });
      if (!course) {
        console.warn(`[SKIP] Course "${courseData.courseTitle}" tidak ditemukan. Jalankan seed:courses dulu.`);
        continue;
      }

      const courseId = course._id;

      // Hapus data lesson lama agar seeder idempotent
      const existingModules = await Module.find({ courseId });
      const moduleIds = existingModules.map((m) => m._id);
      const existingChapters = await Chapter.find({ moduleId: { $in: moduleIds } });
      const chapterIds = existingChapters.map((c) => c._id);

      await Promise.all([
        Progress.deleteMany({ courseId }),
        Lesson.deleteMany({ chapterId: { $in: chapterIds } }),
        Chapter.deleteMany({ moduleId: { $in: moduleIds } }),
        Module.deleteMany({ courseId }),
      ]);

      let totalLessons = 0;
      let totalDuration = 0;
      let totalVideos = 0;

      for (const moduleData of courseData.modules) {
        let moduleDuration = 0;

        const module = await Module.create({
          courseId,
          title: moduleData.title,
          order: moduleData.order,
        });

        for (const chapterData of moduleData.chapters) {
          let chapterDuration = 0;

          const chapter = await Chapter.create({
            moduleId: module._id,
            title: chapterData.title,
            order: chapterData.order,
          });

          for (const lessonData of chapterData.lessons) {
            await Lesson.create({
              chapterId: chapter._id,
              courseId,
              title: lessonData.title,
              type: lessonData.type,
              order: lessonData.order,
              duration: lessonData.duration,
              video_url: lessonData.video_url,
              description: lessonData.description,
              is_locked: lessonData.is_locked,
            });

            totalLessons++;
            totalDuration += lessonData.duration;
            chapterDuration += lessonData.duration;
            if (lessonData.type === 'video') totalVideos++;
          }

          await Chapter.findByIdAndUpdate(chapter._id, { chapter_duration: chapterDuration });
          moduleDuration += chapterDuration;
        }

        await Module.findByIdAndUpdate(module._id, { module_duration: moduleDuration });
      }

      // Sinkronkan statistik ke Course document
      await Course.findByIdAndUpdate(courseId, {
        total_lessons: totalLessons,
        video_amount: totalVideos,
        course_duration: totalDuration,
      });

      console.log(`✓ "${courseData.courseTitle}" — ${totalLessons} lessons (${totalVideos} video, ${Math.round(totalDuration / 60)} menit)`);
    }

    await mongoose.disconnect();
    console.log('\nSelesai!');
  } catch (err) {
    console.error('Seed gagal:', err);
    process.exit(1);
  }
}

seed();
