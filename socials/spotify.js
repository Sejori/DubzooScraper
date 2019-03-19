// Instagram scraper tool
const fetch = require('node-fetch')
const keys = require('../config/keys.js')

// base64 encoding needed for spotify
var Base64 = require('js-base64').Base64;

module.exports = {
  fetchData: async(handle) => {
    var accessToken
    var name
    var followers
    var popularity
    var tracks = 0

    // authorisation API call
    try {
      const authResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'post',
        body: encodeURI('grant_type=client_credentials'),
        headers: {
          'Authorization': 'Basic ' + Base64.encode(keys.SPOTIFY_CLIENT_ID + ':' + keys.SPOTIFY_CLIENT_SECRET),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      const authJSON = await authResponse.json()

      // TEST RESPONSE IS VALID
      if (authResponse.status !== 200) throw authJSON

      // if all good assign access token
      accessToken = authJSON.access_token
    } catch(e) {
      console.log('Error! ', e)
      return "Uh-oh. An authorisation error occured."
    }

    // search for Artist
    try {
      const searchResponse = await fetch('https://api.spotify.com/v1/search?q=' + encodeURI(handle) + '&type=artist&limit=1', {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        }
      })
      const searchJSON = await searchResponse.json()

      // TEST RESPONSE IS VALID
      if (searchResponse.status !== 200) throw searchJSON

      // if all good assign values
      name = searchJSON.artists.items[0].name
      followers = searchJSON.artists.items[0].followers.total
      popularity = searchJSON.artists.items[0].popularity
    } catch(e) {
      console.log('Error! ', e)
      return "Uh-oh. Artist not found."
    }

    // search for artists albums
    try {
      const albumResponse = await fetch('https://api.spotify.com/v1/search?q=' + encodeURI(handle) + '&type=album&limit=50', {
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        }
      })
      const albumJSON = await albumResponse.json()

      // TEST RESPONSE IS VALID
      if (albumResponse.status !== 200) throw albumJSON

      // if all good total tracks
      console.log("Artist has " + albumJSON.albums.items.length + " albums.")
      albumJSON.albums.items.forEach(function(element) {
        if (element.total_tracks !== NaN) tracks += element.total_tracks
        console.log(tracks)
      })

    } catch(e) {
      console.log('Error! ', e)
      return "Uh-oh. Something went wrong in the album search."
    }

    // create JSON obj of data
    var dataJSON = { username: name, followers: followers, popularity: popularity, tracks: tracks, date_requested: Date.now() }

    return(dataJSON)
  },

  function: async function (handle) {

    return this.fetchData(handle)
  }
}
