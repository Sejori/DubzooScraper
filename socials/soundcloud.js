// POSSIBLE FIX: RUN ALL REQUESTS FROM INSIDE PUPPETEER BROWSER

// Soundcloud scraper tool
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const keys = require('../config/keys.js')

module.exports = {
  function: async function (handle) {
    // GET soundcloud user page HTML
    const response = await fetch('https://www.soundcloud.com/' + encodeURI(handle))
    let html = String(await response.text())

    let nameStartIndex = html.indexOf('permalink') + 12
    let nameEndIndex = html.indexOf('permalink_url') - 3
    let name = html.substring(nameStartIndex, nameEndIndex)

    let tracksStartIndex = html.indexOf('track_count') + 13
    let tracksEndIndex = html.indexOf('uri') - 2
    let trackCount = html.substring(tracksStartIndex, tracksEndIndex)

    let followersStartIndex = html.indexOf('followers_count') + 17
    let followersEndIndex = html.indexOf('followings_count') - 2
    let followerCount = html.substring(followersStartIndex, followersEndIndex)

    let dataJSON = { username: name, track_count: trackCount, follower_count: followerCount, date_requested: Date.now() }

    return dataJSON
  }
}
