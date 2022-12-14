import './Playlist.css';
import Tracklist from '../Tracklist/Tracklist';
import React from 'react';

class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value)
    }

    render() {
        return (
            <div className="Playlist">
                <input onChange={this.handleNameChange} value={this.props.playlistName} />
                {/* <!-- Add a TrackList component --> */}
                <Tracklist 
                    tracks={this.props.playlistTracks} 
                    onRemove={this.props.onRemove}
                    isRemoval={true} />
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
};

export default Playlist;