// Youtube Data API tool
const fetch = require('node-fetch')
const keys = require('../config/keys.js')

module.exports = {
  createReport: (items) => {
    if (!items[0]) return "Cannot find artist"

    const name = items[0].snippet.title
    const views = items[0].statistics.viewCount
    const subs = items[0].statistics.subscriberCount
    const vids = items[0].statistics.videoCount

    let dataJSON = { username: name, views: views, subscribers: subs, video_count: vids, date_requested: Date.now() }

    return dataJSON
  },
  function: async function (handle) {

    let apiKey = keys.YOUTUBE_API_KEY
    let username = encodeURI(handle)

    const response = await fetch('https://www.googleapis.com/youtube/v3/channels?forUsername='+username+'&key='+apiKey+'&part=snippet,statistics')
    .catch(err => console.log(err))
    const json = await response.json()
    const items = await json.items
    let report = this.createReport(await items)

    return(await report)
  }
}
