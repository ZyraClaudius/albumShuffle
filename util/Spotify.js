let accessToken;
let remainingAlbums;
const clientID = 'HIDDEN';
const redirectURI = 'http://albumshuffle.surge.sh';

export class Spotify {

    /* Checks for an access token and refers user to the Spotify verification portal if none is available (in the accessToken variable or the current URL). If an access token is available then the token is returned*/
    static getAccessToken() {
        let haveToken = Spotify.checkAccessToken();
        if(haveToken) {
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=user-library-read&redirect_uri=${redirectURI}`;
        }
    }

    /*Checks the current URL and accessToken variable. If an access token is available in the variable then returns true. If an access token is available in the URL then the variable is updated and true returned. Otherwise returns false*/
    static checkAccessToken() {
        if(accessToken) {
            //console.log("already have a token. returning");
            return true;
        } 
        //console.log('no token yet. attempting fetch...');
        let url = window.location.href;
        let newAccessToken = url.match(/access_token=([^&]*)/);
        let expiresIn = url.match(/expires_in=([^&]*)/);
        if(newAccessToken && expiresIn) {
            newAccessToken = newAccessToken[1];
            expiresIn = expiresIn[1]
            //console.log('token found. returning...');
            accessToken = newAccessToken;
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return true;
            }
        return false;
    }

    static shuffleArray(array) {
        let newArray = array.slice();
        let shuffledArray = [];
        while(newArray.length > 0) {
            let index = Math.floor(Math.random()*newArray.length);
            shuffledArray.push(newArray.splice(index,1)[0]);
        }
        return shuffledArray;
    }

    /*Gets and returns a list of a user's saved albums*/
    static async getAlbums() {
        if(remainingAlbums){
            console.log(`Returning ${remainingAlbums.length} albums remaining`)
            return remainingAlbums;
        }
        let ourToken = this.getAccessToken();
        let allAlbums = [];
        let fetchURL = "https://api.spotify.com/v1/me/albums?offset=0&limit=50";
        while(fetchURL) {
            let albums = await fetch(fetchURL,{headers:{'Authorization':`Bearer ${ourToken}`}});
            let jsonAlbums = await albums.json();
            let albumList = jsonAlbums.items;
            albumList = albumList.filter(album => album.album.album_type==="album");
            allAlbums = allAlbums.concat(albumList);
            fetchURL = jsonAlbums.next;
        }
        allAlbums = Spotify.shuffleArray(allAlbums);
        remainingAlbums = allAlbums;
        return allAlbums;
    }

    /*Selects a random album and returns this and the 20 before (for the scroll animation)*/
    static async getAlbumScroll() {
        let allAlbums = await Spotify.getAlbums();
        //console.log(allAlbums);
        //console.log(allAlbums.length);
        let index = Math.floor(Math.random()*allAlbums.length);
        console.log(index);
        console.log("Removing album")
        Spotify.removeAlbum(index);
        index++;
        if(index===allAlbums.length){
            console.log("looping")
            index = 0;
        }
        //console.log(randomIndex);
        let albumScroll = [];
        for(let i=0; i<20; i++) {
            while(index<0) {
                index=allAlbums.length+index;
            }
            albumScroll.unshift(allAlbums[index]);
            index --;
        }
        return albumScroll;
    }

    static removeAlbum(index) {
        remainingAlbums.splice(index,1);
        console.log(remainingAlbums);
    }
}
