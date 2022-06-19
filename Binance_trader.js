require('dotenv').config();
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: true,
  family: 0
});

async function main() {
    let ticker = await binance.prices();
    console.info(`Price of BTC: ${ticker.BTCUSDT}`);
    console.info(`Price of ETH: ${ticker.ETHUSDT}`);

    binance.balance((error, balances) => {
        // if ( error ) return console.error(error);
        // console.info("balances()", balances);
        console.info("BNB balance: ", balances.BNB.available);
        console.info("BTC balance: ", balances.BTC.available);
        console.info("ETH balance: ", balances.ETH.available);
    });
}

main()