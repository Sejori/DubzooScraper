// Instagram scraper tool
const puppeteer = require('puppeteer')

async function headlessResponse(handle) {

  // start puppeteer headless browser
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // tell browser to listen to network requests


  // get raw html
  const response = await page.goto('https://instagram.com/' + handle)
  const html = await response.text()
  await browser.close()

  return(html)

}

module.exports = {

    function: async function (handle) {
      const html = await headlessResponse(handle)
      console.log(html.substring(0,5), handle)

      return(html)
    }


}
