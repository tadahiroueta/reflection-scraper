const { execSync } = require('child_process'); // terminal library

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * @returns {string} IP address
 */
const ip = () => {
    const stdout = execSync("ipconfig").toString()
    const ipLine = stdout.split("\n").find(line => line.includes("IPv4"))
    return ipLine.split(":")[1].trim()
}

/**
 * Connect to a country's VPN
 * 
 * @param {string} homeIP
 * @param {string} country
 * @throws {Error} if failed to connect to VPN server
 */
const connect = async (homeIP, country) => {
    if (country == "united-states") return // already in US

    execSync(`openvpn-gui --connect ${country}`)

    // wait for 3 minutes
    for (let i = 0; i < 180; i++) {
        await sleep(1000)
        if (ip() != homeIP) return
    }

    throw new Error(`Failed to connect to VPN server in ${country}.`) // 3 minute timeout
}

/** Disconnects from any VPN */
const disconnect = () => execSync("openvpn-gui --command disconnect_all")

module.exports = { ip, connect, disconnect }