# Reflection Scraper
*A scraper for available Netflix titles across different countries*

It relies mostly on a Puppeteer web crawler and OpenVPN with a VPN subscription.

## Requirements
* NPM
* Node
* Paid VPN subscription
* Netflix subscription

## Set up
*(this is gonna be a lot)*

* Install Open VPN gui on your device
* Install VPN server files
    * Download a TCP config file for each country you want to scrape ([where to find for Nord VPN](https://nordvpn.com/servers/tools/))
    * Save these files to the Open VPN config folder
    * Rename each file with the name of their country
* Credentials
    * Create pass.txt for your VPN subscription credentials
    * Type your username on the first line, and password on the second
    * Save it to Open VPN config folder
    * For each of the files on the server, add "pass.txt" after " auth-user-pass" on the same line
* Create "data" folder on repository
    * Create "countries.json" as a list of filenames (e.g. "albania") in your Open VPN config folder (excluding pass.txt and other discritionary files)
    * Create "genres.json" in the format [{ "name": "Action Films", "id": 1365 }] (personally ask me for the file if you don't already have it)
* Netflix
    * Log into your account and profile
    * Install the Google extention "Export cookie JSON file for Puppeteer"
    * Run the extention and save the file as "cookies.json" in data folder
* Run `npm install` on terminal for Node JS libraries

## Usage

`node index`

*it should take about 12h*

<br><br><br>

Contact me if you have any questions.