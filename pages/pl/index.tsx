import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('pl', 'translation', {
        'menu.link-home': 'Home',
        'menu.link-stats': 'Statystyki',
        'home.title': 'Usuń zduplikowane utwory ze swojej biblioteki Spotify.',
        'home.description':
            'Spotify Dedup czyści twoje listy odtwarzania i zapisane utwory z twojego konta Spotify. To łatwe i szybkie.',
        'home.login-button': 'Zaloguj się przez Spotify',
        'meta.title':
            'Spotify Dedup - Usuń duplikaty utworów w Spotify',
        'meta.description':
            'Szybko i łatwo usuń zduplikowane utwory ze swoich playlist i zapisanych utworów na Spotify. Zaoszczędź czas i uniknij stresu!',
        'features.find-remove.header': 'Znajdź i usuń',
        'features.find-remove.body':
            'Dedup sprawdza twoje playlisty i polubione utwory w {{- strongOpen}}bibliotece Spotify{{- strongClose}}. Gdy Dedup znajdzie duplikaty, możesz je usunąć z poszczególnych playlist.',
        'features.safer.header': 'Bezpieczny',
        'features.safer.body':
            'Dedup usunie tylko {{- strongOpen}}zduplikowane utwory{{- strongClose}}, pozostawiając resztę playlist i polubionych utworów nietkniętą.',
        'features.open-source.header': 'Open Source',
        'features.open-source.body':
            'Możesz zajrzeć do {{- linkGithubOpen}}kodu źródłowego na GitHubie{{- linkGithubClose}}. Ta aplikacja wykorzystuje {{- linkWebApiOpen}}Spotify Web API{{- linkWebApiClose}} do zarządzania playlistami i polubionymi utworami użytkownika.',
        'reviews.title': 'Co mówią użytkownicy',
        'footer.author':
            'Stworzone z ♥ przez {{- linkOpen}}JMPerez 👨‍💻{{- linkClose}}',
        'footer.github': 'Sprawdź {{- linkOpen}}kod na GitHubie 📃{{- linkClose}}',
        'footer.bmc':
            'Wesprzyj projekt {{- linkOpen}}kupując kawę ☕{{- linkClose}}',
        'footer.musicalyst': "Sprawdź {{- linkOpen}}Musicalyst 🎧{{- linkClose}}",
        'bmc.button': 'Kupisz mi kawę?',
        'result.duplicate.reason-same-id': 'Duplikat',
        'result.duplicate.reason-same-data':
            'Duplikat (tytuł, artysta i czas trwania)',
        'result.duplicate.track':
            '<0>{{trackName}}</0> <2>autorstwa</2> <4>{{trackArtistName}}</4>',
        'process.status.finding':
            'Wyszukiwanie duplikatów utworów w playlistach i polubionych utworach....',
        'process.status.complete': 'Przetwarzanie zakończone!',
        'process.status.complete.body':
            'Twoje playlisty i polubione utwory zostały przetworzone!',
        'process.status.complete.dups.body':
            'Kliknij przycisk {{- strongOpen}}Usuń duplikaty{{- strongClose}}, aby usunąć duplikaty z odpowiedniej playlisty lub polubionych utworów.',
        'process.status.complete.nodups.body':
            'Gratulacje! Nie masz duplikatów w swoich playlistach ani polubionych utworach.',
        'process.reading-library':
            'Twoja biblioteka zostanie przeszukana w poszukiwaniu duplikatów w playlistach i polubionych utworach....',
        'process.processing_one':
            'Wyszukiwanie duplikatów utworów. Proszę czekać. Pozostała {{count}} playlista do przetworzenia....',
        'process.processing_other':
            'Wyszukiwanie duplikatów utworów. Proszę czekać. Pozostało {{count}} playlist do przetworzenia....',
        'process.saved.title': 'Polubione utwory w twojej bibliotece',
        'process.saved.duplicates_one':
            'Ta kolekcja zawiera {{count}} duplikat piosenki',
        'process.saved.duplicates_other':
            'Ta kolekcja zawiera {{count}} duplikatów piosenek',
        'process.saved.remove-button': 'Usuń duplikaty',
        'process.playlist.duplicates_one':
            'Ta playlista zawiera {{count}} duplikat.',
        'process.playlist.duplicates_other':
            'Ta playlista zawiera {{count}} duplikatów.',
        'process.playlist.remove-button': 'Usuń duplikaty',
        'process.items.removed': 'Duplikaty usunięte',
        'spotifytop.heading': '🚀 Nowy projekt, Musicalyst!',
        'spotifytop.description':
            'Czy kiedykolwiek zastanawiałeś się, jakich artystów, piosenek lub gatunków słuchasz ostatnio najczęściej?',
        'spotifytop.check1': 'Sprawdź mój aktualny projekt',
        'spotifytop.check2': 'aby uzyskać spersonalizowane informacje na temat tego, co odtwarzałeś najczęściej na Spotify.',
        'faq.section-title': "Często zadawane pytania",
        'faq.question-1': 'Co robi ta aplikacja internetowa?',
        'faq.answer-1': 'Spotify Dedup pomaga uporządkować biblioteki muzyczne w Spotify, identyfikując i usuwając zduplikowane utwory z list odtwarzania i zapisanych utworów.',
        'faq.question-2': 'Jak to narzędzie znajduje duplikaty?',
        'faq.answer-2': 'Narzędzie wyszukuje duplikaty na podstawie identyfikatora utworu, tytułu, wykonawcy i podobieństwa czasu trwania. Identyfikuje duplikaty, których aplikacja Spotify nie znajduje. ',
        'faq.question-3': 'W czym to narzędzie jest lepsze niż wykrywanie duplikatów w Spotify?',
        'faq.answer-3': 'Ten sam utwór może mieć wiele identyfikatorów w Spotify, zarówno w tym samym wydaniu, jak i w kilku. Spotify ostrzega tylko o duplikatach na podstawie identyfikatora utworu, podczas gdy to narzędzie wykrywa również duplikaty na podstawie tytułu, wykonawcy i podobieństwa czasu trwania. ',
        'faq.question-4': 'Gdy znalezione zostaną duplikaty, które utwory zostaną usunięte?',
        'faq.answer-4': 'Dedup zachowa pierwszy utwór w grupie zduplikowanych utworów i usunie resztę.',
        'faq.question-5': 'Czy moje dane są bezpieczne w tej aplikacji internetowej?',
        'faq.answer-5': 'Tak, ta aplikacja internetowa nie przechowuje żadnych danych użytkownika na swoich serwerach. Żąda tylko minimalnego zestawu uprawnień niezbędnych do przetworzenia Twojej biblioteki. ',
        'faq.question-6': 'Jakich uprawnień wymaga ta aplikacja internetowa?',
        'faq.answer-6': 'Ta aplikacja internetowa korzysta z usługi uwierzytelniania Spotify, aby uzyskać dostęp do zapisanych utworów i list odtwarzania w Twojej bibliotece.',
        'faq.question-7': 'Jak przetestowano to narzędzie?',
        'faq.answer-7': 'To narzędzie zostało przetestowane w boju przez tysiące użytkowników, którzy używali go do identyfikowania duplikatów w milionach list odtwarzania od 2014 r.',
        'faq.question-8': 'Czy to narzędzie może usuwać duplikaty z wielu list odtwarzania?',
        'faq.answer-8': 'To narzędzie może identyfikować i usuwać duplikaty na wszystkich listach odtwarzania w bibliotece, ale nie wykrywa duplikatów utworu na wielu listach odtwarzania.',
        'faq.question-9': 'Jak mogę cofnąć uprawnienia przyznane tej aplikacji internetowej?',
        'faq.answer-9': 'Użytkownicy mogą cofnąć uprawnienia przyznane tej aplikacji internetowej w dowolnym momencie na swoim koncie Spotify, w sekcji \'Aplikacje\'.',
        'faq.question-10': 'Czy to narzędzie działa z innymi serwisami do strumieniowego przesyłania muzyki?',
        'faq.answer-10': 'Nie, to narzędzie działa tylko z Spotify i wykorzystuje Web API Spotify do identyfikowania i usuwania duplikatów w Twojej bibliotece',
    });
    i18n.changeLanguage('pl');
    return (
        <Page>
            <Index />
        </Page>
    );
};

export default IndexComponent;
