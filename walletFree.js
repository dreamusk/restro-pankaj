const Web3 = require('web3');
const TelegramBot = require('node-telegram-bot-api');

// Ethereum wallet address to monitor
const WALLET_ADDRESS = '0x63110C5F4624d4b7EB93d094b0C74dEE50F68CC7';

// Initialize Web3 with the node's RPC endpoint
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// Initialize Telegram bot with your bot token
const bot = new TelegramBot('6117582676:AAGzJaUmpCLiBSZAa3P77xi3Kh7j20I4h0I', { polling: true });

// Listen for new blocks on the Ethereum network
web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
  if (error) {
    console.error(error);
    return;
  }

  // Get block details
  web3.eth.getBlock(blockHeader.hash, true, async (error, block) => {
    if (error) {
      console.error(error);
      return;
    }

    // Loop through transactions in block
    for (const tx of block.transactions) {
      if (tx.to.toLowerCase() === WALLET_ADDRESS.toLowerCase()) {
        // Transaction is to our wallet
        const value = web3.utils.fromWei(tx.value);

        // Send notification to Telegram
        bot.sendMessage('https://t.me/foodForAnkitbot', `New transaction received: ${value} ETH\nTransaction details: https://etherscan.io/tx/${tx.hash}`);
      }
    }
  });
});

