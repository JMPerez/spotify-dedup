import '../../i18n';

import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('id', 'translation', {
        'menu.link-home': 'Beranda',
        'menu.link-stats': 'Statistik',
        'home.title': 'Hapus lagu-lagu duplikat dari perpustakaan Spotify Anda.',
        'home.description': 'Spotify Dedup membersihkan daftar putar dan lagu yang disimpan dari akun Spotify Anda. Mudah dan cepat.',
        'home.login-button': 'Masuk dengan Spotify',
        'home.review': 'Baca apa yang dipikirkan oleh lebih dari {{-supportersCount}} pendukung tentang Spotify Dedup di {{- linkOpen}}Buy Me a Coffee{{- linkClose}}.',
        'meta.title': 'Spotify Dedup - Hapus lagu duplikat dari perpustakaan Spotify Anda',
        'meta.description': 'Hapus lagu berulang dari daftar putar Spotify Anda dan simpan trek secara otomatis. Cepat dan mudah.',
        'features.find-remove.header': 'Temukan & hapus',
        'features.find-remove.body': 'Dedup memeriksa daftar putar Anda dan menyimpan lagu di {{- strongOpen}}pustaka Spotify Anda{{- strongClose}}. Setelah Dedup menemukan duplikat, Anda dapat menghapusnya berdasarkan daftar putar.',
        'features.safer.header': 'Lebih aman',
        'features.safer.body': 'Dedup hanya akan menghapus {{- strongOpen}}lagu duplikat{{- strongClose}}, sehingga sisa daftar putar dan lagu yang disimpan tidak tersentuh.',
        'features.open-source.header': 'Sumber Terbuka',
        'features.open-source.body': "Anda mungkin ingin melihat {{- linkGithubOpen}}kode sumber di GitHub{{- linkGithubClose}}. Aplikasi web ini menggunakan {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} untuk mengelola daftar putar dan trek yang disimpan.",
        'reviews.title': 'Ini yang dikatakan pengguna',
        'footer.author': 'Dibuat dengan oleh {{- linkOpen}}JMPerez {{- linkClose}}',
        'footer.github': 'Lihat kode {{- linkOpen}}di GitHub {{- linkClose}}',
        'footer.bmc': 'Dukung proyek {{- linkOpen}}membeli kopi {{- linkClose}}',
        'footer.musicalyst': 'Kunjungi {{- linkOpen}}Musicalyst {{- linkClose}} untuk melihat statistik tentang riwayat mendengarkan Anda',
        'bmc.button': 'Maukah Anda membelikan saya kopi?',
        'result.duplicate.reason-same-id': 'Duplikat',
        'result.duplicate.reason-same-data': 'Duplikat (nama, artis, dan durasi yang sama)',
        'result.duplicate.track': '<0>{{trackName}}</0> <2>oleh</2> <4>{{trackArtistName}}</4>',
        'process.status.finding': 'Menemukan duplikat di daftar putar Anda dan menyimpan lagu…',
        'process.status.complete': 'Pemrosesan selesai!',
        'process.status.complete.body': 'Daftar putar dan lagu yang Anda simpan telah diproses!',
        'process.status.complete.dups.body': 'Klik tombol {{- strongOpen}}Hapus duplikat{{- strongClose}} untuk menghilangkan duplikat dalam daftar putar atau koleksi lagu yang disimpan.',
        'process.status.complete.nodups.body': "Selamat! Anda tidak memiliki duplikat di daftar putar atau lagu yang disimpan.",
        'process.reading-library': 'Menelusuri perpustakaan Anda, menemukan daftar putar yang Anda miliki dan lagu-lagu yang Anda simpan...',
        'process.processing_one': 'Mencari lagu duplikat, tunggu sebentar. Masih memproses {{count}} playlist…',
        'process.processing_other': 'Mencari lagu duplikat, tunggu sebentar. Masih memproses {{count}} playlist…',
        'process.saved.title': 'Lagu yang disimpan di perpustakaan Anda',
        'process.saved.duplicates_one': 'Koleksi ini memiliki {{count}} lagu duplikat',
        'process.saved.duplicates_other': 'Koleksi ini memiliki {{count}} lagu duplikat',
        'process.saved.remove-button': 'Hapus duplikat dari lagu yang Anda simpan',
        'process.playlist.duplicates_one': 'Daftar putar ini memiliki {{count}} lagu duplikat',
        'process.playlist.duplicates_other': 'Daftar putar ini memiliki {{count}} lagu duplikat',
        'process.playlist.remove-button': 'Hapus duplikat dari daftar putar ini',
        'process.items.removed': 'Duplikat dihapus',
        'faq.section-title': "Pertanyaan umum",
        'faq.question-1': 'Apa yang dilakukan aplikasi web ini?',
        'faq.answer-1': 'Spotify Dedup membantu Anda membersihkan pustaka musik di Spotify dengan mengidentifikasi dan menghapus lagu duplikat di seluruh daftar putar dan lagu yang disimpan.',
        'faq.question-2': 'Bagaimana alat ini menemukan duplikat?',
        'faq.answer-2': 'Alat menemukan duplikat berdasarkan kesamaan pengidentifikasi lagu, judul, artis, dan durasi. Ini mengidentifikasi duplikat yang tidak ditemukan oleh aplikasi Spotify.',
        'faq.question-3': 'Bagaimana alat ini lebih baik daripada deteksi duplikat Spotify?',
        'faq.answer-3': ' Lagu yang sama dapat memiliki banyak pengidentifikasi di Spotify baik dalam rilis yang sama atau dalam beberapa rilis. Spotify hanya memperingatkan tentang duplikat berdasarkan pengenal lagu, sedangkan alat ini juga mendeteksi duplikat berdasarkan kemiripan judul, artis, dan durasi.',
        'faq.question-4': 'Ketika duplikat ditemukan, lagu mana yang dihapus?',
        'faq.answer-4': 'Dedup akan menyimpan lagu pertama dalam grup lagu duplikat, dan akan menghapus sisanya.',
        'faq.question-5': 'Apakah data saya aman dengan aplikasi web ini?',
        'faq.answer-5': 'Ya, aplikasi web ini tidak menyimpan data pengguna apa pun di servernya. Itu hanya meminta izin minimum yang diperlukan untuk memproses pustaka Anda.',
        'faq.question-6': 'Izin apa yang dibutuhkan oleh aplikasi web ini?',
        'faq.answer-6': 'Aplikasi web ini menggunakan layanan autentikasi Spotify untuk mengakses lagu dan daftar putar tersimpan di perpustakaan Anda.',
        'faq.question-7': 'Bagaimana alat ini diuji?',
        'faq.answer-7': 'Alat ini telah diuji coba oleh ribuan pengguna yang telah menggunakannya untuk mengidentifikasi duplikat di jutaan daftar putar sejak 2014.',
        'faq.question-8': 'Dapatkah alat ini menghapus duplikat di banyak daftar putar?',
        'faq.answer-8': 'Alat ini dapat mengidentifikasi dan menghapus duplikat pada semua daftar putar di perpustakaan, tetapi tidak mendeteksi duplikat lagu di banyak daftar putar.',
        'faq.question-9': 'Bagaimana cara mencabut izin yang diberikan untuk aplikasi web ini?',
        'faq.answer-9': 'Pengguna dapat mencabut izin yang diberikan untuk aplikasi web ini kapan saja di akun Spotify Anda, di bawah bagian \'Aplikasi\'.',
        'faq.question-10': 'Apakah alat ini berfungsi dengan layanan streaming musik lainnya?',
        'faq.answer-10': 'Tidak, alat ini hanya bekerja dengan Spotify dan menggunakan API Web Spotify untuk mengidentifikasi dan menghapus duplikat di perpustakaan Anda.'
    });
    i18n.changeLanguage('id');
    return (
        <Page><Index />
        </Page>
    );
};

export default IndexComponent;
