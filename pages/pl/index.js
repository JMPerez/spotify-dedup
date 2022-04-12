import Index from '../../components/pages/index';
import Page from '../../layouts/main';
import { useTranslation } from 'react-i18next';

const IndexComponent = () => {
    const { t, i18n } = useTranslation();
    i18n.addResourceBundle('pl', 'translation', {
        'menu.link-home': 'Home',
        'menu.link-stats': 'Statystyki',
        'home.title': 'Deduplikator Spotify',
        'home.description':
            'Usuń duplikaty utworów z playlist i polubionych utworów.',
        'home.login-button': 'Zaloguj się przez Spotify',
        'meta.title':
            'Spotify Dedup - Automatycznie usuń duplikaty utworów ze swojej biblioteki Spotify',
        'meta.description':
            'Szybko i łatwo usuwaj duplikaty utworów z playlist Spotify i polubionych utworów.',
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
        'footer.spotify-top': "Sprawdź {{- linkOpen}}Spotify Top 🎧{{- linkClose}}",
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
        'process.processing':
            'Wyszukiwanie duplikatów utworów. Proszę czekać. Pozostała {{count}} playlista do przetworzenia....',
        'process.processing_plural':
            'Wyszukiwanie duplikatów utworów. Proszę czekać. Pozostało {{count}} playlist do przetworzenia....',
        'process.saved.title': 'Polubione utwory w twojej bibliotece',
        'process.saved.duplicates':
            'Ta kolekcja zawiera {{count}} duplikat piosenki',
        'process.saved.duplicates_plural':
            'Ta kolekcja zawiera {{count}} duplikatów piosenek',
        'process.saved.remove-button': 'Usuń duplikaty',
        'process.playlist.duplicates':
            'Ta playlista zawiera {{count}} duplikat.',
        'process.playlist.duplicates_plural':
            'Ta playlista zawiera {{count}} duplikatów.',
        'process.playlist.remove-button': 'Usuń duplikaty',
        'process.items.removed': 'Duplikaty usunięte',
        'spotifytop.heading': '🚀 Nowy projekt, Spotify Top!',
        'spotifytop.description':
            'Czy kiedykolwiek zastanawiałeś się, jakich artystów, piosenek lub gatunków słuchasz ostatnio najczęściej?',
        'spotifytop.check1': 'Sprawdź mój aktualny projekt',
        'spotifytop.check2': 'aby uzyskać spersonalizowane informacje na temat tego, co odtwarzałeś najczęściej na Spotify.',
    });
    i18n.changeLanguage('pl');
    return (
        <Page>
            <Index />
        </Page>
    );
};

export default IndexComponent;
