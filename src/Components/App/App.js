import React from 'react';
import './App.css';
import SearchBar from './../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(tr => tr.id === track.id)) {
      return;
    }
    
    this.state.playlistTracks.push(track);
    this.setState({playlistTracks: this.state.playlistTracks});
  }

  removeTrack(track) {
    const filteredPlaylist = this.state.playlistTracks.filter(trackToStay => trackToStay.id !== track.id);

    this.setState({playlistTracks: filteredPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  async savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => trackURIs.push(track.uri));
    
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: []
    });
  }

  async search(searchTerm) {
    const spotifyResults = await Spotify.search(searchTerm);
    
    if(spotifyResults) {
      Spotify.getAlbumCover(spotifyResults)
      .then(result => {
        this.setState({ searchResults: result});
      })
      .catch(() => console.log('Oh no, something failed!'));

      this.setState({ searchResults: spotifyResults});
    }
    
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* <!-- Add a SearchBar component --> */}
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            {/* <!-- Add a SearchResults component --> */}
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            {/* <!-- Add a Playlist component --> */}
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
};

export default App;
