require('dotenv').config();
const fs = require('fs');
const Binance = require('node-binance-api');
const target = require('./Config.json');
const { getPriceBinance } = require('./Binance_trader')
const { getPrice } = require('./GetPrice_arb1')
const address = require('./Addresses_arb1_mainnet.json')

function getTime() {
    var currentdate = new Date().toLocaleString('zh-tw').substr(0, 19);
    return currentdate
}


const binanceClient = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET,
    useServerTime: true,
    family: 0
});
async function main() {
    let currentTime = getTime()
    try {
        let priceBinance = await getPriceBinance(binanceClient, target.token0, target.token1)
        let priceUniswap = await getPrice(address["pool"]["ETHUSDT"], 1)
        let priceDiff = priceBinance - priceUniswap;
        console.log(`${currentTime} priceBinance-priceUniswap= ${priceDiff}`)
      }
      catch(err) {
        console.log("Error but nvm~")
      }

    // if (Math.abs(priceDiff) > 3) {
    //     console.log(`Execute arbitrage.`)
    // }
}
// main()
setInterval(main, 5000);