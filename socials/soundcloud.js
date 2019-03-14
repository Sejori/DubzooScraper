// POSSIBLE FIX: RUN ALL REQUESTS FROM INSIDE PUPPETEER BROWSER

// Instagram scraper tool
const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const keys = require('../config/keys.js')

module.exports = {
  function: async function (handle) {
    var clientID
    var apiURI = "http://api.soundcloud.com"
    var clientOrigin

    // start puppeteer headless browser
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({width: 800, height: 600, deviceScaleFactor: 2})

    // tell browser to store clientID upon request (this is dank, supply our scrapes Soundcloud <3)
    page.on('request', async (request) => {
      if (await request._resourceType.match('xhr')) {
        clientID = request._client._sessionId
        clientOrigin = request._client._origin
      }
    })

    // tell browser to GET instagram user page (this is just to get a client id)
    const response = await page.goto('https://www.soundcloud.com/' + handle)
    console.log(response)

    // Soundcloud API GET user & tracks
    const socialResponse = await fetch('https://cors-anywhere.herokuapp.com/' + apiURI + '/users/' + handle + '?client_id=' + clientID, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    })
    .catch(err => console.log(err))
    const socialJSON = await socialResponse.json()
    console.log("------------- SOCIAL JSON -------------" + socialJSON)

    // store metrics
    let userSocialID = socialJSON.id
    let userSocialFollowers = socialJSON.followers_count;
    console.log(userSocialID, userSocialFollowers);

    // Soundcloud API GET tracks
    const tracksResponse = await fetch('https://cors-anywhere.herokuapp.com/' + apiURI + '/users/' + userSocialID + '/tracks?client_id=' + clientID)
    const tracksJSON = await tracksResponse.json();
    console.log("------------- JSON JSON -------------" + tracksJSON)


    // stat totalling logic
    let commentCount = []
    let downloadCount = []
    let favouriteCount = []
    let playbackCount = []
    let repostCount = []

    tracksJSON.map((currElement, index) => {
      commentCount[index] = currElement.comment_count;
      downloadCount[index] = currElement.download_count;
      favouriteCount[index] = currElement.favoritings_count;
      playbackCount[index] = currElement.playback_count;
      repostCount[index] = currElement.reposts_count;
      return 'X';
    });

    commentCount = commentCount.reduce((a,b) => a + b, 0)
    downloadCount = downloadCount.reduce((a,b) => a + b, 0)
    favouriteCount = favouriteCount.reduce((a,b) => a + b, 0)
    playbackCount = playbackCount.reduce((a,b) => a + b, 0)
    repostCount = repostCount.reduce((a,b) => a + b, 0)

    console.log("------------- RUNTIME -------------" + "Comments: " + commentCount, "Downloads: " + downloadCount, "Favourites: " + favouriteCount, "Plays: " + playbackCount, "Reposts: " + repostCount)

    return  "Name: " + handle + "Comments: " + commentCount, "Downloads: " + downloadCount, "Favourites: " + favouriteCount, "Plays: " + playbackCount, "Reposts: " + repostCount
  }
}
