/* eslint-disable */
const { log: logger } = require('./middleware');

const transactionThreshold = 5;
const toFixed = 5;

const oneAsh = 1;
const oneChar = 1000 * 1000;
const totalCoins = 250000000 * +oneChar;
const getNumOfAshes = num => +num * +oneAsh;
const getNumOfChars = num => (+num * +oneChar).toFixed(toFixed);

const validatorStakeRequirement = getNumOfChars(10);

const transactionFeeMin = getNumOfAshes(10); // 10 ashs, Minimum transaction fee
const transactionFeeMax = getNumOfAshes(100); // 100 ashs, Maximum transaction fee
const transactionFeeValidator = +0.01; // 1% of the total amount
const transactionFeeValidatorBonus = +0.025; // 2.5% of number of transactions

const transactionFeeBurn = +0.15; // 40% of the transaction fee
const transactionFeeDonation = +0.35; // 18% of the transaction fee
const transactionFeeStorage = getNumOfAshes(5);

TOTAL_COINS = totalCoins;
TRANSACTION_THRESHOLD = transactionThreshold;
VALIDATOR_STAKE_REQUIREMENT = validatorStakeRequirement;
TRANSACTION_FEE_MIN = transactionFeeMin;
TRANSACTION_FEE_MAX = transactionFeeMax;
TRANSACTION_FEE_BURN = transactionFeeBurn;
TRANSACTION_FEE_DONATION = transactionFeeDonation;
TRANSACTION_FEE_STORAGE = transactionFeeStorage;
TRANSACTION_FEE_VALIDATOR = transactionFeeValidator;
TRANSACTION_FEE_VALIDATOR_BONUS = transactionFeeValidatorBonus;

log = logger;
ashes = getNumOfAshes;
chars = getNumOfChars;
fixed = toFixed;

module.exports = {
  global,
};
