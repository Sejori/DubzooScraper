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
    let nameStartIndex = socialHTML.search('hreflang="fr" href="https://twitter.com/') + 40;
    let nameEndIndex = socialHTML.search('lang=fr">') - 1;
    let tweetsStartIndex = socialHTML.search('<span class="u-hiddenVisually">Tweets, current page.</span>') + 115;
    let followingStartIndex = socialHTML.search('<span class="u-hiddenVisually">Following</span>') + 100;
    let followersStartIndex = socialHTML.search('<span class="u-hiddenVisually">Followers</span>') + 100;
    let likesStartIndex = socialHTML.search('<span class="u-hiddenVisually">Likes</span>') + 96;
    let re = / data-is-compact=/g;
    let dataEndIndices = [];
    let match = null;
    while (( match = re.exec(socialHTML)) != null) {
      dataEndIndices.push(match.index)
    }

    let name = socialHTML.substring(nameStartIndex, nameEndIndex)
    let tweetCount = socialHTML.substring(tweetsStartIndex, dataEndIndices[0])
    let followingCount = socialHTML.substring(followingStartIndex, dataEndIndices[1])
    let followerCount = socialHTML.substring(followersStartIndex, dataEndIndices[2])
    let likeCount = socialHTML.substring(likesStartIndex, dataEndIndices[3])
    let report = {
      username: name,
      tweet_count: tweetCount,
      followers: followingCount,
      following: followerCount,
      like_count: likeCount,
      date_requested: Date.now()
    }

    return report
  }
}
