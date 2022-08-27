let userAccessToken = '';
const clientID = '294959fa3089485a9779510d956b0a88';
const redirectURI = 'http://localhost:3000/';


const Spotify = {
    getAccessToken() {
        if(userAccessToken) {
            return userAccessToken;
        }
        
        let accessToken = window.location.href.match(/access_token=([^&]*)/);
        let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expiresIn) {
            userAccessToken = accessToken[1];
            const expirationTime = expiresIn[1];
            window.setTimeout(() => userAccessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');

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