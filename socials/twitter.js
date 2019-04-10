// Twitter scraper tool
const fetch = require('node-fetch')

module.exports = {
  function: async function (handle) {

    // GET Twitter user page
    const socialResponse = await fetch('https://cors-anywhere.herokuapp.com/https://www.twitter.com/' + handle, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    })
    const socialHTML = await socialResponse.text();

    // find index positions of tags surrounding data. NOTE: data order = tweets, following, followers, likes
    let nameStartIndex = socialHTML.search('hreflang="fr" href="https://twitter.com/') + 40
    let nameEndIndex = socialHTML.search('lang=fr">') - 1;
    let name = socialHTML.substring(nameStartIndex, nameEndIndex)

    let tweetsStartIndex = socialHTML.search('statuses_count&quot;:') + 21
    let tweetsEndIndex = socialHTML.search(',&quot;lang&quot;')
    let followersStartIndex = socialHTML.search('followers_count&quot;:') + 22
    let followersEndIndex = socialHTML.search(',&quot;friends_count&quot;')
    let likesStartIndex = socialHTML.search('favourites_count&quot;:') + 23
    let likesEndIndex = socialHTML.search(',&quot;utc_offset&quot;')

    let tweetCount = socialHTML.substring(tweetsStartIndex, tweetsEndIndex)
    let followerCount = socialHTML.substring(followersStartIndex, followersEndIndex)
    let likeCount = socialHTML.substring(likesStartIndex, likesEndIndex)
    let report = {
      username: name,
      tweet_count: tweetCount,
      followers: followerCount,
      like_count: likeCount,
      date_requested: Date.now()
    }

    return report
  }
}
