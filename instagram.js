// Instagram scraper tool
const puppeteer = require('puppeteer')
const fetch = require('node-fetch')

var getData = async function(requests) {
  var responses = [];

  var responses = requests.map(async function(request) {
    console.log(request)
    let entry
    let url = request._url
    let headers = request._headers
    await fetch(url, { headers: { headers } })
      .then(response => console.log(response))
      .then(response => entry = response)
      .catch(err => console.error(err))
    return entry
  });

  return responses;
}

module.exports = {
    function: async function (handle) {
      var requests = [];

      // start puppeteer headless browser
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.setViewport({width: 800, height: 600, deviceScaleFactor: 2});

      // tell browser to store requests
      page.on('request', async (request) => {
        if (await request._resourceType.match('xhr')) requests.push(await request)
      })

      // tell browser to GET instagram user page
      const response = await page.goto('https://instagram.com/' + handle)
      // get raw html
      const html = await response.text()

      // autoscroll system
      await page.evaluate(async () => {
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

      // call function to replicate requests and find video details from response
      let responses = getData(requests)

      // return results
      //console.log(html)
      return responses
    }
}
