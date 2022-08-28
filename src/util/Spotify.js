let userAccessToken = '';
const clientID = '294959fa3089485a9779510d956b0a88';
const redirectURI = 'http://localhost:3000/';

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
    }
}

export default Spotify;