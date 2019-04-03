// Instagram scraper tool
const cheerio = require('cheerio');
const request = require('request');
const BASE_URL = 'https://www.instagram.com/';

module.exports = {
  function: async function (handle) {

    // Use simple-instagram-scraper code for initial values
    let url = BASE_URL+handle;
    let report

    return new Promise(function(resolve, reject) {
      request(url, async function(err,resp, body){
        if(err)
          throw err;

        $ = cheerio.load(body);
        let content = $('meta').eq('16').attr('content');
        content = content.replace(/,/g , '');
        let followers = content.substring(0,content.indexOf("Followers")).trim();
        let following = content.substring(content.indexOf("Followers")+9,content.indexOf("Following")).trim();
        let posts = content.substring(content.indexOf("Following")+9,content.indexOf("Posts")).trim();

        report = {
          username: handle,
          followers: followers,
          following: following,
          posts: posts,
          date_requested: Date.now() //Unix time
        }

        // this is pretty genius
        // basically I'm using the basic follower count to find a more accurate version.
        // I use a regular expression to find all numbers in the page then test them +-
        // a 50 or 50000 margin on the basic follower count depending on whether it's
        // ...m or ...k
        let valueIndicator = report.followers[report.followers.length -1]
        let followerEstimate
        if (valueIndicator === 'm' || valueIndicator === 'k') {
          let trimmedFollowers = report.followers.slice(0, -1)
          if (valueIndicator === 'm') {
            followerEstimate = Number(trimmedFollowers) * 1000000
            // search instagram html as string then search for numbers in string
            let numbers = body.match(/\d+/g).map(Number)
            var closest = numbers.reduce(function(prev, curr) {
              return (Math.abs(curr - followerEstimate) < Math.abs(prev - followerEstimate) ? curr : prev);
            })
            report.followers = closest
          } else {
            followerEstimate = Number(trimmedFollowers) * 1000
            // search instagram html as string then search for numbers in string
            let numbers = body.match(/\d+/g).map(Number)
            var closest = numbers.reduce(function(prev, curr) {
              return (Math.abs(curr - followerEstimate) < Math.abs(prev - followerEstimate) ? curr : prev);
            })
            report.followers = closest
          }
        }

        resolve(report);
        });
    });

    return await report
  }
}
