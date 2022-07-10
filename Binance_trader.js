require('dotenv').config();
const Binance = require('node-binance-api');
const ccxt = require('ccxt');
const axios = require('axios');
const target = require('./Config.json');
const { Console } = require('console');

// (async function() {
//   let ftx = new ccxt.binance({
//     apiKey: process.env.BINANCE_API_KEY,
//     secret: process.env.BINANCE_API_SECRET
//   });
//   const symbol = 'BTC/USD'
//   const amount = 0.0001 // BTC

// })();

const tick = async(ticket, binanceClient) => {
  const {asset, base, spread, allocation} = ticket;
  const market = `${asset}/${base}`;


  // let markets = await binanceClient.load_markets()

  // console.log(markets)
  // orderbook = markets['BTC/USDT']
//   console.log(orderbook)
  // const symbol = 'BTC/USDT'
  // const amount = 1.2345678 // amount in base currency BTC
  // const price = 87654.321 // price in quote currency USDT
  // const formattedAmount = binanceClient.amountToPrecision (symbol, amount)
  // const formattedPrice = binanceClient.priceToPrecision (symbol, price)
  // console.log (formattedAmount, formattedPrice)


  // const orders = await binanceClient.fetchOpenOrders(market);
//   console.log(orders)
  // orders.forEach(async order => {
  //   await binanceClient.cancelOrder(order.id);
  // });


  // const balances = await binanceClient.fetchBalance();
  // console.log(balances)
  // const assetBalance = balances.free[asset];
  // const baseBalance = balances.free[base];
//   console.log(`${ticket.asset} balance : ${assetBalance}`)
//   console.log(`${ticket.base} balance : ${baseBalance}`)
  // console.log(`My ${target.token0} balance : ${balances.free[target.token0]}`)
  // console.log(`My ${target.token1} balance : ${balances.free[target.token1]}`)

  // await binanceClient.createLimitSellOrder(market, 0.001, 40000);
  // console.log(`
  // New tick for ${market}
  // Created limit sell order
  // `)

    // Get market price
    // let order_book = await binanceClient.fetchOrderBook(`${target.token0}/${target.token1}`, 10);
    // console.log(order_book)
    // console.log(`Lowest bid: ${order_book['bids'][9]}`)
    // console.log(`Highest ask: ${order_book['asks'][0]}`)



    //
    // Try get balance directly with Binance API 
    //
    // let balance = await binanceClient.balance();



    //
    // Try set order
    //
    console.log("start setting an order")

    binanceClient.marketBuy("BTCUSDT", 0.001, (error, response) => {
      if (error){
        console.log(`status code : ${error.statusCode}`)
      }else{
        console.info("Limit Buy response", response);
        console.info("order id: " + response.orderId);
      }
    });

    // let quantity = 0.0001, price = 100;
    // binanceClient.buy("ETHUSDT", quantity, price, {type:'LIMIT'}, (error, response) => {
    //   if (error){
    //     console.log(error)
    //   }
    //   console.info("Limit Buy response", response);
    //   console.info("order id: " + response.orderId);
    // });
    console.log("Complete an order");

}

//
// Access Binance with ccxt
//
const run = () => {
  const ticket = {
    asset : 'BTC',
    base : 'USDT',
    allocation : 0.1,
    spread : 0.2,
    tickInterval : 2000
  };

  // const binanceClient = new ccxt.binance({
  //   apiKey: process.env.BINANCE_API_KEY,
  //   secret: process.env.BINANCE_API_SECRET
  // });
  const binanceClient = new Binance().options({
    APIKEY: process.env.BINANCE_API_KEY,
    APISECRET: process.env.BINANCE_API_SECRET,
    useServerTime: true,
    family: 0
  });


  // console.log(binanceClient)

  tick(ticket, binanceClient);
  // setInterval(tick, ticket.tickInterval, ticket, binanceClient);

};
run();




//
// Access Binance directly with API
//

const binanceClient = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: true,
  family: 0
});


exports.getPriceBinance = async (binanceClient, token0, token1) => {
  let ticker = await binanceClient.prices();
  let ticker_name = `${token0}${token1}`
  // console.info(`Price of ${target.token0}/${target.token1}: ${ticker[ticker_name]}`);
  return ticker[ticker_name]
}


async function main() {
  const { getPriceBinance } = require('./Binance_trader')

  const price = await getPriceBinance(binanceClient, target.token0, target.token1)

    // let ticker = await binance.prices();
    // let ticker_name = `${target.token0}${target.token1}`
    // console.info(`Price of ${target.token0}/${target.token1}: ${ticker[ticker_name]}`);

    // var count = Object.keys(ticker).length;
    // console.log((count))
    // console.info(`Price of MATIC: ${ticket.MATICUSDT}`)

//     binance.balance((error, balances) => {
//         // if ( error ) return console.error(error);
//         // console.info("balances()", balances);
//         console.info("BNB balance: ", balances.BNB.available);
//         console.info("BTC balance: ", balances.BTC.available);
//         console.info("ETH balance: ", balances.ETH.available);
//     });
}

// main()