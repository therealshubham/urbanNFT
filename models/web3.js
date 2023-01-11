require('dotenv').config({ path: './../.env'});
const Web3 = require('web3');

const ABI = require('./../config/smart-contract').getSmartContractABI();
const addr = require('./../config/smart-contract').getSmartContractAddress();

const web3 = new Web3(process.env.POLYGON_ACCESS_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.MATIC_WALLET_PRIVATE_KEY);

const contract = new web3.eth.Contract(ABI, addr);

function checkAddress(addr) {
    return web3.utils.isAddress(addr);
}

function getSmartContract() {
	return contract;
}

async function executeTransaction(transaction) {
    const address = account.address;
    const options = {
        to      : transaction._parent._address,
        data    : transaction.encodeABI(),
        gas     : await transaction.estimateGas({from: address}),
        gasPrice: await web3.eth.getGasPrice()
    };
    const signed  = await web3.eth.accounts.signTransaction(options, account.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return receipt;
}

module.exports.executeTransaction = executeTransaction;
module.exports.getSmartContract = getSmartContract;
module.exports.checkAddress = checkAddress;

// sample transaction
// const transaction = contract.methods.safeMint(receiver, "https://api.npoint.io/c219633efcecf665edca");

// sample executeTransaction
// executeTransaction(transaction).then((data) => {
//     console.log(data);
// });

// sample call to smart contract
// contract.methods.ownerOf(1).call().then((data) => {
// 	console.log(data);
// });
