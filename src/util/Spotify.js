let userAccessToken = '';
const clientID = '294959fa3089485a9779510d956b0a88';
const redirectURI = 'http://localhost:3000/';
const baseURL = 'https://api.spotify.com/v1';

function setTokenExpiration(token, expiration) {
    userAccessToken = token[1];
    const expirationTime = expiration[1];
    window.setTimeout(() => userAccessToken = '', expirationTime * 1000);
    window.history.pushState('Access Token', null, '/');   
}

const Spotify = {
    getAccessToken() {
        if(userAccessToken) {
            console.log('User access token already acquired, returning...');
            return userAccessToken;
        }
        
        console.log('User access token not acquired yet. Parsing... ');
        let accessToken = window.location.href.match(/access_token=([^&]*)/);
        let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expiresIn) {
            setTokenExpiration(accessToken, expiresIn);

            return userAccessToken;
        }

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientID);
        url += '&scope=playlist-modify-public';
        url += '&redirect_uri=' + encodeURIComponent(redirectURI);

        window.location = url;
    },

    async search(searchTerm) {
        let url = `${baseURL}/search?type=track&q=${searchTerm}`;
        let accessToken = this.getAccessToken();

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            cache: 'no-cache',
        });
        if(response.ok) {
            const jsonResponse = await response.json();

            let tracks = jsonResponse.tracks.items.map(track => {
                const trackObj = {
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    id: track.id
                }
                return trackObj;
            })

            return tracks;
        }
    },

    }
}

export default Spotify;