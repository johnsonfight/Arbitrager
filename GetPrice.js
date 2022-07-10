const { ethers } = require("ethers");
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { abi: QuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const { getAbi, getPoolImmutables } = require('./HelperModule')
const address = require('./Addresses_mainnet.json')

require('dotenv').config()
const INFURA_URL = process.env.INFURA_URL_MAINNET
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL)

exports.getPrice = async (poolAddress, inputAmount) => {
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  )
  
  const tokenAddress0 = await poolContract.token0();
  const tokenAddress1 = await poolContract.token1();
  const tokenAbi0 = await getAbi(tokenAddress0)
  const tokenAbi1 = await getAbi(tokenAddress1)

  const tokenContract0 = new ethers.Contract(
    tokenAddress0,
    tokenAbi0,
    provider
  )
  const tokenContract1 = new ethers.Contract(
    tokenAddress1,
    tokenAbi1,
    provider
  )

  const tokenSymbol0 = await tokenContract0.symbol()
  const tokenSymbol1 = await tokenContract1.symbol()
  const tokenDecimals0 = await tokenContract0.decimals()
  const tokenDecimals1 = await tokenContract1.decimals()

  console.log('Token0: ' + tokenSymbol0 + '. Decimal: ' + tokenDecimals0)
  console.log('Token1: ' + tokenSymbol1 + '. Decimal: ' + tokenDecimals1)

  const quoterAddress = address.quoterAddress
  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
  )

  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    tokenDecimals0
  )

  const immutables = await getPoolImmutables(poolContract)
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    immutables.token0,
    immutables.token1,
    immutables.fee,
    amountIn,
    0
  )

  const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1)

  console.log('==================')
  console.log(`${inputAmount} ${tokenSymbol0} = ${amountOut} ${tokenSymbol1}`)
  console.log('==================')
}

async function main() {
    const { getPrice } = require('./GetPrice')
    const poolAddress = address.pool.WETHUSDT

    const price = await getPrice(poolAddress, 1)
  }
main()