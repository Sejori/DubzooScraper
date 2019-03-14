// POSSIBLE FIX: RUN ALL REQUESTS FROM INSIDE PUPPETEER BROWSER

// Instagram scraper tool
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const keys = require('../config/keys.js')

module.exports = {
  function: async function (handle) {
    // GET soundcloud user page HTML
    const response = await fetch('https://www.soundcloud.com/' + handle)
    let html = String(await response.text())

    let tracksStartIndex = html.indexOf('track_count') + 13
    let tracksEndIndex = html.indexOf('uri') - 2
    let trackCount = html.substring(tracksStartIndex, tracksEndIndex)

    let followersStartIndex = html.indexOf('followers_count') + 17
    let followersEndIndex = html.indexOf('followings_count') - 2
    let followerCount = html.substring(followersStartIndex, followersEndIndex)

    return("Track count: " + trackCount + " Follower count: " + followerCount)
  }
}
