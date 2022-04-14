import React from 'react';
import './Button.css';

export class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        let button;
        if(this.props.scrolling){
            button = (
                <a href={this.props.albumLink} target="_blank" rel="noreferrer"><button className="playButton" id="button" onClick={this.props.onPlay}>Play</button></a>
            );
        } else {
            button = (
                <button className="shuffleButton" id="button" onClick={this.props.onShuffle}>Shuffle</button>
            );
        }
        return button;
    }
}
