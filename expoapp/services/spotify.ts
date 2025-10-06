import { AccessToken, IAuthStrategy, SpotifyApi } from '@spotify/web-api-ts-sdk';
import * as WebBrowser from 'expo-web-browser';
import { SPOTIFY_CONFIG } from '../config/spotify';

interface TokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    expires_in: number;
    refresh_token?: string;
    error?: string;
    error_description?: string;
}

type AuthResult = {
    type: 'success' | 'cancel' | 'dismiss';
    url?: string;
    error?: string;
};

export class SpotifyService {
    private static instance: SpotifyService;
    private accessToken: string | null = null;
    private spotify: SpotifyApi | null = null;

    private constructor() {
        // Private constructor to enforce singleton pattern
    }

    public static getInstance(): SpotifyService {
        if (!SpotifyService.instance) {
            SpotifyService.instance = new SpotifyService();
        }
        return SpotifyService.instance;
    }

    private buildAuthUrl(redirectUri: string): string {
        const params = new URLSearchParams({
            client_id: SPOTIFY_CONFIG.CLIENT_ID,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: SPOTIFY_CONFIG.SCOPES,
            show_dialog: 'true'
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    private async exchangeCodeForToken(code: string, redirectUri: string): Promise<boolean> {
        try {
            const params = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri
            });

            const authString = `${SPOTIFY_CONFIG.CLIENT_ID}:${SPOTIFY_CONFIG.CLIENT_SECRET}`;
            const authHeader = btoa(authString);

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            const data = await response.json() as TokenResponse;

            if (response.ok && data.access_token) {
                this.accessToken = data.access_token;
                
                // Create new SpotifyApi instance with access token
                class TokenManager implements IAuthStrategy {
                    private token: AccessToken;
                    
                    constructor(token: TokenResponse) {
                        this.token = {
                            access_token: token.access_token,
                            token_type: 'Bearer',
                            expires_in: token.expires_in,
                            refresh_token: token.refresh_token || ''
                        };
                    }

                    async getAccessToken(): Promise<AccessToken> {
                        return this.token;
                    }

                    async getOrCreateAccessToken(): Promise<AccessToken> {
                        return this.token;
                    }

                    setConfiguration(): void {
                        // No configuration needed for this simple implementation
                    }

                    removeAccessToken(): void {
                        // No-op for this implementation
                    }
                }
                
                this.spotify = new SpotifyApi(new TokenManager(data));
                return true;
            }
            
            console.log('Token request failed:', data.error, data.error_description);
            return false;
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            return false;
        }
    }

    private async tryAuth(url: string): Promise<AuthResult> {
        try {
            // Try each redirect URI until one works
            for (const redirectUri of SPOTIFY_CONFIG.REDIRECT_URIS) {
                try {
                    const result = await WebBrowser.openAuthSessionAsync(
                        url, 
                        redirectUri,
                        { showInRecents: true }
                    );
                    return result as AuthResult;
                } catch (e) {
                    console.log(`Auth failed with URI ${redirectUri}:`, e);
                    continue;
                }
            }
            return { type: 'dismiss', error: 'All redirect URIs failed' };
        } catch (error) {
            console.error('Auth session error:', error);
            return { type: 'dismiss', error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    public async authorize(): Promise<boolean> {
        try {
            // Try each redirect URI for authorization
            for (const redirectUri of SPOTIFY_CONFIG.REDIRECT_URIS) {
                const authUrl = this.buildAuthUrl(redirectUri);
                const result = await this.tryAuth(authUrl);

                if (result.type === 'success' && result.url) {
                    const url = new URL(result.url);
                    const code = url.searchParams.get('code');
                    
                    if (code) {
                        const success = await this.exchangeCodeForToken(code, redirectUri);
                        if (success) return true;
                    }
                } else if (result.type === 'cancel') {
                    console.log('User cancelled auth');
                    return false;
                }
            }

            console.log('All redirect URIs failed');
            return false;
        } catch (error) {
            console.error('Authorization error:', error);
            return false;
        }
    }

    public getSDK(): SpotifyApi | null {
        return this.spotify;
    }

    public isAuthorized(): boolean {
        return this.accessToken !== null && this.spotify !== null;
    }
}

// Create and export the singleton instance
const spotifyService = SpotifyService.getInstance();
export default spotifyService;