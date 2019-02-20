// here are my things!
var instagram = require("./instagram.js")
// here are other peoples things xxx
var express = require('express')
var app = express()
var schedule = require('node-schedule');


//                          CRON SCHEDULING
var j = schedule.scheduleJob('42 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');

  // execute sh*t in here.
  // start with strapi backend call, get all authorised social accounts
  // run threaded scraping function for all social account handles
  // update strapi social account models with new data


});

//                               ROUTES

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

// respond with instagram function result when GET request made to /instagram
// this allows for manual testing
app.get('/instagram', async function (req, res) {
  let handle = req.query.handle
  let value = await instagram.function(handle)
  res.send(value)
})

app.listen(8000, () => console.log(`Example app listening on port 8000!`))
