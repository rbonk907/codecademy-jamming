import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { searchTerm: '' };

        // bind this for the following methods
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(event) {
        this.setState({ searchTerm: event.target.value })
    }

    componentDidMount() {
        /*
        /  When the SearchBar component mounts, check to see if there is a search term
        /  saved in the session storage. If so, update the state of the search bar to
        /  reflect that. 
        /  
        /  Due to this component mounting twice, we could either remove
        /  strict mode, which prevents mounting twice or we could perform
        /  a bit of latching so the state.searchTerm is only updated if it
        /  was previoulsy empty 
        */
        if(sessionStorage.getItem('savedSearchTerm')) {
            const savedSearch = sessionStorage.getItem('savedSearchTerm');
            this.setState({ searchTerm: savedSearch });
        }
    }
    
    render() {
        if(this.state.searchTerm === sessionStorage.getItem('savedSearchTerm')) {
            this.search();
        }


        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} value={this.state.searchTerm}/>
                <button className="SearchButton" onClick={this.search}>SEARCH</button>
            </div>
        );
    } 
};

export default SearchBar;