const { launch } = require('puppeteer');

const IS_HEADLESS = false // set to false to see the browser while developing
const WAIT_OPTIONS = { waitUntil: 'networkidle2', timeout: 0 } // no timeout; wait until network is idle indefinitely
const SELECTORS = {
    name: "#title-card-3-2 > div.ptrack-content > a > div.boxart-size-16x9.boxart-container.boxart-rounded > div > p",
    thumbnail: "#title-card-3-2 > div.ptrack-content > a > div.boxart-size-16x9.boxart-container.boxart-rounded > img"
}
const DELAY = 5000 // time to wait for more titles to load

/**
 * Scrapes all ids and thumbnails from one genre
 * 
 * @param {Object} page Chromium page by puppeteer
 * @param {String} genre
 * @returns {Object} titles [ { name, thumbnail } ]
 */
const scrapeGenre = async (page, genre) => {
    await page.goto(`https://www.netflix.com/browse/genre/${genre}?so=su`, WAIT_OPTIONS);

    // go to the bottom of the page to load all titles
    while (true) {
        const previousHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        try { await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, { timeout: DELAY }) }
        catch (error) { break }
    }

    return await page.evaluate(
        selector => {
            const names = Array.from(document.querySelectorAll(selector.name));
            const thumbnails = Array.from(document.querySelectorAll(selector.thumbnail));

            return names.map((name, i) => ({ [name.innerText]: thumbnails[i].src }))
        },
        SELECTORS
)}

/**
 * Scrapes all ids and thumbnails from a country
 * 
 * @param {Object[]} cookies 
 * @param {string[]} genres the url slugs of genres
 * @returns {Object} titles [ { name, thumbnail } ]
 */
const scrape = async (cookies, genres) => {
    const browser = await launch({ handleSIGINT: false, headless: false }); //  let me handle errors
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    let titles = []
    for (const genre of genres) {
        const genreTitles = await scrapeGenre(page, genre)
        console.log(genreTitles)
        titles = [ ...titles, genreTitles ]
    }
    return titles.filter((title, i) => titles.indexOf(title) === i) // remove duplicates
}

// for older versions of node, I guess
module.exports = scrape