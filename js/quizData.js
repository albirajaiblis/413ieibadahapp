/* Islamic Quiz & Games Dataset (Tebak Ayat, Tebak Surah, Sambung Ayat) */

export const TEBAK_AYAT_QUESTIONS = [
  {
    id: 'ta_1',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    latin: 'Qul huwallāhu aḥad',
    translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
    options: ['QS. Al-Ikhlas: 1', 'QS. Al-Falaq: 1', 'QS. An-Nas: 1', 'QS. Al-Kafirun: 1'],
    answerIndex: 0,
    explanation: 'Merupakan ayat pertama dari Surah Al-Ikhlas yang menegaskan tauhid dan keesaan Allah SWT.'
  },
  {
    id: 'ta_2',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    latin: 'Al-ḥamdu lillāhi rabbil-ʿālamīn',
    translation: 'Segala puji bagi Allah, Tuhan seluruh alam.',
    options: ['QS. Al-Baqarah: 1', 'QS. Al-Fatihah: 2', 'QS. An-Nas: 2', 'QS. Al-Ikhlas: 2'],
    answerIndex: 1,
    explanation: 'Merupakan ayat ke-2 dari Surah Al-Fatihah.'
  },
  {
    id: 'ta_3',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    latin: 'Qul aʿūżu birabbil-falaq',
    translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar)"',
    options: ['QS. An-Nas: 1', 'QS. Al-Falaq: 1', 'QS. Al-Ikhlas: 1', 'QS. Al-Kafirun: 1'],
    answerIndex: 1,
    explanation: 'Merupakan ayat pertama dari Surah Al-Falaq.'
  },
  {
    id: 'ta_4',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    latin: 'Allāhu lā ilāha illā huwal-ḥayyul-qayyūm',
    translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus (makhluk-Nya).',
    options: ['QS. Al-Baqarah: 255 (Ayat Kursi)', 'QS. Ali Imran: 18', 'QS. Al-Hasjr: 22', 'QS. An-Nur: 35'],
    answerIndex: 0,
    explanation: 'Awal dari Ayat Kursi (Surah Al-Baqarah ayat 255), salah satu ayat paling agung dalam Al-Qur\'an.'
  },
  {
    id: 'ta_5',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    latin: 'Innā aʿṭainākal-kauṡar',
    translation: 'Sungguh, Kami telah memberimu (Muhammad) nikmat yang banyak.',
    options: ['QS. Al-Kautsar: 1', 'QS. Al-Ma\'un: 1', 'QS. Al-Qadr: 1', 'QS. An-Nasr: 1'],
    answerIndex: 0,
    explanation: 'Ayat pertama Surah Al-Kautsar, surah terpendek dalam Al-Qur\'an.'
  },
  {
    id: 'ta_6',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
    latin: 'Innā anzalnāhu fī lailatil-qadr',
    translation: 'Sesungguhnya Kami telah meurunkan Al-Qur\'an pada malam kemuliaan.',
    options: ['QS. Al-Qadr: 1', 'QS. Ad-Dukhan: 3', 'QS. Al-Baqarah: 185', 'QS. Al-Alaq: 1'],
    answerIndex: 0,
    explanation: 'Ayat pertama dari Surah Al-Qadr tentang peristiwa malam Lailatul Qadr.'
  },
  {
    id: 'ta_7',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    latin: 'Iqra\' bismi rabbikal-lażī khalaq',
    translation: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan,',
    options: ['QS. Al-Alaq: 1', 'QS. Al-Qalam: 1', 'QS. Al-Muzzammil: 1', 'QS. Al-Muddatstsir: 1'],
    answerIndex: 0,
    explanation: 'Ayat pertama yang diwahyukan kepada Nabi Muhammad SAW di Gua Hira (QS. Al-Alaq: 1).'
  },
  {
    id: 'ta_8',
    prompt: 'Surah & Ayat manakah bacaan berikut?',
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    latin: 'Tabārakal-lażī biyadihil-mulku wa huwa \'alā kulli syai\'in qadīr',
    translation: 'Mahasuci Allah yang menguasai (segala) kerajaan, dan Dia Mahakuasa atas segala sesuatu.',
    options: ['QS. Al-Mulk: 1', 'QS. As-Sajdah: 1', 'QS. Yasin: 1', 'QS. Ar-Rahman: 1'],
    answerIndex: 0,
    explanation: 'Ayat pertama dari Surah Al-Mulk (Tabarak).'
  }
];

