import './Tracklist.css';
import Track from '../Track/Track';
import React from 'react';


class Tracklist extends React.Component {
    getTracks() {
        const trackList = this.props.tracks.map((tr) => {
            return (<Track 
                        key={tr.id} 
                        track={tr} 
                        onAdd={this.props.onAdd}
                        onRemove={this.props.onRemove}
                        isRemoval={this.props.isRemoval} />);
        });
        
        return trackList;
    }
    
    render() {
        return (
            <div className="Tracklist">
                {/* <!-- You will add a map method that renders a set of Track components  --> */}
                {this.props.tracks && this.getTracks()}  
            </div>
        );
    } 
}

export default Tracklist;