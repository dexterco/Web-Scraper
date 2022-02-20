const puppeteer = require("puppeteer")
const fs = require("fs/promises")
// add the url of website below which you want to scrape
const yourURL = "https://www.example.com/"
async function scrapeIt() {
  try {
    // it will launch browser
    const browser = await puppeteer.launch()
    // This line of code opens new page in browser
    const page = await browser.newPage()
    // page will open the webpage of your provided url
    await page.goto(yourURL)
    //For text scraping.text is Array below
    const text = await page.evaluate(() => {
      //Now here you have complete access of fronted. You can handle DOM here
      return Array.from(document.querySelectorAll("a")).map((x) => x.textContent)
    })
    await fs.writeFile("./Text/text.txt", text.join("\r\n"))
    //Now To Scrape Images
    const photos = await page.$$eval("img", (imgs) => {
      return imgs.map((x) => x.src)
    })

    for (const photo of photos) {
      const imagepage = await page.goto(photo)
      await fs.writeFile("./Images/" + photo.split("/").pop(), await imagepage.buffer())
    }
    await browser.close()
  } catch (error) {
    console.log("Something bad happened" + error)
  }
}

scrapeIt()
