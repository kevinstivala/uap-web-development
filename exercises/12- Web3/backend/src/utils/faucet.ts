import { ethers } from 'ethers'
import FaucetABI from '../contracts/FaucetTokenABI.json'

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
export const faucetContract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, FaucetABI, wallet)
