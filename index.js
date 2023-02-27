const cliProgress = require("cli-progress");

const scrape = require("./src/scraper");
const upload = require("./src/mongodb");
const { ip, connect, disconnect } = require("./src/vpn");

const genres = require("./data/genres.json");
const cookies = require("./data/cookies.json");
const countries = require("./data/counties.json");

/**
 * Scrapes titles from all countries
 * 
 * @return {Object} { country: { name: thumbnail } }
 */
const titles = async () => {
    const homeIP = ip() // getting ip to check when vpn is disconnected

    // progress bar
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(countries.length, 0);

    const titles = {}
    for (const country of countries) {
        try { await connect(homeIP, country) }
        catch (error) { continue } // skip country when failed to connect to VPN

        // try scraping 3 times
        for (let i = 0; i < 3; i++) {
            try { titles[country] = await scrape(cookies, genres) }
            catch (error) { 
                console.log(`Failed to scrape titles in ${country}.`)
                console.error(error)
                console.log(i < 2 ? "Retrying..." : "Skipping...")
                continue
            }
            break
        }
        disconnect()
        bar.increment()
    }
    bar.stop()
    return titles
}

/**
 * Processes availability of titles (which countries have them)
 * 
 * @param {Object} titles 
 * @returns {Object} { title: [ country ] }
 */
const availability = titles => {
    const availability = {}
    for (const country of titles) for (const title of country) {
        if (!availability[title]) availability[title] = [] // first occurence
        availability[title].push(country)
    }
    return availability
}

/**
 * Processes thumbnails of titles
 * 
 * @param {Object} titles
 * @returns {Object} { title: thumbnail }
 */
const thumbnails = titles => {
    let thumbnails = {}
    for (const country of titles) thumbnails = { ...thumbnails, ...country }
    return thumbnails
}

(async () => {
    const titles = await titles()
    console.log("Scraped successfully.")
    
    console.log("Uploading to database...")
    await upload("availability", availability(titles))
    console.log("Uploaded availability.")
    await upload("thumbnails", thumbnails(titles))
    console.log("Uploaded thumbnails.")
})();