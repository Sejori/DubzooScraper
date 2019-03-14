// here are my things!
var youtube = require("./socials/youtube.js")
var soundcloud = require("./socials/soundcloud.js")
var instagram = require("./socials/instagram.js")
var spotify = require("./socials/spotify.js")

// here are other peoples things xxx
var express = require('express')
var app = express()
var schedule = require('node-schedule');


//                          CRON SCHEDULING
var j = schedule.scheduleJob('0 1 * * *', function(){
  console.log('It was 1am. So the database handles were fetched, and new data has been added! :)');

  // execute sh*t in here.
  // start with strapi backend call, get all authorised social accounts
  // run threaded scraping function for all social account handles
  // update strapi social account models with new data


});

//                               ROUTES

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world <3')
})

// respond with instagram function result when GET request made to /instagram
// this allows for manual testing
app.get('/instagram', async function (req, res) {
  let handle = req.query.handle
  let report = await instagram.function(handle)
  res.send(
    "Name: " + report.username +
    " Followers: " + report.followers +
    " Following " + report.following +
    " Posts: " + report.posts
  )
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

app.listen(8000, () => console.log(`Example app listening on port 8000!`))
