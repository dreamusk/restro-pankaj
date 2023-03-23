const Web3 = require('web3');
const TelegramBot = require('node-telegram-bot-api');

// Connect to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// Your Ethereum wallet address
const walletAddress = '0x...';

// Your Telegram bot API key and chat ID
const botApiKey = 'YOUR_TELEGRAM_BOT_API_KEY';
const chatId = 'YOUR_TELEGRAM_CHAT_ID';

// Create a new Telegram bot
const bot = new TelegramBot(botApiKey, { polling: false });

// Start monitoring for incoming transactions
web3.eth.subscribe('pendingTransactions', (error, result) => {
    if (error) {
        console.error(error);
    }
}).on('data', (transactionHash) => {
    web3.eth.getTransaction(transactionHash).then((transaction) => {
        if (transaction.to === walletAddress) {
            // Payment received, send notification to Telegram
            const message = `Payment received: ${web3.utils.fromWei(transaction.value)} ETH`;
            bot.sendMessage(chatId, message);
        }
    });
});
