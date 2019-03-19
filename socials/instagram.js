// Instagram scraper tool
const instagramScraper = require('simple-instagram-scraper');

module.exports = {
  function: async function (handle) {
    let report = await instagramScraper.getReport(handle)

    return report
  }
}
