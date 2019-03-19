// here are my things!
var youtube = require("./socials/youtube.js")
var soundcloud = require("./socials/soundcloud.js")
var instagram = require("./socials/instagram.js")
var spotify = require("./socials/spotify.js")
const keys = require('./config/keys.js')

// here are other peoples things xxx
var axios = require('axios')
var express = require('express')
var app = express()
var schedule = require('node-schedule')
var artists

//                          CRON SCHEDULING
var j = schedule.scheduleJob('0 1 * * *', function(){
  console.log('It was 1am. The database handles were fetched, and new data has been added! :)');

});

//                               ROUTES

// respond with "hello world" when a GET request is made to the homepage
app.get('/', async function (req, res) {
  //res.send('Hello you cheeky monkey! <br/> <br/> This is the Dubzoo scraper. Try /youtube, /instagram, /spotify or /soundcloud followed by ?handle=[insert username here] :D')

  // login to strapi as ScraperUser for administrative permissions
  axios
    .post(keys.STRAPI_URI + '/auth/local', {
      identifier: keys.STRAPI_USERNAME,
      password: keys.STRAPI_PASSWORD
    })
    .then(response => {
      // Update React State Credentials
      let jwt = response.data.jwt

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
          this.updateData(jwt, artists)
        })
        .catch(error => {
          console.log(error)
        })
    })
    .catch(error => {
      // Handle error.
      alert('An error occurred.', error);
    })

})

updateData = (jwt, artists) => {
  // loop over each entry

    // if statements for each social account. If handle exists call associated API and send handle.

      // if username of response matches previous data username then push new data onto end of old data

      // else if username is different: replace old data with new data

// update artist entry with new data
  console.log(jwt, artists)
}

// respond with instagram function result when GET request made to /instagram
// this allows for manual testing
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

app.listen(8000, () => console.log(`Example app listening on port 8000!`))
