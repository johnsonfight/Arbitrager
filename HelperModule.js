require('dotenv').config()
const axios = require('axios')
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

exports.getPoolImmutables = async (poolContract) => {
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee()
    ])
  
    const immutables = {
      token0: token0,
      token1: token1,
      fee: fee
    }
    console.log("token0: " + immutables.token0)
    console.log("token1: " + immutables.token1)
    console.log("fee: " + immutables.fee)
    return immutables
  }
  
exports.getPoolState = async (poolContract) => {
  const slot = poolContract.slot0()
  console.log('slot: ' + slot)

  const state = {
    sqrtPriceX96: slot[0]
  }
  console.log('state: ' + state)

  return state
}

exports.getAbi = async (address) => {
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`
  const res = await axios.get(url)
  const abi = JSON.parse(res.data.result)
  return abi
}