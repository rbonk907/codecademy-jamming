import React from 'react';
import './App.css';
import SearchBar from './../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchResults: [
      {
        name: 'Tiny Dancer',
        artist: 'Elton John',
        album: 'Madman Across The Water',
        id: 1
      },
      {
        name: 'Tiny Dancer',
        artist: 'Tim McGraw',
        album: 'Love Story',
        id: 2
      }],
      playlistName: 'Bass drops better than butter on toast',
      playlistTracks: [
        {
          name: 'Stronger',
          artist: 'Britney Spears',
          album: 'Oops!... I Did It Again',
          uri: 'spotify:track:aaa',
          id: 3
        },
        {
          name: 'So Emotional',
          artist: 'Whitney Houston',
          album: 'Whitney',
          uri: 'spotify:track:bbb',
          id: 4
        },
        {
          name: 'Tiny Dancer',
          artist: 'Elton John',
          album: 'Madman Across The Water',
          uri: 'spotify:track:ccc',
          id: 1
        }
      ]
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

  componentDidUpdate() {
    console.log(this.state);
  }

  removeTrack(track) {
    const filteredPlaylist = this.state.playlistTracks.filter(trackToStay => trackToStay.id !== track.id);

    this.setState({playlistTracks: filteredPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.forEach(track => trackURIs.push(track.uri));
    
  }

  search(searchTerm) {
    console.log(searchTerm);
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
