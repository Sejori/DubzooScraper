// here are my things!
const youtube = require("./socials/youtube.js")
const soundcloud = require("./socials/soundcloud.js")
const instagram = require("./socials/instagram.js")
const spotify = require("./socials/spotify.js")
const twitter = require("./socials/twitter.js")
const facebook = require("./socials/facebook.js")
const keys = require('./config/keys.js')
var artists
var jwt

// here are other peoples things xxx
const axios = require('axios')
const fetch = require('node-fetch')
const express = require('express')
const app = express()
const schedule = require('node-schedule')

//                          CRON SCHEDULING
var j = schedule.scheduleJob('0 1 * * *', function(){

  // login to strapi as ScraperUser for administrative permissions
  axios
    .post(keys.STRAPI_URI + '/auth/local', {
      identifier: keys.STRAPI_USERNAME,
      password: keys.STRAPI_PASSWORD
    })
    .then(response => {
      // Update React State Credentials
      jwt = response.data.jwt

      // Strapi call for all artist entries
      axios
        .get(keys.STRAPI_URI + '/artists', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
          }
        })
        .then(response => {
          // assign artists to artist object
          artists = response.data

          // send each artist object to updateData function
          this.updateData(artists)
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(error => {
      // Handle error.
      alert('An error occurred.', error);
    })

  console.log('It was 1am. The database handles were fetched, and new data has been added! :)');

});

//                               ROUTES

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function (req, res) {

  res.send('Hello you cheeky monkey! <br/> <br/> This is the Dubzoo scraper. Try /youtube, /instagram, /spotify or /soundcloud followed by ?handle=[insert username here] :D')

})

updateData = (artists) => {

  // loop over each entry
  artists.forEach(async function(artist) {
    let artistID = artist.id
    console.log(artistID)
    let youtubeData
    let soundcloudData
    let instagramData
    let spotifyData

    // YOUTUBE
    //
    // if statements for each social account. If handle exists call associated API and send handle.
    if (artist.youtubeHandle) {
      // get new data for social
      let newYoutubeEntry = await youtube.function(artist.youtubeHandle)
      youtubeData = [newYoutubeEntry]
      // if username matches and date is more than or equal to 12 hours ahead push current data to end of new data
      try {
        let latestData = artist.youtubeData[artist.youtubeData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newYoutubeEntry.username, Date.now(), date)
        if (username === newYoutubeEntry.username && Date.now() < date + 3600*24) youtubeData = artist.youtubeData
        if (username === newYoutubeEntry.username && Date.now() >= date + 3600*24) youtubeData = [...artist.youtubeData, newYoutubeEntry]
      } catch(error) { console.log(error) }
    }

    // SOUNDCLOUD
    //
    if (artist.soundcloudHandle) {
      let newSoundcloudEntry = await soundcloud.function(artist.soundcloudHandle)
      let soundcloudData = [newSoundcloudEntry]
      try {
        let latestData = artist.soundcloudData[artist.soundcloudData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newSoundcloudEntry.username, Date.now(), date)
        if (username === newSoundcloudEntry.username && Date.now() < date + 3600*24) soundcloudData = artist.soundcloudData
        if (username === newSoundcloudEntry.username && Date.now() >= date + 3600*24) soundcloudData = [...artist.soundcloudData, newSoundcloudEntry]
      } catch(error) { console.log(error) }
    }

    // INSTAGRAM
    //
    if (artist.instagramHandle) {
      let newInstagramEntry = await youtube.function(artist.instagramHandle)
      let instagramData = [newInstagramEntry]
      try {
        let latestData = artist.instagramData[artist.instagramData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newInstagramEntry.username, Date.now(), date)
        if (username === newInstagramEntry.username && Date.now() < date + 3600*24) instagramData = artist.instagramData
        if (username === newInstagramEntry.username && Date.now() >= date + 3600*24) instagramData = [...artist.instagramData, newInstagramEntry]
      } catch(error) { console.log(error) }
    }

    // SPOTIFY
    //
    if (artist.spotifyHandle) {
      let newSpotifyEntry = await spotify.function(artist.spotifyHandle)
      let spotifyData = [newSpotifyEntry]
      try {
        let latestData = artist.spotifyData[artist.spotifyData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newSpotifyEntry.username, Date.now(), date)
        if (username === newSpotifyEntry.username && Date.now() < date + 3600*24) newSpotifyData = artist.spotifyData
        if (username === newSpotifyEntry.username && Date.now() >= date + 3600*24) spotifyData = [...artist.spotifyData, newSpotifyEntry]
      } catch(error) { console.log(error) }
    }

    // TWITTER
    //
    if (artist.twitterHandle) {
      let newTwitterEntry = await twitter.function(artist.twitterHandle)
      let twitterData = [newTwitterEntry]
      try {
        let latestData = artist.twitterData[artist.twitterData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newTwitterEntry.username, Date.now(), date)
        if (username === newTwitterEntry.username && Date.now() < date + 3600*24) newTwitterData = artist.twitterData
        if (username === newTwitterEntry.username && Date.now() >= date + 3600*24) twitterData = [...artist.twitterData, newTwitterEntry]
      } catch(error) { console.log(error) }
    }

    // FACEBOOK
    //
    if (artist.facebookHandle) {
      let newFacebookEntry = await facebook.function(artist.facebookHandle)
      let facebookData = [newFacebookEntry]
      try {
        let latestData = artist.facebookData[artist.facebookData.length-1]
        let username = latestData.username
        let date = latestData.date_requested
        console.log(username, newFacebookEntry.username, Date.now(), date)
        if (username === newFacebookEntry.username && Date.now() < date + 3600*24) newFacebookData = artist.facebookData
        if (username === newFacebookEntry.username && Date.now() >= date + 3600*24) facebookData = [...artist.facebookData, newFacebookEntry]
      } catch(error) { console.log(error) }
    }

    // call function to update database
    this.sendData(await youtubeData, await soundcloudData, await instagramData, await spotifyData, await twitterData, await facebookData, artistID)
  })
}

sendData = (youtubeData, soundcloudData, instagramData, spotifyData, twitterData, facebookData, artistID) => {
  // send new data to db
  try {
    fetch(keys.STRAPI_URI + '/artists/' + artistID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
      body: JSON.stringify({
        "youtubeData": youtubeData,
        "soundcloudData": soundcloudData,
        "instagramData": instagramData,
        "spotifyData": spotifyData,
        "twitterData": twitterData,
        "facebookData": facebookData
      })
    })
  } catch(error) { console.log(error) }
}

// these are for fun & manual testing
app.get('/instagram', async function (req, res) {
  let handle = req.query.handle
  let report = await instagram.function(encodeURI(handle))
  res.send(report)
})

app.get('/youtube', async function (req, res) {
  let handle = req.query.handle
  let report = await youtube.function(handle)
  res.send(report)
})

app.get('/soundcloud', async function (req, res) {
  let handle = req.query.handle
  let report = await soundcloud.function(handle)
  res.send(report)
})

app.get('/spotify', async function (req, res) {
  let handle = req.query.handle
  let report = await spotify.function(handle)
  res.send(report)
})

app.get('/twitter', async function (req, res) {
  let handle = req.query.handle
  let report = await twitter.function(handle)
  res.send(report)
})

app.get('/facebook', async function (req, res) {
  let handle = req.query.handle
  let report = await facebook.function(handle)
  res.send(report)
})

app.listen(process.env.PORT || 8000 , () => console.log(`Example app listening on port 8000!`))
