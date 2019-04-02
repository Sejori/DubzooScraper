// Twitter scraper tool
const fetch = require('node-fetch')

module.exports = {
  function: async function (handle) {

    // GET Twitter user page
    const socialResponse = await fetch('https://cors-anywhere.herokuapp.com/https://www.facebook.com/' + handle, {
      headers: {
        'x-requested-with': 'XMLHttpRequest'
      }
    })
    const socialHTML = await socialResponse.text();

    let nameStartIndex = socialHTML.search('<a class="_5u7u" href="/') + 24
    let nameEndIndex = socialHTML.search('/about/" id="u_0_n">');
    let likesStartIndex = socialHTML.search('<div class="_4bl9"><div>') + 24
    let likesEndIndex = socialHTML.search(' people like this')

    let name = socialHTML.substring(nameStartIndex, nameEndIndex)
    let likeCount = socialHTML.substring(likesStartIndex, likesEndIndex)

    let report = { username: name, like_count: Number(likeCount), date_requested: Date.now() }

    return report
  }
}
