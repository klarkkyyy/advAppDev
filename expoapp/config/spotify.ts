export const SPOTIFY_CONFIG = {
    CLIENT_ID: 'cbd047a976b5475ca151da46352e8a3b',
    CLIENT_SECRET: 'ba591b2be2f049bd991439b25783235c',
    REDIRECT_URIS: [
        'exp://192.168.0.122:19000',
        'exp://localhost:19000',
        'exp://127.0.0.1:19000'
    ],
    SCOPES: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-read-collaborative',
        'app-remote-control'
    ].join(' ')
};