const { launch } = require('puppeteer');

const IS_HEADLESS = false // set to false to see the browser while developing
const WAIT_OPTIONS = { waitUntil: 'networkidle2', timeout: 0 } // no timeout; wait until network is idle indefinitely
const TITLE_SELECTOR = "#title-card-3-2 > div.ptrack-content > a > div.boxart-size-16x9.boxart-container.boxart-rounded"
const DELAYS = {
    LOAD: 3000,
    SCROLL: 1000
}


/**
 * Scrapes all ids and thumbnails from one genre
 * 
 * @param {Object} page Chromium page by puppeteer
 * @param {String} genre
 * @returns {Object} titles { name: thumbnail }
 */
const scrapeGenre = async (page, genre) => {
    await page.goto(`https://www.netflix.com/browse/genre/${genre}?so=su`, WAIT_OPTIONS);

    // go to the bottom of the page to load all titles
    while (true) {
        const previousHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        try { await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, { timeout: DELAYS.LOAD }) }
        catch (error) { break }
        
        await page.waitForTimeout(DELAYS.SCROLL)
    }

    return await page.evaluate(
        selector => {
            const titles = {}

            const titleElements = Array.from(document.querySelectorAll(selector));
            for (const title of titleElements) {
                const name = title.querySelector("div > p").innerText
                const thumbnail = title.querySelector("img").src

                titles[name] = thumbnail
            }
            return titles
        },
        SELECTORS.TITLE
)}

/**
 * Scrapes all ids and thumbnails from a country
 * 
 * @param {Object[]} cookies 
 * @param {string[]} genres the url slugs of genres
 * @returns {Object} titles { name: thumbnail }
 */
export default async (cookies, genres) => {
    const browser = await launch({ handleSIGINT: false }); //  let me handle errors
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    let titles = []
    // merging objects
    for (const genre of genres) titles = { ...titles, ...await scrapeGenre(page, genre) } 
    return titles
}