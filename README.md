# Reflection Scraper
***A scraper for available Netflix titles across different countries with a VPN***

[Built With](#built-with) · [Features](#features) · [Installation](#installation) · [Usage](#usage)

## Built With

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
- ![Windows 11](https://img.shields.io/badge/Windows%2011-%230079d5.svg?style=for-the-badge&logo=Windows%2011&logoColor=white)
- ![Netflix](https://img.shields.io/badge/Netflix-E50914?style=for-the-badge&logo=netflix&logoColor=white)

## Features

### Pre-programmed VPN

The scraper uses OpenVPN GUI to connect to different countries and check their Netflix titles
<img src="https://yqintl.alicdn.com/1ddfc3fd86fd63a092e5eb8ee22aba4cadff07bf.png" alt="open-vpn" width="50%" />

### Scrape ***all*** Netflix titles
The Puppeteer headless browser runs over every Netflix genre to get every title, thumbnail, and availability by country

![netflix-genres](https://github.com/tadahiroueta/reflection-scraper/blob/master/samples/netflix-genres.png)

### Cloud storage
All scraped data is sent to MongoDB to be uploaded and updated

![mongo](https://github.com/tadahiroueta/reflection-scraper/blob/master/samples/mongo.png)

## Installation

### Paid requirements
- Netflix subscription
- A suitible VPN - I used [NordVPN](https://nordvpn.com/)
    > Free VPNs often have over-used servers that are black-listed from Netflix

### Set up

1. Install [Node.JS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    > I personally recommend using Node Version Manager (NVM) [(for Windows)](https://github.com/coreybutler/nvm-windows)

2. Clone repository
    ```sh
    git clone https://github.com/tadahiroueta/reflection-scraper.git
    ```

3. Install dependencies
    ```sh
    npm install
    ```
    
4. Set up VPN
    - Install [OpenVPN](https://openvpn.net/community-downloads/) with OpenVPN GUI enabled [(instructions)](https://openvpn.net/community-resources/how-to-install-the-openvpn-gui-on-windows/)
    - Download a TCP configuration file for each country from which you want to scrape [(TCP files for NordVPN)](https://nordvpn.com/servers/tools/)
    - Save TCP files to the OpenVPN's ```config/``` folder
    - Rename each file to the name of their respective country
    - Create a ```auth.txt``` file in OpenVPN's ```config/``` folder
    - Type your username for your VPN service on the first line, and your password on the second
        ```
        <username>
        <password>
        ```
    - In each TCP file, type "auth.txt" immediately after "auth-user-pass"
        ```
        remote-cert-tls server

        auth-user-pass auth.txt
        verb 3
        pull
        fast-io...
        ```

5. Add countries to ```data/countries.json``` e.g.
    ```json
    [
      "australia",
      "chile",
      "mexico",
      "united-kingdom",
      "united-states"
    ]
    ```
  
6. Get cookies
    - Log into your Netflix account and profile
    - Download cookies as a JSON file to ```data/``` folder
        >I recommend using [this Chrome extension](https://chrome.google.com/webstore/detail/%E3%82%AF%E3%83%83%E3%82%AD%E3%83%BCjson%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%87%BA%E5%8A%9B-for-puppet/nmckokihipjgplolmcmjakknndddifde?hl=en)
    - Rename the JSON file to ```cookies.json```

7. Connect your MongoDB
    - Sign in/up to MongoDB
    - Create a cluster
    - Add a database
    - Add two collections to the database ```availability``` and ```thumbnails```
    - Get the connection string (at your MongoDB Atlas dashboard, go to Connect>Drivers)
    - Copy the connection string over to your ```data/mongoURI.json```
    ```json 
    "mongodb+srv://<username>:<password>@clustername900.patewxq.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName900"
    ```
    > Add quotes around the connection string
    - Fill in ```<username>``` and ```<password>```
    - Type the name of your database (not cluster) in ```data/database-name.json```
    ```json
    "mydatabasename"
    ```

## Usage

1. Run
    ```sh
    node index
    ```
    > The code will take 12-24 hours to run.
    >
    > Do not turn it off and keep a steady connection.
    >
    > Most errors occur because of a bad server, so get another TCP file