export const TEBAK_SURAH_QUESTIONS = [
  {
    id: 'ts_1',
    prompt: 'Surah apakah yang dijuluki "Ummul Qur\'an" (Induk Al-Qur\'an) dan wajib dibaca dalam setiap rakaat shalat?',
    options: ['Surah Al-Fatihah', 'Surah Al-Baqarah', 'Surah Yasin', 'Surah Al-Ikhlas'],
    answerIndex: 0,
    explanation: 'Al-Fatihah disebut Ummul Qur\'an karena memuat inti pokok ajaran Al-Qur\'an.'
  },
  {
    id: 'ts_2',
    prompt: 'Surah manakah yang memiliki jumlah ayat paling banyak dalam Al-Qur\'an (286 ayat)?',
    options: ['Surah Ali \'Imran', 'Surah An-Nisa\'', 'Surah Al-Baqarah', 'Surah Al-Ma\'idah'],
    answerIndex: 2,
    explanation: 'Surah Al-Baqarah adalah surah terpanjang dengan 286 ayat.'
  },
  {
    id: 'ts_3',
    prompt: 'Surah apakah yang pahala membacanya setara dengan sepertiga Al-Qur\'an?',
    options: ['Surah Al-Ikhlas', 'Surah Al-Falaq', 'Surah An-Nas', 'Surah Al-Kafirun'],
    answerIndex: 0,
    explanation: 'Rasulullah SAW bersabda bahwa Surah Al-Ikhlas menyamai sepertiga Al-Qur\'an.'
  },
  {
    id: 'ts_4',
    prompt: 'Surah apakah yang diawali tanpa bacaan Basmalah di permulaannya?',
    options: ['Surah At-Taubah (Bara\'ah)', 'Surah An-Naml', 'Surah Al-Anfal', 'Surah Yasin'],
    answerIndex: 0,
    explanation: 'Surah At-Taubah tidak diawali Basmalah karena berisikan ketegasan dan pemutusan hubungan dengan kaum musyrikin.'
  },
  {
    id: 'ts_5',
    prompt: 'Surah apakah yang didalamnya terdapat kalimat Basmalah sebanyak DUA kali?',
    options: ['Surah An-Naml', 'Surah Al-Fatihah', 'Surah Al-Baqarah', 'Surah Al-Isra\''],
    answerIndex: 0,
    explanation: 'Surah An-Naml memiliki Basmalah di awal surah dan pada ayat ke-30 (surat Nabi Sulaiman AS).'
  },
  {
    id: 'ts_6',
    prompt: 'Surah manakah yang sering disebut sebagai "Jantung Al-Qur\'an" (Qalbul Qur\'an)?',
    options: ['Surah Yasin', 'Surah Ar-Rahman', 'Surah Al-Mulk', 'Surah Al-Waqi\'ah'],
    answerIndex: 0,
    explanation: 'Surah Yasin masyhur dikenal sebagai jantung Al-Qur\'an.'
  },
  {
    id: 'ts_7',
    prompt: 'Surah apakah yang memiliki pengulangan ayat "Fabi-ayyi ālā\'i rabbikumā tukażżibān" sebanyak 31 kali?',
    options: ['Surah Ar-Rahman', 'Surah Al-Waqi\'ah', 'Surah Al-Mursalat', 'Surah An-Naba\''],
    answerIndex: 0,
    explanation: 'Surah Ar-Rahman mengulang ayat penegasan nikmat tersebut sebanyak 31 kali.'
  },
  {
    id: 'ts_8',
    prompt: 'Surah apakah yang disunnahkan dibaca pada hari Jumat untuk mendapatkan cahaya di antara dua Jumat?',
    options: ['Surah Al-Kahfi', 'Surah Al-Jumu\'ah', 'Surah Sajdah', 'Surah Al-Mulk'],
    answerIndex: 0,
    explanation: 'Membaca Surah Al-Kahfi pada hari atau malam Jumat memancarkan cahaya bagi pembacanya.'
  }
];

export const SAMBUNG_AYAT_QUESTIONS = [
  {
    id: 'sa_1',
    prompt: 'Lanjutkan potongan ayat dari QS. Al-Fatihah berikut:',
    verseGiven: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5)',
    nextText: '...',
    options: [
      'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
      'مَالِكِ يَوْمِ الدِّينِ',
      'الرَّحْمَٰنِ الرَّحِيمِ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-6 QS. Al-Fatihah adalah "Ihdinaṣ-ṣirāṭal-mustaqīm" (Bunjukilah kami jalan yang lurus).'
  },
  {
    id: 'sa_2',
    prompt: 'Lanjutkan potongan ayat dari QS. Al-Ikhlas berikut:',
    verseGiven: 'اللَّهُ الصَّمَدُ (2)',
    nextText: '...',
    options: [
      'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
      'قُلْ هُوَ اللَّهُ أَحَدٌ',
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-3 QS. Al-Ikhlas adalah "Lam yalid wa lam yūlad" (Dia tidak beranak dan tidak pula diperanakkan).'
  },
  {
    id: 'sa_3',
    prompt: 'Lanjutkan potongan ayat dari QS. An-Nas berikut:',
    verseGiven: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2)',
    nextText: '...',
    options: [
      'إِلَٰهِ النَّاسِ',
      'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      'مِنَ الْجِنَّةِ وَالنَّاسِ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-3 QS. An-Nas adalah "Ilāhin-nās" (Sembahan manusia).'
  },
  {
    id: 'sa_4',
    prompt: 'Lanjutkan potongan ayat dari QS. Al-Asr berikut:',
    verseGiven: 'وَالْعَصْرِ (1) إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ (2)',
    nextText: '...',
    options: [
      'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      'أَلْهَاكُمُ التَّكَاثُرُ',
      'كَلَّا سَوْفَ تَعْلَمُونَ',
      'وَتَوَاصَوْا بِالْمَرْحَمَةِ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-3 QS. Al-Asr adalah pengecualian orang beriman dan beramal saleh.'
  },
  {
    id: 'sa_5',
    prompt: 'Lanjutkan potongan ayat dari QS. Al-Falaq berikut:',
    verseGiven: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1)',
    nextText: '...',
    options: [
      'مِنْ شَرِّ مَا خَلَقَ',
      'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-2 QS. Al-Falaq adalah "Min syarri mā khalaq" (Dari kejahatan makhluk yang Dia ciptakan).'
  },
  {
    id: 'sa_6',
    prompt: 'Lanjutkan potongan ayat dari QS. Al-Kafirun berikut:',
    verseGiven: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ (1)',
    nextText: '...',
    options: [
      'لَا أَعْبُدُ مَا تَعْبُدُونَ',
      'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ',
      'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
      'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ'
    ],
    answerIndex: 0,
    explanation: 'Ayat ke-2 QS. Al-Kafirun adalah "Lā a\'budu mā ta\'budūn" (Aku tidak akan menyembah apa yang kamu sembah).'
  }
];
