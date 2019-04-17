// Instagram post info scraper tool
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

module.exports = {
    function: async function (handle) {
      var responses = []

      // start puppeteer headless browser
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 })

      // tell browser to store requests
      page.on('request', async (request) => {
        if (await request._resourceType.match('xhr')) {
          // remake requests and store response data
          let response = await fetch(request._url, { headers: request._headers })
          let json = await response.json()
          console.log(json)
          responses.push(json)
        }
      })

      // tell browser to GET instagram user page
      const response = await page.goto('https://instagram.com/' + handle)
      // get raw html
      const html = await response.text()

      // autoscroll system
      await page.evaluate( async() => {
        console.log('in here')
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          let distance = 100;
          var timer = setInterval(() => {
            console.log("inside scroll timer")
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
                console.log("cleared scroll timer")
                clearInterval(timer);
                resolve();
            }
          }, 400);
        })
      })
      await page.screenshot({path: 'ig-bottom-screenshot.png'});
      await browser.close()

      return responses
    }
}
