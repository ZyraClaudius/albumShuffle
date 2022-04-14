import React from 'react';
import './Shuffle.css';
import {Button} from '../Button/Button';

export class Shuffle extends React.Component {
    constructor(props) {
        console.log("constructing");
        super(props);
        this.state = {loaded:false};
        this.getAlbumScroll = this.getAlbumScroll.bind(this);
        this.onShuffle = this.onShuffle.bind(this);
        this.onPlay = this.onPlay.bind(this);
    }

    async componentDidMount() {
        console.log("Mounted!");
        let albumScroll = await this.getAlbumScroll();
        this.setState({loaded:true, albums:albumScroll});
        this.setState({albumLink:this.state.albums[18].album.external_urls.spotify});
    }

    render() {
        console.log("rendering");
        if(this.state.loaded) {
            let albumImages = this.state.albums.map((album,index) => <img style={{gridColumn:index+1, gridRow:1}} key={album.album.href} alt="album cover" src={album.album.images[0].url} />);
            let albumScroll;
            let button;
            if(this.state.scrolling) {
                albumScroll = (
                    <div id="albumScroll" className="scrolling">
                        <div id="cover1" className="scrollingCover"></div>
                        {albumImages}
                        <div id="cover2" className="scrollingCover"></div>
                    </div>
                );
                button = <Button scrolling={true} albumLink={this.state.albumLink} onPlay={this.onPlay}/>
            } else {
                albumScroll = (
                    <div id="albumScroll">
                        <div id="cover1"></div>
                        {albumImages}
                        <div id="cover2"></div>
                    </div>
                );
                button = <Button id="button" scrolling={false} onShuffle={this.onShuffle}/>
            }
            return (
                <div className = "Shuffle">
                    {albumScroll}
                    <div id="buttondiv">{button}</div>
                </div>
            );
        } else {
            let loading = [<p key="1" style={{backgroundColor:'rgb(0,0,255)'}}>Loading...</p>,<p key="2" style={{backgroundColor:'rgb(0,0,255)'}}>Loading...</p>,<p key="3" style={{backgroundColor:'rgb(0,0,255)'}}>Loading...</p>];
            return (
                <div className = "Shuffle">
                    <div id="albumScroll">
                        <div id="cover1"></div>
                        {loading}
                        <div id="cover2"></div>
                    </div>
                </div>
            );
        }
    }

    async getAlbumScroll() {
        let albumScroll = await this.props.getAlbumScroll();
        console.log(albumScroll);
        return albumScroll;
    }

    onShuffle() {
        this.setState({scrolling: true});
    }

    async onPlay() {
        let newScroll = await this.props.getAlbumScroll();
        let newAlbum = newScroll[18].album.external_urls.spotify;
        this.setState({albums: newScroll,scrolling:false,albumLink:newAlbum});
    }
}
