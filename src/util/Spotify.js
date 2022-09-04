let userAccessToken = '';
const clientID = process.env.SPOTIFY_CLIENT_ID;
const redirectURI = 'http://localhost:3000/';
const baseURL = 'https://api.spotify.com/v1';

let savedSearchTerm = '';

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

            /*
            /  If the access token is in the URL and therefore not NULL, we can
            /  continue on with the search. This is a good spot to clear any 
            /  variables stored in the session storage.
            */

            sessionStorage.removeItem('savedSearchTerm');

            return userAccessToken;
        }

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientID);
        url += '&scope=playlist-modify-public';
        url += '&redirect_uri=' + encodeURIComponent(redirectURI);

        /* The page is going to be redirected below... This would be good spot
        /  to store any session variables that will be needed upon returning
        /  to the site, like searchTerm, stateKey  
        */
        
        sessionStorage.setItem('savedSearchTerm', savedSearchTerm);

        window.location = url;
    },

    /*
    /  Create a .getAlbumCover() method that accepts a track ID and performs
    /  an http GET request for track information and returns the url for the
    /  album cover image using the /tracks/{id} endpoint
    */

    getAlbumCover(tracks) {
        let url = `${baseURL}/tracks/`;

        let tracksWithImages = tracks.map(async (track) => {
            const response = await fetch(`${url}${track.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userAccessToken}`
                },
                cache: 'no-cache'
            });

            if (response.ok) {
                const jsonResponse = await response.json();
                const lastIndex = jsonResponse.album.images.length - 1;
                const imgURL = jsonResponse.album.images[lastIndex].url;
                track.imageURL = imgURL;
                return track;
            }
        });

        return Promise.all(tracksWithImages);
    },

    async search(searchTerm) {
        let url = `${baseURL}/search?type=track&q=${searchTerm}`;

        savedSearchTerm = searchTerm;
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

    async savePlaylist(playlistName, trackURIs) {
        if (!(playlistName && trackURIs)) {
            return;
        }

        const accessToken = userAccessToken;
        const header = { 
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        let userID = '';
        let playlistID = '';

        const response = await fetch(`${baseURL}/me`, {
            method: 'GET',
            headers: header,
        });

        if(response.ok) {
            const jsonResponse = await response.json();
            userID = jsonResponse.id;
        }

        if(userID) {
            let body = {
                name: playlistName,
                public: true
            }
            
            try {
                const response = await fetch(`${baseURL}/users/${userID}/playlists`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(body)
                });

                if(response.ok) {
                    const jsonResponse = await response.json();
                    playlistID = jsonResponse.id;
                }
            } catch (error) {
                console.log(error.message);
            }  
        }

        if(playlistID) {
            let body = {
                uris: trackURIs
            };

            try {
                const response = await fetch(`${baseURL}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: header,
                    body: JSON.stringify(body)
                });
    
                if(response.ok) {
                    const jsonResponse = await response.json();
                    playlistID = jsonResponse.id;
                }
            } catch (error) {
                console.log(error.message)
            }
            
        }
    }
}

export default Spotify;