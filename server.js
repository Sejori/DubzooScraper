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
var j = schedule.scheduleJob('*/10 * * * *', function(){

  getData()
  console.log('It was 1am. The database handles were fetched, and new data has been added! :)')

})

getData = async(artistID) => {
  console.log('getData called')
  // login to strapi as ScraperUser for administrative permissions
  const loginResponse = await axios.post(keys.STRAPI_URI + '/auth/local', {
      identifier: keys.STRAPI_USERNAME,
      password: keys.STRAPI_PASSWORD
  })
  jwt = await loginResponse.data.jwt

  // fetch artist data for single or all artists
  if (artistID) {
    console.log('getting info on single artist')
    try{
      const artistResponse = await axios.get(keys.STRAPI_URI + '/artists/' + artistID, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwt
        }
      })
      let artists = await artistResponse.data
      updateData(artists)
    } catch(error) { console.log(error) }
  } else {
    try{
      const artistResponse = await axios.get(keys.STRAPI_URI + '/artists', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwt
        }
      })
      let artists = await artistResponse.data
      updateData(artists)
    } catch(error) { console.log(error) }
  }
}

updateData = async(artists) => {
  console.log('in updateData function')

  // loop over each entry
  for (i=0; i<artists.length; i++) {
    console.log('inside updateData for each artist loop')
    console.log('first artist: ' + artists[0])
    let artist = artists[i]

    console.log('Updating data for artist:' + artist.artistName)
    let artistID = artist._id
    let youtubeData
    let soundcloudData
    let instagramData
    let spotifyData
    let twitterData
    let facebookData

    // YOUTUBE
    //
    // if statements for each social account. If handle exists call associated API and send handle.
    if (artist.youtubeHandle) {
      console.log('attempting to update artist YouTube data')
      // get new data for social
      let newYoutubeEntry = await youtube.function(artist.youtubeHandle)
      youtubeData = [newYoutubeEntry]
      // if username matches and date is more than or equal to 12 hours ahead push current data to end of new data
      try {
        if (artist.youtubeData[artist.youtubeData.length-1]) {
          let latestData = artist.youtubeData[artist.youtubeData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          if (username === newYoutubeEntry.username && Date.now() < date + 3600) {
            artist.youtubeData.pop()
            youtubeData = [...artist.youtubeData, newYoutubeEntry]
          }
          if (username === newYoutubeEntry.username && Date.now() >= date + 3600) youtubeData = [...artist.youtubeData, newYoutubeEntry]
        }
      } catch(error) { console.log(error) }
    }

    // SOUNDCLOUD
    //
    if (artist.soundcloudHandle) {
      console.log('attempting to update artist Soundcloud data')
      let newSoundcloudEntry = await soundcloud.function(artist.soundcloudHandle)
      soundcloudData = [newSoundcloudEntry]
      try {
        if (artist.soundcloudData[artist.soundcloudData.length-1]) {
          let latestData = artist.soundcloudData[artist.soundcloudData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          console.log(username, newSoundcloudEntry.username, Date.now(), date)
          if (username === newSoundcloudEntry.username && Date.now() < date + 3600) soundcloudData = artist.soundcloudData
          if (username === newSoundcloudEntry.username && Date.now() >= date + 3600) soundcloudData = [...artist.soundcloudData, newSoundcloudEntry]
        }
      } catch(error) { console.log(error) }
    }

    // INSTAGRAM
    //
    if (artist.instagramHandle) {
      let newInstagramEntry = await youtube.function(artist.instagramHandle)
      instagramData = [newInstagramEntry]
      try {
        if (artist.instagramData[artist.instagramData.length-1]) {
          let latestData = artist.instagramData[artist.instagramData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          console.log(username, newInstagramEntry.username, Date.now(), date)
          if (username === newInstagramEntry.username && Date.now() < date + 3600) instagramData = artist.instagramData
          if (username === newInstagramEntry.username && Date.now() >= date + 3600) instagramData = [...artist.instagramData, newInstagramEntry]
        }
      } catch(error) { console.log(error) }
    }

    // SPOTIFY
    //
    if (artist.spotifyHandle) {
      let newSpotifyEntry = await spotify.function(artist.spotifyHandle)
      spotifyData = [newSpotifyEntry]
      try {
        if (artist.spotifyData[artist.spotifyData.length-1]) {
          let latestData = artist.spotifyData[artist.spotifyData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          console.log(username, newSpotifyEntry.username, Date.now(), date)
          if (username === newSpotifyEntry.username && Date.now() < date + 3600) newSpotifyData = artist.spotifyData
          if (username === newSpotifyEntry.username && Date.now() >= date + 3600) spotifyData = [...artist.spotifyData, newSpotifyEntry]
        }
      } catch(error) { console.log(error) }
    }

    // TWITTER
    //
    if (artist.twitterHandle) {
      let newTwitterEntry = await twitter.function(artist.twitterHandle)
      twitterData = [newTwitterEntry]
      try {
        if (artist.twitterData[artist.twitterData.length-1]) {
          let latestData = artist.twitterData[artist.twitterData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          console.log(username, newTwitterEntry.username, Date.now(), date)
          if (username === newTwitterEntry.username && Date.now() < date + 3600) newTwitterData = artist.twitterData
          if (username === newTwitterEntry.username && Date.now() >= date + 3600) twitterData = [...artist.twitterData, newTwitterEntry]
        }
      } catch(error) { console.log(error) }
    }

    // FACEBOOK
    //
    if (artist.facebookHandle) {
      let newFacebookEntry = await facebook.function(artist.facebookHandle)
      facebookData = [newFacebookEntry]
      try {
        if (artist.facebookData[artist.facebookData.length-1]) {
          let latestData = artist.facebookData[artist.facebookData.length-1]
          let username = latestData.username
          let date = latestData.date_requested
          console.log(username, newFacebookEntry.username, Date.now(), date)
          if (username === newFacebookEntry.username && Date.now() < date + 3600) newFacebookData = artist.facebookData
          if (username === newFacebookEntry.username && Date.now() >= date + 3600) facebookData = [...artist.facebookData, newFacebookEntry]
        }
      } catch(error) { console.log(error) }
    }

    console.log(await youtubeData, await soundcloudData, await instagramData, await spotifyData, await twitterData, await facebookData, artistID)

    // call function to update database
    sendData(await youtubeData, await soundcloudData, await instagramData, await spotifyData, await twitterData, await facebookData, artistID)
  }
}

sendData = (youtubeData, soundcloudData, instagramData, spotifyData, twitterData, facebookData, artistID) => {

  console.log('in send data function')

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
    console.log('successfully updated artist data')
  } catch(error) { console.log(error) }
}

//                               ROUTES

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function (req, res) {
  res.send('Hello you cheeky monkey! <br/> <br/> This is the Dubzoo scraper. Try /youtube, /instagram, /spotify or /soundcloud followed by ?handle=[insert username here] :D')
})

// manual update for newly added artists
app.get('/update', async function (req, res) {
  let artistID = req.query.artistID
  getData(artistID)
  res.send('Updated artist with ID: ' + artistID)
})

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
