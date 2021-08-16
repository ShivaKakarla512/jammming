const clientID = 'a20390a7cf5b4581ab75d14324ebe8cc';
const redirectURI = "https://jammmingspotifyapp.netlify.app/";

let accessToken;

const Spotify = {
    getAccessToken () {
        if (accessToken) {
            return accessToken
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(term) {
        const accessTokenn = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: {
            Authorization: `Bearer ${accessTokenn}`
          }
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          if (!jsonResponse.tracks) {
            return [];
          }
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        });
    },

    savePlaylist (playlistName, trackURIs) {
      if (!playlistName || !trackURIs) {
        return;
      }

      const accessTokennn = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessTokennn}` };
      let userId;

      return fetch('https://api.spotify.com/v1/me', {
        headers: headers
      }).then(response => response.json()
      ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => response.json()
        ).then(jsonResponsee => {
          const playlistId = jsonResponsee.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          });
        });
      });
    }
};

export default Spotify;