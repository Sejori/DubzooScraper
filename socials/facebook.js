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

    let metaStartIndex = socialHTML.search('<meta name="description" content="') + 34
    let metaEndIndex = metaStartIndex + 200
    let metaDesciption = socialHTML.substring(metaStartIndex, metaEndIndex)
    let metaWords = metaDesciption.split(" ")
    let name = metaWords[0]
    if (name[name.length-1] !== ",") name = metaWords[0] + ' ' + metaWords[1]
    name = name.substring(0, name.length-1)
    let likes = metaWords[metaWords.findIndex(function(element, index, array){return element==="likes"})-1]

    let report = { username: name, like_count: Number(likes), date_requested: Date.now() }

    return report
  }
}
