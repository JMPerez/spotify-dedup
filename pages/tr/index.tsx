import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('tr', 'translation', {
        "menu.link-home": "Ana Sayfa",
        "menu.link-stats": "İstatistikler",
        "home.title": "Spotify kütüphanenizden çift kopyalı şarkıları silin.",
        "home.description": "Spotify Dedup çalma listelerinizi ve kaydedilen şarkılarınızı Spotify hesabınızdan temizler. Kolay ve hızlıdır.",
        "home.login-button": "Spotify ile giriş yapın",
        "meta.title": "Spotify Dedup - Çalma listesi ve kaydedilmiş şarkılardaki çiftleri silin",
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
        "footer.musicalyst": "{{- linkOpen}}Musicalyst 🎧{{- linkClose}}'a giderek dinleme geçmişiniz hakkında bilgi alın.",
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
        "spotifytop.heading": "🚀 Karşınızda Musicalyst!",
        "spotifytop.description": "Son zamanlarda hangi şarkıcıları, hangi şarkıları dinlediğinizi merak ettiniz mi?",
        "spotifytop.check1": "Spotify'da ne çaldığınıza dair size özel bir rapor almak için",
        "spotifytop.check2": "son projeme bir göz atın.",
        'faq.section-title': "Sıkça sorulan sorular",
        'faq.question-1': 'Bu web uygulaması ne yapıyor?',
        'faq.answer-1': 'Spotify Dedup, çalma listeleri ve kayıtlı şarkılar arasında yinelenen şarkıları belirleyip silerek Spotify\'daki müzik kitaplıklarınızı temizlemenize yardımcı olur.',
        'faq.question-2': 'Bu araç kopyaları nasıl buluyor?',
        'faq.answer-2': 'Araç, şarkı tanımlayıcısına, başlığa, sanatçıya ve süre benzerliğine göre kopyaları bulur. Spotify\'ın uygulamasının bulamadığı kopyaları tanımlar.',
        'faq.question-3': 'Bu araç nasıl Spotify\'ın kopya tespitinden daha iyi?',
        'faq.answer-3': ' Aynı şarkının Spotify\'da hem aynı sürümde hem de birkaç sürümde birden fazla tanımlayıcısı olabilir.Spotify yalnızca şarkı tanımlayıcısına göre kopyalar hakkında uyarır, oysa bu araç aynı zamanda başlık, sanatçı ve süre benzerliğine göre kopyaları da algılar.',
        'faq.question-4': 'Kopyalar bulunduğunda hangi şarkılar kaldırılır?',
        'faq.answer-4': 'Dedup, yinelenen şarkılar grubundaki ilk şarkıyı tutacak ve gerisini kaldıracaktır.',
        'faq.question-5': 'Verilerim bu web uygulamasıyla güvende mi?',
        'faq.answer-5': 'Evet, bu web uygulaması sunucularında herhangi bir kullanıcı verisi saklamaz. Yalnızca kitaplığınızı işlemek için gereken minimum izin kümesini ister.',
        'faq.question-6': 'Bu web uygulaması hangi izinleri gerektiriyor?',
        'faq.answer-6': 'Bu web uygulaması, kitaplığınızdaki kayıtlı parçalarınıza ve çalma listelerinize erişmek için Spotify\'ın kimlik doğrulama hizmetini kullanır.',
        'faq.question-7': 'Bu araç nasıl test edildi?',
        'faq.answer-7': 'Bu araç, 2014\'ten beri milyonlarca oynatma listesindeki kopyaları tespit etmek için onu kullanan binlerce kullanıcı tarafından savaşta test edilmiştir.',
        'faq.question-8': 'Bu araç birden çok oynatma listesindeki kopyaları silebilir mi?',
        'faq.answer-8': 'Bu araç, bir kitaplıktaki tüm çalma listelerindeki kopyaları belirleyebilir ve silebilir, ancak bir şarkının birden fazla çalma listesindeki yinelemelerini algılamaz.',
        'faq.question-9': 'Bu web uygulamasına verilen izinleri nasıl iptal edebilirim?',
        'faq.answer-9': 'Kullanıcılar bu web uygulamasına verilen izinleri istedikleri zaman Spotify hesabınızda \'Uygulamalar\' bölümünden iptal edebilirler.',
        'faq.question-10': 'Bu araç diğer müzik akışı hizmetleriyle çalışır mı?',
        'faq.answer-10': 'Hayır, bu araç yalnızca Spotify ile çalışır ve kitaplığınızdaki kopyaları belirlemek ve silmek için Spotify\'ın Web API\'sini kullanır.'
    });
    i18n.changeLanguage('tr');
    return (
        <Page>
            <Index />
        </Page>
    );
}
export default IndexComponent;

