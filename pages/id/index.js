import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('id', 'translation', {
        'menu.link-home': 'Beranda',
        'menu.link-stats': 'Statistik',
        'home.title': 'Spotify Deduplikator',
        'home.description': 'Hapus lagu duplikat dari daftar putar Anda dan simpan lagu.',
        'home.login-button': 'Masuk dengan Spotify',
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
        'footer.spotify-top': 'Kunjungi {{- linkOpen}}Spotify Top {{- linkClose}} untuk melihat statistik tentang riwayat mendengarkan Anda',
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
        'spotifytop.heading': '🚀 Memperkenalkan Spotify Top!',
        'spotifytop.description': 'Pernah bertanya-tanya artis, lagu, atau genre apa yang paling sering Anda dengarkan akhir-akhir ini?',
        'spotifytop.check1': 'Periksa proyek terbaru saya',
        'spotifytop.check2': 'untuk mendapatkan wawasan yang dipersonalisasi tentang apa yang telah Anda putar di Spotify',
    });
    i18n.changeLanguage('id');
    return (
        <Page><Index />
        </Page>
    );
};

export default IndexComponent;
