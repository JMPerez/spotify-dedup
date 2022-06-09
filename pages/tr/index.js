import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('tr', 'translation', {
        "menu.link-home": "Ana Sayfa",
        "menu.link-stats": "İstatistikler",
        "home.title": "Spotify Deduplicator",
        "home.description": "Çalma listelerinizden ve beğendiğiniz şarkılardan aynı olanları silin.",
        "home.login-button": "Spotify ile giriş yapın",
        "meta.title": "Spotify Dedup - Çalma listelerinizden ve kayıtlı şarkılarınızdan birden fazla olanları silin",
        "meta.description": "Spotify'da yinelenen şarkılarınızı çalma listelerinizden ve beğenilen şarkılarınızdan kolayca ve hızlıca kaldırın.",
        "features.find-remove.header": "Bul ve sil",
        "features.find-remove.body": "Dedup, {{- strongOpen}}Spotify kütüphanenize {{- strongClose}} birden fazla kez eklenen aynı şarkıları kontrol eder. Birden fazla kez eklenen şarkı bulunduğunda, çalma listelerinizden hızlıca bu şarkıların kopyalarını silebilirsiniz.",
        "features.safer.header": "Daha güvenli",
        "features.safer.body": "Dedup sadece {{- strongOpen}}yinelenen şarkıları{{- strongClose}} siler, geri kalan çalma listelerine ve kayıtlı şarkılara dokunmaz.",
        "features.open-source.header": "Açık Kaynak Kodlu",
        "features.open-source.body": "{{- linkGithubOpen}}Github'da kaynak kodlarımız{{- linkGithubClose}}a bakmak isteyebilirsiniz. Bu web uygulaması yinelenen şarkıları bulmak için {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}}'sini kullanır.",
        "reviews.title": "Kullanıcılarımızın yorumları:",
        "footer.author": "{{- linkOpen}}JMPerez 👨‍💻{{- linkClose}} tarafından ♥ ile yapıldı.",
        "footer.github": "{{- linkOpen}}GitHub'da 📃{{- linkClose}} kaynak kodlarımızı görüntüleyin.",
        "footer.bmc": "{{- linkOpen}}Kahve ☕ al{{- linkClose}}arak projeye destek verin.",
        "footer.spotify-top": "{{- linkOpen}}Spotify Top 🎧{{- linkClose}}'a giderek dinleme geçmişiniz hakkında bilgi alın.",
        "bmc.button": "Bana bir bardak kahve alır mıydın?",
        "result.duplicate.reason-same-id": "Yinelenen Şarkı",
        "result.duplicate.reason-same-data": "Yinelenen Şarkı (aynı isim, artist adı ve süre.)",
        "result.duplicate.track": "<4>{{trackArtistName}}</4> <2>tarafından</2> <0>{{trackName}}</0>",
        "process.status.finding": "Çalma listelerinde ve beğenilen şarkılarda yinelenen şarkılar aranıyor...",
        "process.status.complete": "Hazır!",
        "process.status.complete.body": "Çalma listelerinizi ve beğendiğiniz şarkıları kontrol ettik.",
        "process.status.complete.dups.body": "{{- strongOpen}}Yinelenenleri kaldır{{- strongClose}} butonuna tıkla ve hızlıca yinelenen şarkıları sil.",
        "process.status.complete.nodups.body": "Tebrikler! Çalma listelerinizde ve beğendiğiniz şarkılarınızda yinelenen şarkı yok.",
        "process.reading-library": "Çalma listelerinizi ve beğendiğiniz şarkıları kontrol ediyoruz…",
        "process.processing_one": "Yinelenen şarkıları arıyoruz, lütfen bir saniye bekleyin. {{count}} çalma listesi kaldı...",
        "process.processing_other": "Yinelenen şarkıları arıyoruz, lütfen bir saniye bekleyin. {{count}} çalma listesi kaldı...",
        "process.saved.title": "Beğendiğiniz şarkılar",
        "process.saved.duplicates_one": "Burada {{count}} yinelenen şarkı var.",
        "process.saved.duplicates_other": "Burada {{count}} yinelenen şarkı var.",
        "process.saved.remove-button": "Beğenilen şarkılardan yinelenenleri sil",
        "process.playlist.duplicates_one": "Bu çalma listesinde {{count}} yinelenen şarkı var.",
        "process.playlist.duplicates_other": "Bu çalma listesinde {{count}} yinelenen şarkı var.",
        "process.playlist.remove-button": "Bu çalma listesinden yinelenen şarkıları sil",
        "process.items.removed": "Yenilenen şarkılar silindi!",
        "spotifytop.heading": "🚀 Karşınızda Spotify Top!",
        "spotifytop.description": "Son zamanlarda hangi şarkıcıları, hangi şarkıları dinlediğinizi merak ettiniz mi?",
        "spotifytop.check1": "Spotify'da ne çaldığınıza dair size özel bir rapor almak için",
        "spotifytop.check2": "son projeme bir göz atın.",

    });
    i18n.changeLanguage('tr');
    return (
        <Page>
            <Index />
        </Page>
    );
}
export default IndexComponent;

