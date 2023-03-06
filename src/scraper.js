const { launch } = require('puppeteer');

const DELAY = 5000 // time to wait for more titles to load
const WAIT_OPTIONS = { waitUntil: 'networkidle2', timeout: 0 } // no timeout; wait until network is idle indefinitely
const SELECTOR = {
    TITLE: ".boxart-rounded",
    PROFILE: ".profiles-gate-container > div > div > ul > li:nth-child(4) > div > a > div > div"
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
    try { await page.click(SELECTOR.PROFILE, WAIT_OPTIONS) } // click right profile
    catch (error) {}

    // go to the bottom of the page to load all titles
    while (true) {
        const previousHeight = await page.evaluate(() => document.body.scrollHeight);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        
        try { await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, { timeout: DELAY }) }
        catch (error) { break }
    }

    return await page.evaluate(
        selector => {
            const titles = {}

            const titleElements = Array.from(document.querySelectorAll(selector));
            
            for (const title of titleElements) {
                const name = title.querySelector("div > p").innerText;
                const thumbnail = title.querySelector("img").src;

                titles[name] = thumbnail;
            }
            return titles
        },
        SELECTOR.TITLE
)}

/**
 * Scrapes all ids and thumbnails from a country
 * 
 * @param {Object[]} cookies 
 * @param {string[]} genres the url slugs of genres
 * @param {Object} localBar cli-progress multibar
 * @returns {Object} titles { name: thumbnail }
 */
const scrape = async (cookies, genres, localBar) => {
    const browser = await launch({ handleSIGINT: false }); //  let me handle errors
    const page = await browser.newPage();
    await page.setCookie(...cookies);

    let titles = []
    for (const genre of genres) {
        titles = { ...titles, ...await scrapeGenre(page, genre) } // merging objects
        localBar.increment()
    }
    return titles // MAKE THE OBJECTS INTO LISTS
}

// for older versions of node, I guess
module.exports = scrape