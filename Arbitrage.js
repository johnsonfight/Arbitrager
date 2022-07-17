require('dotenv').config();
const {readFileSync} = require('fs');
const Binance = require('node-binance-api');
const config = require('./Config.json');
const { getPriceBinance } = require('./Binance_trader')
const { getPrice } = require('./GetPrice_arb1')
const address = require('./Addresses_arb1_mainnet.json')

const binanceClient = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET,
    useServerTime: true,
    family: 0
});

function getTime() {
    var currentdate = new Date().toLocaleString('zh-tw').substr(0, 19);
    return currentdate
}

function readRefDataFromFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    const arr = contents.split(/\r?\n/);
  
    return arr;
  }

function getMedianCI(arr, diff){
    console.log(`arr.length = ${arr.length}`)
    if (arr.length <= 120960){ // 12*60*24*7 (diff data in 7 days)
        arr.push(diff)
    }
    else{
        arr.shift()
        arr.push(diff)
    }

    var arr_sort = arr.sort()
    var data_map = {
        "median" : {
            "index" : Math.round((arr.length+1)/2),
            "value" : arr_sort[Math.round((arr.length+1)/2)]
        },
        "ci_95" : {
            "index" : Math.round((arr.length+1)*0.95),
            "value" : arr_sort[Math.round((arr.length+1)*0.95)]
        },
        "ci_5" : {
            "index" : Math.round((arr.length+1)*0.05),
            "value" : arr_sort[Math.round((arr.length+1)*0.05)]
        }
    }

    console.log(data_map)

    return data_map    
}

var diff_arr = readRefDataFromFile("./sample_diff_data.txt") // Set some init diff data
var data_map = {}
async function main() {
    let currentTime = getTime()

    try {
        let price_binance = await getPriceBinance(binanceClient, config.token0, config.token1)
        let price_uniswap = await getPrice(address["pool"]["ETHUSDT"], 1)
        let price_diff = price_binance - price_uniswap;
        console.log(`${currentTime} price_binance-price_uniswap= ${price_diff}`)

        data_map = getMedianCI(diff_arr, price_diff)
      }
      catch(err) {
        console.log("Error but nvm~")
      }

    // if (Math.abs(price_diff) > 3) {
    //     console.log(`Execute arbitrage.`)
    // }
}
// main()
setInterval(main, 5000);