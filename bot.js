// ------------------------------------
// 1. DEPENDENCIES
// ------------------------------------

require("dotenv").config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const Web3 = require("web3");
const WebSocket = require('ws');
const fetch = require('node-fetch');
const Discord = require('discord.js');

const STORAGE_ABI = [{"inputs":[{"internalType":"contractTokenInterfaceV5","name":"_dai","type":"address"},{"internalType":"contractTokenInterfaceV5","name":"_token","type":"address"},{"internalType":"contractTokenInterfaceV5","name":"_linkErc677","type":"address"},{"internalType":"contractNftInterfaceV5[5]","name":"_nfts","type":"address[5]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contractNftInterfaceV5[5]","name":"nfts","type":"address[5]"}],"name":"NftsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdatedPair","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[5]","name":"","type":"uint256[5]"}],"name":"SpreadReductionsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"SupportedTokenAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"TradingContractAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"TradingContractRemoved","type":"event"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"PRECISION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"callbacks","outputs":[{"internalType":"contractPausableInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"dai","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"defaultLeverageUnlocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"dev","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devFeesDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"devFeesToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"gov","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFeesDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"govFeesToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isTradingContract","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"linkErc677","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxGainP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxPendingMarketOrders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxSlP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxTradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"maxTradesPerPair","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftLastSuccess","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"nftSuccessTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nfts","outputs":[{"internalType":"contractNftInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openInterestDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrderIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrders","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openLimitOrdersCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTrades","outputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTradesCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"openTradesInfo","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"tokenPriceDai","type":"uint256"},{"internalType":"uint256","name":"openInterestDai","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"},{"internalType":"bool","name":"beingMarketClosed","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTraders","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pairTradersId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketCloseCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingMarketOpenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pendingOrderIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"pool","outputs":[{"internalType":"contractPoolInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"priceAggregator","outputs":[{"internalType":"contractAggregatorInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"reqID_pendingMarketOrder","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"reqID_pendingNftOrder","outputs":[{"internalType":"address","name":"nftHolder","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"enumGFarmTestnetTradingStorageV5.LimitOrder","name":"orderType","type":"uint8"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"spreadReductionsP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"supportedTokens","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"token","outputs":[{"internalType":"contractTokenInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokenDaiRouter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensBurned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"tokensMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"traders","outputs":[{"internalType":"uint256","name":"leverageUnlocked","type":"uint256"},{"internalType":"address","name":"referral","type":"address"},{"internalType":"uint256","name":"referralRewardsTotal","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tradesPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"trading","outputs":[{"internalType":"contractPausableInterfaceV5","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_gov","type":"address"}],"name":"setGov","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dev","type":"address"}],"name":"setDev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractTokenInterfaceV5","name":"_newToken","type":"address"}],"name":"updateToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contractNftInterfaceV5[5]","name":"_nfts","type":"address[5]"}],"name":"updateNfts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"addTradingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"removeTradingContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"addSupportedToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_aggregator","type":"address"}],"name":"setPriceAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pool","type":"address"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_vault","type":"address"}],"name":"setVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trading","type":"address"}],"name":"setTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_callbacks","type":"address"}],"name":"setCallbacks","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenDaiRouter","type":"address"}],"name":"setTokenDaiRouter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTradesPerBlock","type":"uint256"}],"name":"setMaxTradesPerBlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxTradesPerPair","type":"uint256"}],"name":"setMaxTradesPerPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxPendingMarketOrders","type":"uint256"}],"name":"setMaxPendingMarketOrders","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxGainP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_lev","type":"uint256"}],"name":"setDefaultLeverageUnlocked","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxSlP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocks","type":"uint256"}],"name":"setNftSuccessTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[5]","name":"_r","type":"uint256[5]"}],"name":"setSpreadReductionsP","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_newMaxOpenInterest","type":"uint256"}],"name":"setMaxOpenInterestDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"_trade","type":"tuple"},{"components":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"tokenPriceDai","type":"uint256"},{"internalType":"uint256","name":"openInterestDai","type":"uint256"},{"internalType":"uint256","name":"tpLastUpdated","type":"uint256"},{"internalType":"uint256","name":"slLastUpdated","type":"uint256"},{"internalType":"bool","name":"beingMarketClosed","type":"bool"}],"internalType":"structGFarmTestnetTradingStorageV5.TradeInfo","name":"_tradeInfo","type":"tuple"}],"name":"storeTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"unregisterTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.PendingMarketOrder","name":"_order","type":"tuple"},{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_open","type":"bool"}],"name":"storePendingMarketOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_open","type":"bool"}],"name":"unregisterPendingMarketOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"o","type":"tuple"}],"name":"storeOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"_o","type":"tuple"}],"name":"updateOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"unregisterOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"nftHolder","type":"address"},{"internalType":"uint256","name":"nftId","type":"uint256"},{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"enumGFarmTestnetTradingStorageV5.LimitOrder","name":"orderType","type":"uint8"}],"internalType":"structGFarmTestnetTradingStorageV5.PendingNftOrder","name":"_nftOrder","type":"tuple"},{"internalType":"uint256","name":"_orderId","type":"uint256"}],"name":"storePendingNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"unregisterPendingNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newSl","type":"uint256"}],"name":"updateSl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newTp","type":"uint256"}],"name":"updateTp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.Trade","name":"_t","type":"tuple"}],"name":"updateTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"address","name":"_referral","type":"address"}],"name":"storeReferral","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_referral","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increaseReferralRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"distributeLpRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increaseNftRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_newLeverage","type":"uint256"}],"name":"setLeverageUnlocked","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_leveragedPositionSize","type":"uint256"},{"internalType":"bool","name":"_dai","type":"bool"},{"internalType":"bool","name":"_fullFee","type":"bool"}],"name":"handleDevGovFees","outputs":[{"internalType":"uint256","name":"fee","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claimFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bool","name":"_mint","type":"bool"}],"name":"handleTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"transferDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_leveragedPosDai","type":"uint256"}],"name":"transferLinkToAggregator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"firstEmptyTradeIndex","outputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"firstEmptyOpenLimitIndex","outputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"hasOpenLimitOrder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getReferral","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getLeverageUnlocked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"}],"name":"pairTradersArray","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"getPendingOrderIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"}],"name":"pendingOrderIdsCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getOpenLimitOrder","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder","name":"","type":"tuple"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getOpenLimitOrders","outputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"positionSize","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"},{"internalType":"uint256","name":"maxPrice","type":"uint256"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"internalType":"structGFarmTestnetTradingStorageV5.OpenLimitOrder[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getSupportedTokens","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"getSpreadReductionsArray","outputs":[{"internalType":"uint256[5]","name":"","type":"uint256[5]"}],"stateMutability":"view","type":"function","constant":true}];
const TRADING_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"a","type":"address"}],"name":"AddressUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"},{"components":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"struct StorageInterfaceV5.Trade","name":"trade","type":"tuple"},{"internalType":"uint256","name":"block","type":"uint256"},{"internalType":"uint256","name":"wantedPrice","type":"uint256"},{"internalType":"uint256","name":"slippageP","type":"uint256"},{"internalType":"uint256","name":"spreadReductionP","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"indexed":false,"internalType":"struct StorageInterfaceV5.PendingMarketOrder","name":"order","type":"tuple"}],"name":"ChainlinkCallbackTimeout","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"CouldNotCloseTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"done","type":"bool"}],"name":"Done","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"bool","name":"open","type":"bool"},{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"}],"name":"MarketOrderInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"nftHolder","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"}],"name":"NftOrderInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"nftHolder","type":"address"},{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"}],"name":"NftOrderSameBlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"NumberUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OpenLimitCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"}],"name":"OpenLimitPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newSl","type":"uint256"}],"name":"OpenLimitUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newSl","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"orderId","type":"uint256"}],"name":"SlUpdateInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newSl","type":"uint256"}],"name":"SlUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"uint256","name":"pairIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTp","type":"uint256"}],"name":"TpUpdated","type":"event"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"cancelOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"closeTradeMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"closeTradeMarketTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"done","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum StorageInterfaceV5.LimitOrder","name":"_orderType","type":"uint8"},{"internalType":"address","name":"_trader","type":"address"},{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_nftId","type":"uint256"},{"internalType":"uint256","name":"_nftType","type":"uint256"}],"name":"executeNftOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isDone","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"limitOrdersTimelock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketOrdersTimeout","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxPosDai","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"trader","type":"address"},{"internalType":"uint256","name":"pairIndex","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"initialPosToken","type":"uint256"},{"internalType":"uint256","name":"positionSizeDai","type":"uint256"},{"internalType":"uint256","name":"openPrice","type":"uint256"},{"internalType":"bool","name":"buy","type":"bool"},{"internalType":"uint256","name":"leverage","type":"uint256"},{"internalType":"uint256","name":"tp","type":"uint256"},{"internalType":"uint256","name":"sl","type":"uint256"}],"internalType":"struct StorageInterfaceV5.Trade","name":"t","type":"tuple"},{"internalType":"enum NftRewardsInterfaceV6.OpenLimitOrderType","name":"_type","type":"uint8"},{"internalType":"uint256","name":"_spreadReductionId","type":"uint256"},{"internalType":"uint256","name":"_slippageP","type":"uint256"},{"internalType":"address","name":"_referral","type":"address"}],"name":"openTrade","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_order","type":"uint256"}],"name":"openTradeMarketTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blocks","type":"uint256"}],"name":"setLimitOrdersTimelock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketOrdersTimeout","type":"uint256"}],"name":"setMarketOrdersTimeout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"setMaxPosDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_tp","type":"uint256"},{"internalType":"uint256","name":"_sl","type":"uint256"}],"name":"updateOpenLimitOrder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newSl","type":"uint256"}],"name":"updateSl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pairIndex","type":"uint256"},{"internalType":"uint256","name":"_index","type":"uint256"},{"internalType":"uint256","name":"_newTp","type":"uint256"}],"name":"updateTp","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const NFT_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function","constant":true},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const DAI_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"address payable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"CHILD_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CHILD_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEPOSITOR_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ERC712_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_CHAIN_ID_BYTES","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"}],"name":"changeName","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"bytes","name":"depositData","type":"bytes"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getDomainSeperator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"getRoleMember","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleMemberCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint8","name":"decimals_","type":"uint8"},{"internalType":"address","name":"childChainManager","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"pull","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"push","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const QUICKSWAP_DAI_ABI = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];

let web3, gasData, tokenPrices, tradeVariables, 
	openTrades = new Map(), pairs = [], openInterests = [],
	storageContract, tradingContract, tradingAddress;

const CLONE_JSON = JSON.parse(process.env.CLONE_JSON);
const WSS_URL = process.env.WSS_URL;
const TRANSACTION_WSS_URL = process.env.TRANSACTION_WSS_URL;

setTimeout(() => {
	start();
	getIndexs();
	setTimeout(() => {
		getNonces();
		checkDaiAllowance();
		claimTimeoutOrders();
		addDai();
	}, 3 * 1000);
}, 5 * 1000);

const getProvider = (wssUrl) => {
	const provider = new Web3.providers.WebsocketProvider(wssUrl, {clientConfig:{keepalive:true, keepaliveInterval:45*1000}});
	provider.on('connect', () => console.log('WS Connected wssUrl: ' + wssUrl));
	provider.on('error', e => {
		//console.error('WS Error ' + wssUrl);
		web3.setProvider(getProvider(wssUrl));
	})
	provider.on('end', e => {
		console.error('WS End ' + wssUrl);
		web3.setProvider(getProvider(wssUrl));
	})
	return provider
}

let wssErrorCount = 0;
async function start() {
	try {
		web3 = new Web3(getProvider(WSS_URL));
	} catch (e) {
		setTimeout(async () => {
			start();
		}, 60 * 1000);
		return;
	}
	storageContract = new web3.eth.Contract(STORAGE_ABI, process.env.STORAGE_ADDRESS);
	tradingAddress = await storageContract.methods.trading().call();
	tradingContract = new web3.eth.Contract(TRADING_ABI, tradingAddress);

	let socket = new WebSocket(TRANSACTION_WSS_URL);
	socket.onclose = () => { setTimeout(() => { start() }, 15*1000); wssErrorCount++;};
	socket.onerror = () => { socket.close();  if(wssErrorCount == 10) { restartWss(); }};
	socket.onmessage = async (msg) => {
		wssErrorCount = 0;
		const message = JSON.parse(msg.data);
		if(message.eventName == 'transaction') {
			selectType(message.transaction);
		} else if (message.eventName == 'gas') {
			gasData = message.gasData;
		} else if (message.eventName == 'tokenPrices') {
			tokenPrices = message.tokenPrices;
		} else if (message.eventName == 'openTradesRefresh') {
			openTradesRefresh(message);
		} else if (message.eventName == 'openTradeAddOrUpdate') {
			openTradeAddOrUpdate(message);
		} else if (message.eventName == 'openTradeRemove') {
			openTradeRemove(message);
		} else if (message.eventName == 'tradeVariables' && message.tradeVariables) {
			tradeVariables = message.tradeVariables;
		} else if (message.eventName == 'indexList') {
			indexList = message.indexList;
		} else if (message.eventName == 'ping') {
			socket.send(JSON.stringify({
				"eventName": "pong",
				"clientName": "gainsClone"
			}));
		}
	}
}

function selectType(tx) {
	const cancelOpenLimitOrderMethodId = '0xb9b6573a';
	const closeTradeMarketMethodId = '0xa2a3c0cb';
	const openTradeMethodId = '0x9aa7c0e5';
	const updateOpenLimitOrderMethodId = '0xc641558e';
	const updateSlMethodId = '0xbe73fb99';
	const updateTpMethodId = '0xd8defd15';
	if(!tx.input) {
		return;
	}
	if(!tx.from) {
		return;
	}
	let found = false;
	for (let j = 0; j < CLONE_JSON.length; j++) {
		if(CLONE_JSON[j].addressToClone.toLowerCase() == tx.from.toLowerCase()) {
			found = true;
			console.log(JSON.stringify(tx));
			break;
		}
	}
	if(!found) {
		return;
	}
	if(tx.input.includes(cancelOpenLimitOrderMethodId)) {
		cancelOpenLimitOrder(tx);
		return;
	}
	if(tx.input.includes(closeTradeMarketMethodId)) {
		closeTradeMarket(tx);
		return;
	}
	if(tx.input.includes(openTradeMethodId)) {
		openTradeDup(tx);
		return;
	}
	if(tx.input.includes(updateOpenLimitOrderMethodId)) {
		updateOpenLimitOrder(tx);
		return;
	}
	if(tx.input.includes(updateSlMethodId)) {
		updateSl(tx);
		return;
	}
	if(tx.input.includes(updateTpMethodId)) {
		updateTp(tx);
		return;
	}
}

async function cancelOpenLimitOrder(tx) {
	console.log("cancelOpenLimitOrder");
	const params = [{
		type: 'uint256',
		name: 'pairIndex'
	}, {
		type: 'uint256',
		name: 'index'
	}];
	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));
	console.log("dParams.pairIndex: " + dParams.pairIndex + " dParams.index: " + dParams.index)
	for (let j = 0; j < CLONE_JSON.length; j++) {
		if (tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			openTrade = findMatchingOpenTrade(publicKey, tx.from, dParams.pairIndex, dParams.index, "limit");
			if (!openTrade) {
				updateIndex(publicKey, tx.from, dParams.pairIndex, "limit");
				continue;
			}

			const logString = "Closing limit order " + getIndexString(dParams.pairIndex) + longShortString(openTrade.buy) + " on bot " + publicKey + " duplicating: " + tx.from;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.cancelOpenLimitOrder(openTrade.pairIndex, openTrade.index).encodeABI(),
				gas: tx.gas,
				maxPriorityFeePerGas: web3.utils.toHex(tx.maxPriorityFeePerGas),
				maxFeePerGas: web3.utils.toHex(tx.maxFeePerGas)
			};
			sendTxn(txn, publicKey, privateKey, logString, tx.from);
		}
	}
}

async function closeTradeMarket(tx) {
	console.log("closeTradeMarket");
	const params = [{
		type: 'uint256',
		name: 'pairIndex'
	}, {
		type: 'uint256',
		name: 'index'
	}];
	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));
	for (let j = 0; j < CLONE_JSON.length; j++) {
		if (tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			openTrade = findMatchingOpenTrade(publicKey, tx.from, dParams.pairIndex, dParams.index, "market");
			if (!openTrade) {
				updateIndex(publicKey, tx.from, dParams.pairIndex, "market");
				continue;
			}

			const logString = "Closing trade " + getIndexString(dParams.pairIndex) + longShortString(openTrade.buy) + " on bot " + publicKey + " duplicating: " + tx.from;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.closeTradeMarket(openTrade.pairIndex, openTrade.index).encodeABI(),
				gas: tx.gas,
				maxPriorityFeePerGas: web3.utils.toHex(tx.maxPriorityFeePerGas),
				maxFeePerGas: web3.utils.toHex(tx.maxFeePerGas)
			};
			sendTxn(txn, publicKey, privateKey, logString, tx.from);
		}
	}
}

async function openTradeDup(tx) {
	console.log("openTrade");

	const params = [{type: 'address',name: 'from'},{type: 'uint256',name: 'pairIndex'},{type: 'uint256',name: 'index'},{type: 'uint256',name: 'initialPosToken'},{type: 'uint256',name: 'positionSizeDai'},{type: 'uint256',name: 'openPrice'},{type: 'uint8',name: 'buyTrade'},{type: 'uint256',name: 'leverage'},{type: 'uint256',name: 'takeProfit'},{type: 'uint256',name: 'stopLoss'}, {type: 'uint8',name: 'limit'}, {type: 'uint256',name: 'spreadReductionId'}, {type: 'uint256',name: 'slippageP'}, {type: 'address',name: 'referral'}];
	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));

	for (let j = 0; j < CLONE_JSON.length; j++) {
		if(tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			let collateral;
			if (web3.utils.toWei(parseInt(CLONE_JSON[j].maxCollateral).toString(), "ether") < parseFloat(dParams.positionSizeDai)) {
				collateral = web3.utils.toWei(parseInt(CLONE_JSON[j].maxCollateral).toString(), "ether");
			} else {
				collateral = dParams.positionSizeDai;
			}

			let dev = parseFloat(dParams.slippageP) / 1e12 / 2;
			//console.log("dev: " + dev);
			let takeProfit = parseFloat(dParams.takeProfit);
			let stopLoss = parseFloat(dParams.stopLoss);
			const openPrice = parseFloat(dParams.openPrice);
			const leverage = parseFloat(dParams.leverage);
			const buyTrade = parseInt(dParams.buyTrade) ? true : false;


			//tighten sl and tp ranges, ignore me
			//console.log("dParams.takeProfit: " + parseFloat(dParams.takeProfit) + " dParams.stopLoss: " + parseFloat(dParams.stopLoss));
			/*
			if (buyTrade) {
				if (takeProfit > 0) {
					//const tp = openPrice + (openPrice / leverage);
					const openPriceDev1 = openPrice - openPrice * dev;
					const maxTakeProfit = openPriceDev1 + ((openPriceDev1 / leverage) * 9.00);
					//const maxTakeProfit = openPrice + ((openPrice / leverage) * 9.00);
					//const maxTakeProfitDev = maxTakeProfit - dev*openPrice; //lower
					if (maxTakeProfit <= takeProfit) {
						takeProfit = maxTakeProfit;
					}
					console.log("maxTakeProfit: " + maxTakeProfit);
					const openPriceDev2 = openPrice + openPrice * dev;
					const minTakeProfit = openPriceDev2 + ((openPriceDev2 / leverage) * 0.25);
					//const minTakeProfitDev = minTakeProfit + dev*openPrice; //higher
					if (minTakeProfit >= takeProfit) {
						takeProfit = minTakeProfit;
					}
					console.log("minTakeProfit: " + minTakeProfit);
				}
				if (stopLoss > 0) {
					//const sl = openPrice - (openPrice / leverage);
					const openPriceDev1 = openPrice + openPrice * dev;
					const maxStopLoss = openPriceDev1 + ((openPriceDev1 / leverage) * -0.75);
					//const maxStopLossDev = maxStopLoss + dev*openPrice; //higher
					if (maxStopLoss >= stopLoss) {
						stopLoss = maxStopLoss;
					}
					console.log("maxStopLoss: " + maxStopLoss);
					const openPriceDev2 = openPrice - openPrice * dev;
					const minStopLoss = openPriceDev2 + ((openPriceDev2 / leverage) * -0.10);
					//const minStopLossDev = minStopLoss - dev*openPrice; //lower
					if (minStopLoss <= stopLoss) {
						stopLoss = minStopLoss;
					}
					console.log("minStopLoss: " + minStopLoss);
				}
			} else {
				if (takeProfit > 0) {
					//const tp = openPrice - (openPrice / leverage);
					const openPriceDev1 = openPrice + openPrice * dev;
					const maxTakeProfit = openPriceDev1 + ((openPriceDev1 / leverage) * -9.00);
					//const maxTakeProfitDev = maxTakeProfit + dev*openPrice; //higher
					if (maxTakeProfit >= takeProfit) {
						takeProfit = maxTakeProfit;
					}
					console.log("maxTakeProfit: " + maxTakeProfit);
					const openPriceDev2 = openPrice - openPrice * dev;
					const minTakeProfit = openPriceDev2 + ((openPriceDev2 / leverage) * -0.25);
					//const minTakeProfitDev = minTakeProfit - dev*openPrice; //lower
					if (minTakeProfit <= takeProfit) {
						takeProfit = minTakeProfit;
					}
					console.log("minTakeProfit: " + minTakeProfit);
				}
				if (stopLoss > 0) {
					//const sl = openPrice + (openPrice / leverage)
					const openPriceDev1 = openPrice - openPrice * dev;
					const maxStopLoss = openPriceDev1 + ((openPriceDev1 / leverage) * 0.75);
					//const maxStopLossDev = maxStopLoss - dev*openPrice; //lower
					if (maxStopLoss <= stopLoss) {
						stopLoss = maxStopLoss;
					}
					console.log("maxStopLoss: " + maxStopLoss);
					const openPriceDev2 = openPrice + openPrice * dev;
					const minStopLoss = openPriceDev2 + ((openPriceDev2 / leverage) * 0.10);
					//const minStopLossDev = minStopLoss + dev*openPrice; //higher
					if (minStopLoss >= stopLoss) {
						stopLoss = minStopLoss;
					}
					console.log("minStopLoss: " + minStopLoss);
				}
			}*/

			takeProfit = Math.round(takeProfit);
			stopLoss = Math.round(stopLoss);

			const tuple = [
				"0x0000000000000000000000000000000000000000",
				parseInt(dParams.pairIndex).toString(),
				parseInt(0).toString(),
				parseInt(0).toString(),
				parseInt(collateral).toString(),
				parseInt(dParams.openPrice).toString(),
				parseInt(dParams.buyTrade),
				parseInt(dParams.leverage).toString(),
				parseInt(takeProfit).toString(),
				parseInt(stopLoss).toString()
			];

			const logString = "Opening trade " + getIndexString(dParams.pairIndex) + longShortString(buyTrade) + " on bot " + publicKey + " duplicating: " + tx.from + " txnHash: " + tx.hash;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.openTrade(
					tuple,
					parseInt(dParams.limit),
					0, // spread reduction id
					dParams.slippageP,
					"0x8AA7bfCf45A08dDB2B23935f8b3B939914FE4207"
				).encodeABI(),
				gas: web3.utils.toHex(Math.round(parseInt(tx.gas)*1.1)), //small speed up
				gasPrice: web3.utils.toHex(Math.round(parseInt(tx.gasPrice)*1.1))
			};
			sendTxn(txn, publicKey, privateKey, logString, tx.from);
		}
	}
}

async function updateOpenLimitOrder(tx) {
	console.log("updateOpenLimitOrder");
	const params = [{type: 'uint256',name: 'pairIndex'},{type: 'uint256',name: 'index'},{type: 'uint256',name: 'price'},{type: 'uint256',name: 'slippageP'},{type: 'uint256',name: 'tp'},{type: 'uint256',name: 'sl'}];

	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));
	
	for (let j = 0; j < CLONE_JSON.length; j++) {
		if (tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			openTrade = findMatchingOpenTrade(publicKey, tx.from, dParams.pairIndex, dParams.index, "limit");
			if (!openTrade) {
				return;
			}

			const logString = "Update Open Limit Order " + getIndexString(dParams.pairIndex) + longShortString(openTrade.buy) + " for bot " + publicKey + " duplicating: " + tx.from;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.updateOpenLimitOrder(openTrade.pairIndex, openTrade.index, dParams.price, dParams.slippageP, dParams.tp, dParams.sl).encodeABI(),
				gas: tx.gas,
				maxPriorityFeePerGas: web3.utils.toHex(tx.maxPriorityFeePerGas),
				maxFeePerGas: web3.utils.toHex(tx.maxFeePerGas)
			};
			sendTxn(txn, publicKey, privateKey, logString, tx.from);
		}
	}
}

async function updateSl(tx) {
	console.log("updateSl");
	const params = [{
		type: 'uint256',
		name: 'pairIndex'
	}, {
		type: 'uint256',
		name: 'index'
	}, {
		type: 'uint256',
		name: 'newSl'
	}];
	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));

	for (let j = 0; j < CLONE_JSON.length; j++) {
		if (tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			openTrade = findMatchingOpenTrade(publicKey, tx.from, dParams.pairIndex, dParams.index, "market");
			if (!openTrade) {
				continue;
			}

			const logString = "Update SL " + getIndexString(dParams.pairIndex) + longShortString(openTrade.buy) + " for bot " + publicKey + " duplicating: " + tx.from;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.updateSl(openTrade.pairIndex, openTrade.index, dParams.newSl).encodeABI(),
				gas: tx.gas,
				maxPriorityFeePerGas: web3.utils.toHex(tx.maxPriorityFeePerGas),
				maxFeePerGas: web3.utils.toHex(tx.maxFeePerGas)
			};
			sendTxn(txn, publicKey, privateKey, logString, tx.from);
		}
	}
}

async function updateTp(tx) {
	console.log("updateTp");
	const params = [{
		type: 'uint256',
		name: 'pairIndex'
	}, {
		type: 'uint256',
		name: 'index'
	}, {
		type: 'uint256',
		name: 'newTp'
	}];
	const dParams = web3.eth.abi.decodeParameters(params, tx.input.slice(10));
	
	for (let j = 0; j < CLONE_JSON.length; j++) {
		if (tx.from.toLowerCase() != CLONE_JSON[j].addressToClone.toLowerCase()) {
			continue;
		}
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			const publicKey = CLONE_JSON[j].botsPublicKeys[i],
				privateKey = CLONE_JSON[j].botsPrivateKeys[i];

			openTrade = findMatchingOpenTrade(publicKey, tx.from, dParams.pairIndex, dParams.index, "market");
			if (!openTrade) {
				continue;
			}

			const logString = "Update TP " + getIndexString(dParams.pairIndex) + longShortString(openTrade.buy) + " for bot " + publicKey + " duplicating: " + tx.from;
			console.log(logString);
			discordLog(logString);
			
			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.updateTp(openTrade.pairIndex, openTrade.index, dParams.newTp).encodeABI(),
				gas: tx.gas,
				maxPriorityFeePerGas: web3.utils.toHex(tx.maxPriorityFeePerGas),
				maxFeePerGas: web3.utils.toHex(tx.maxFeePerGas)
			};
			sendTxn(txn, publicKey, privateKey, logString, null, null);
		}
	}
}

async function sendTxn(txn, publicKey, privateKey, logString, trader, updateNextPairIndex = null, pairIndex = null) {
	web3.eth.accounts.signTransaction(txn, privateKey).then(signed => {
		web3.eth.sendSignedTransaction(signed.rawTransaction)
			.on('receipt', (receipt) => {
				//updateIndex(publicKey, trader, pairIndex, updateNextPairIndex);
				console.log("Trigger transaction success. : " + logString);
				discordLog("Trigger transaction success. : " + logString);
			}).on('error', (e) => {
				//updateIndex(publicKey, trader, pairIndex, updateNextPairIndex);
				console.log("Failed to trigger transaction. : " + logString);
				discordLog("Failed to trigger transaction. : " + logString);
				console.log("<1<--" + e + "-->>");
			});
	}).catch(e => {
		//updateIndex(publicKey, trader, pairIndex, updateNextPairIndex);
		console.log("Failed to trigger transaction. : " + logString);
		discordLog("Failed to trigger transaction. : " + logString);
		console.log("<2<--" + e + "-->>");
	});
}

function findMatchingOpenTrade(botAddress, trader, pairIndex, indexTrader, limit) {
	trader = trader.toLowerCase();
	botAddress = botAddress.toLowerCase();

	const tradersTradeKey = buildOpenTradeKey({ trader: trader, pairIndex: pairIndex, index: indexTrader }, limit);
	//console.log("tradersTradeKey: " + JSON.stringify(tradersTradeKey));

	let tradersOpenTrade = openTrades.get(tradersTradeKey);
	console.log("tradersOpenTrade: " + JSON.stringify(tradersOpenTrade));

	if(!tradersOpenTrade) {
		return null;
	}

	let botOpenTrades = [];
	for(const openTrade of openTrades.values()) {
		if(openTrade.trader.toLowerCase() == botAddress.toLowerCase() && parseInt(openTrade.pairIndex) == parseInt(pairIndex)) {
			console.log("botOpenTrade: " + JSON.stringify(openTrade));
			botOpenTrades.push(openTrade);
		}
	}

	//fuzzy match
	for(let i = 0; i < botOpenTrades.length; i++) {
		let botOpenTrade = botOpenTrades[i];
		const priceCheckAmount = limit == "limit" ? parseFloat(tradersOpenTrade.minPrice) : parseFloat(tradersOpenTrade.openPrice);
		let deviation = getDeviation(priceCheckAmount);

		const lev = parseFloat(botOpenTrade.leverage).toString() == parseFloat(tradersOpenTrade.leverage).toString();
		const openPrice = Math.abs(parseFloat(botOpenTrade.openPrice) - parseFloat(tradersOpenTrade.openPrice)) <= deviation;
		const minPrice = Math.abs(parseFloat(botOpenTrade.minPrice) - parseFloat(tradersOpenTrade.minPrice)) <= deviation;
		const priceCheck = limit == "limit" ? minPrice : openPrice;

		// times 2 because we deviate from the original tp/sl when opening order
		deviation = getDeviation(parseFloat(tradersOpenTrade.sl));
		const sl = Math.abs(parseFloat(botOpenTrade.sl) - parseFloat(tradersOpenTrade.sl)) <= (deviation * 2);
		deviation = getDeviation(parseFloat(tradersOpenTrade.tp));
		const tp = Math.abs(parseFloat(botOpenTrade.tp) - parseFloat(tradersOpenTrade.tp)) <= (deviation * 2);

		const buy = parseFloat(botOpenTrade.buy).toString() == parseFloat(tradersOpenTrade.buy).toString();
		const pairIndex = parseFloat(botOpenTrade.pairIndex).toString() == parseFloat(tradersOpenTrade.pairIndex).toString();

		//fix me by keeping track of next open indexes so this is not needed
		//const initialPosToken = (parseFloat(botOpenTrade.initialPosToken).toString() == parseFloat(tradersOpenTrade.initialPosToken).toString());
		//const positionSizeDai = (parseFloat(botOpenTrade.positionSizeDai).toString() == parseFloat(tradersOpenTrade.positionSizeDai).toString());
		console.log("pairIndex: " + pairIndex + " priceCheck: " + priceCheck + " lev: " + lev + " sl: " + sl + " tp: " + tp + " buy: " + buy);
		if(pairIndex && priceCheck && lev && sl && tp && buy && true && true) {
			console.log("found botOpenTrade: " + JSON.stringify(botOpenTrade));
			return botOpenTrade;
		}
	}
	//discordLog("botOpenTrade not found.");
	console.log("botOpenTrade not found.");
	return null;
}

function getDeviation(priceCheckAmount) {
	let deviation = Math.round(priceCheckAmount * 0.025);
	return deviation;
}

let indexs = [];
async function getIndexs() {
	if(!tradeVariables) { 
		setTimeout(() => { getIndexs(); }, 60 * 1000)
		return;
	}
	indexs = [];
	const publicKeysBot = getBotAddresses();
	for (let i = 0; i < publicKeysBot.length; i++) {
		const publicKey = publicKeysBot[i];
		setTimeout(async () => {
			for (let z = 0; z < tradeVariables.pairsCount; z++) {
				indexs.push({
					"pairIndex": z,
					"publicKey": publicKey.toLowerCase(),
					"limit": parseInt(await storageContract.methods.firstEmptyOpenLimitIndex(publicKey, z).call()),
					"market": parseInt(await storageContract.methods.firstEmptyTradeIndex(publicKey, z).call())
				});
			}
		});
	}
	for (let j = 0; j < CLONE_JSON.length; j++) {
		const publicKey = CLONE_JSON[j].addressToClone;
		setTimeout(async () => {
			for (let z = 0; z < tradeVariables.pairsCount; z++) {
				indexs.push({
					"pairIndex": z,
					"publicKey": publicKey.toLowerCase(),
					"limit": parseInt(await storageContract.methods.firstEmptyOpenLimitIndex(publicKey, z).call()),
					"market": parseInt(await storageContract.methods.firstEmptyTradeIndex(publicKey, z).call())
				});
			}
		});
	}
}

function getIndex(publicKey, pairIndex, limit) {
	for (let i = 0; i < indexs.length; i++) {
		let index = indexs[i];
		if (index.pairIndex == pairIndex && index.publicKey == publicKey.toLowerCase()) {
			return limit ? index.limit : index.market;
		}
	}
}

async function updateIndex(publicKey, trader, pairIndex, updateNextPairIndex) {
	for (let j = 1; j < 7; j++) {
		setTimeout(async () => {
			let limit = null;
			if (updateNextPairIndex == "limit") {
				limit = true;
			} else if (updateNextPairIndex == "market") {
				limit = false;
			} else {
				return;
			}
			for (let i = 0; i < indexs.length; i++) {
				if (indexs[i].pairIndex == pairIndex) {
					if (indexs[i].publicKey == publicKey.toLowerCase()) {
						if (limit) {
							indexs[i].limit = parseInt(await storageContract.methods.firstEmptyOpenLimitIndex(publicKey, pairIndex).call());
						} else {
							indexs[i].market = parseInt(await storageContract.methods.firstEmptyTradeIndex(publicKey, pairIndex).call());
							//console.log("market newIndex: " + indexs[i].market);
						}
					}
					if (indexs[i].publicKey == trader.toLowerCase()) {
						if (limit) {
							indexs[i].limit = parseInt(await storageContract.methods.firstEmptyOpenLimitIndex(trader, pairIndex).call());
						} else {
							indexs[i].market = parseInt(await storageContract.methods.firstEmptyTradeIndex(trader, pairIndex).call());
							//console.log("market newIndex: " + indexs[i].market);
						}
					}
				}
			}
		}, j*4 * 1000);
	}
}


let nonces = [];
async function getNonces() {
	nonces = []
	const publicKeysBot = getBotAddresses();
	for (let i = 0; i < publicKeysBot.length; i++) {
		const publicKey = publicKeysBot[i];
		setTimeout(async () => {
			const nonce = {
				"publicKey": publicKey.toLowerCase(),
				"nonce": await web3.eth.getTransactionCount(publicKey)
			}
			console.log(JSON.stringify(nonce));
			nonces.push(nonce);
		});
	}
}

function getNonce(publicKey) {
	for (let i = 0; i < nonces.length; i++) {
		if (nonces[i].publicKey.toLowerCase() == publicKey.toLowerCase()) {
			return nonces[i].nonce;
		}
	}
}

function incrementNonce(publicKey) {
	for (let i = 0; i < nonces.length; i++) {
		if (nonces[i].publicKey.toLowerCase() == publicKey.toLowerCase()) {
			nonces[i].nonce = nonces[i].nonce + 1;
			break;
		}
	}
}

async function checkDaiAllowance() {
	daiContract = new web3.eth.Contract(DAI_ABI, "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
	const publicKeysBot = getBotAddresses();

	web3.eth.net.isListening().then(async () => {
		for (let i = 0; i < publicKeysBot.length; i++) {
			const publicKey = publicKeysBot[i],
				privateKey = getBotPrivateKeyFromPublicKey(publicKey);

			const allowance = await daiContract.methods.allowance(publicKey, process.env.STORAGE_ADDRESS).call() / 1e18;
			if (parseFloat(allowance) > 10000) {
				console.log("DAI allowance OK ");
			} else {
				console.log("DAI not allowed, approving now.");

				const nonce = getNonce(publicKey);
				incrementNonce(publicKey);
				const tx = {
					nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
					from: publicKey,
					to: daiContract.options.address,
					data: daiContract.methods.approve(process.env.STORAGE_ADDRESS, "115792089237316195423570985008687907853269984665640564039457584007913129639935").encodeABI(),
					maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee * 1e9),
					maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee) * 1e9),
					gas: web3.utils.toHex("100000")
				};

				web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
					web3.eth.sendSignedTransaction(signed.rawTransaction)
						.on('receipt', () => {
							console.log("DAI successfully approved.");
						}).on('error', (e) => {
							console.log("DAI approve tx fail (" + e + ")");
							setTimeout(() => {
								checkDaiAllowance();
							}, 2 * 1000);
						});
				}).catch(e => {
					console.log("DAI approve tx fail (" + e + ")");
					setTimeout(() => {
						checkDaiAllowance();
					}, 2 * 1000);
				});
			}
		}
	}).catch((e) => {
		console.log("DAI approve tx fail (" + e + ")");
		setTimeout(() => {
			checkDaiAllowance();
		}, 5 * 1000);
	});
}

async function addDai() {
	const daiContract = new web3.eth.Contract(DAI_ABI, "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
	const quickSwapDaiContract = new web3.eth.Contract(QUICKSWAP_DAI_ABI, "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff");
	const publicKeysBot = getBotAddresses();
	for (let i = 0; i < publicKeysBot.length; i++) {
		const publicKey = publicKeysBot[i],
			privateKey = getBotPrivateKeyFromPublicKey(publicKey);
		let maticBalance = web3.utils.fromWei(await web3.eth.getBalance(publicKey), "ether");
		let daiBalance = await daiContract.methods.balanceOf(publicKey).call() / 1e18;
		let leverageUnlocked = await storageContract.methods.getLeverageUnlocked(publicKey).call();
		console.log("Bot: " + publicKey + " Matic balance: " + Math.round(maticBalance) + " Dai balance: " + Math.round(daiBalance) + " leverageUnlocked: " + leverageUnlocked);

		const diaToSwap = 50;
		if (maticBalance < 2 && daiBalance > 50) {
			const logString = "Swapping " + diaToSwap + " Dai to Matic";
			console.log(logString);
			discordLog(logString);

			diaToSwap = web3.utils.toBN(parseInt(diaToSwap * 1e18));
			const deadline = web3.utils.toHex(Math.round(Date.now() / 1000) + 60 * 60);
			const path = ["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"];
			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee * 1e9),
				maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee) * 1e9),
				gas: web3.utils.toHex("3000000"),
				to: "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff",
				value: "0x0",
				data: quickSwapDaiContract.methods.swapExactTokensForETH(diaToSwap, 0, path, publicKey, deadline).encodeABI()
			};
			sendTxn(txn, publicKey, privateKey, logString, null, null);
		}
	}
}
setInterval(() => {
	addDai();
	getNonces();
	claimTimeoutOrders();
}, 3600 * 1000);

async function claimTimeoutOrders() {
	const publicKeysBot = getBotAddresses();
	for (let i = 0; i < publicKeysBot.length; i++) {
		const publicKey = publicKeysBot[i],
			privateKey = getBotPrivateKeyFromPublicKey(publicKey);

		const pendingOrderIds = await storageContract.methods.getPendingOrderIds(publicKey).call();
		for (let z = 0; z < pendingOrderIds.length; z++) {
			const pendingOrderId = pendingOrderIds[z];
			console.log("publicKey: " + publicKey + " pendingOrderId: " + pendingOrderId);

			const logString = "openTradeMarketTimeout on bot " + publicKey;
			console.log(logString);
			discordLog(logString);

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			const txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				to: tradingAddress,
				data: tradingContract.methods.openTradeMarketTimeout(pendingOrderId.toString()).encodeABI(),
				maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee * 1e9),
				maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee) * 1e9),
				gas: web3.utils.toHex("6000000")
			};
			sendTxn(txn, publicKey, privateKey, logString);
		}
	}
}

let indexList = [];
function getIndexString(index) {
	if (indexList.length <= index) {
		return "<<---Unknown--->>";
	}
	return indexList[index];
}

function longShortString(bool) {
	return bool ? " long" : " short"
}
async function openTradesRefresh(tx) {
	openTrades = new Map(tx.openTrades);
}

async function openTradeAddOrUpdate(tx) {
	openTrades.set(tx.openTradeKey, tx.openTrade);
}

async function openTradeRemove(tx) {
	openTrades.delete(tx.openTradeKey);
}

function buildOpenTradeKey(tradeDetails, type) {
	return `trader=${tradeDetails.trader.toLowerCase()};pairIndex=${tradeDetails.pairIndex};index=${tradeDetails.index};type=${type};`;
}

function isOpenTradeLimitTrade(openTrade) {
	return openTrade.minPrice ? "limit" : "market";
}

function getBotPrivateKeyFromPublicKey(publicKey) {
	for (let j = 0; j < CLONE_JSON.length; j++) {
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			if (CLONE_JSON[j].botsPublicKeys[i].toLowerCase() == publicKey.toLowerCase()) {
				return CLONE_JSON[j].botsPrivateKeys[i];
			}
		}
	}
	return null;
}

function getClonesOpenTrades() {
	let cloneOpenTrades = [];
	for (let i = 0; i < CLONE_JSON.length; i++) {
		cloneOpenTrades = cloneOpenTrades.concat(getAddressOpenTrades(CLONE_JSON[i].addressToClone));
	}
	return cloneOpenTrades;
}

function getBotOpenTrades() {
	const botAddresses = getBotAddresses();
	let botOpenTrades = [];
	for (let j = 0; j < botAddresses.length; j++) {
			botOpenTrades = botOpenTrades.concat(getAddressOpenTrades(botAddresses[j]));
	}
	return botOpenTrades;
}

function getBotAddresses() {
	let botsPublicKeys = [];
	for (let j = 0; j < CLONE_JSON.length; j++) {
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			let found = false;
			for (let z = 0; z < botsPublicKeys.length; z++) {
				if (botsPublicKeys[z] == CLONE_JSON[j].botsPublicKeys[i]) {
					found = true;
				}
			}
			if (!found) {
				botsPublicKeys.push(CLONE_JSON[j].botsPublicKeys[i]);
			}
		}
	}
	return botsPublicKeys;
}

function getAddressOpenTrades(publicKey) {
	let openTradesFound = [];
	for(const openTrade of openTrades.values()) {
		if (openTrade.trader.toLowerCase() == publicKey.toLowerCase()) {
			openTradesFound.push(openTrade);
		}
	}
	return openTradesFound;
}

function percentDiff(a, b) {
	return (a - b) / ((a + b) / 2);
}

function addOpenTradeToString(openTrade, string) {
	string = string + openTradeStrigify(openTrade) + "<br/>";
	const price = prices[openTrade.pairIndex];
	string = string + "-Current price: $" + price + ". ";
	if (isOpenTradeLimitTrade(openTrade) == "limit") {
		string = string + "Trade will open between $" + openTrade.minPrice / 1e10 + " and $" + openTrade.maxPrice / 1e10 + ".<br/>";
	} else {
		const pnl = getPnlDai(price, openTrade);
		const upDown = pnl[1] > 0 ? "up" : "down";
		string = string + "Trade is " + upDown + " $" + pnl[0] + " (" + pnl[1] + "%)<br/>";
	}
	if (getBotPrivateKeyFromPublicKey(openTrade.trader.toLowerCase())) {
		string = string + "-Close string: /closeTrade/" + openTrade.trader.toLowerCase() + "/" + openTrade.pairIndex + "/" + openTrade.index + "/" + (isOpenTradeLimitTrade(openTrade));
	}
	string = string + "<br/>";
	return string;
}

function getPnlDai(price, trade, useClosingFee = false) {
	const posDai = (trade.initialPosToken / 1e18) * tokenPrices.gainsNetworkTokenPrice;
	const minPnlDai = (posDai) * (-1);
	const openPrice = trade.openPrice;
	const leverage = parseInt(trade.leverage);

	let pnlPercentage = trade.buy.toString() === "true" ?
		(price * 1e10 - openPrice) / openPrice * leverage : (openPrice - price * 1e10) / openPrice * leverage;

	const maxGainP = 900;
	pnlPercentage = pnlPercentage < -100 ? -100 : pnlPercentage;
	pnlPercentage = pnlPercentage > maxGainP ? maxGainP : pnlPercentage;

	let pnlDai = posDai * pnlPercentage;
	if (useClosingFee) pnlDai -= this.closingFee(posDai, pnlDai, trade.leverage, trade.pairIndex, false);

	pnlDai = pnlDai < minPnlDai ? minPnlDai : pnlDai;

	return [Math.round(pnlDai * 100) / 100, Math.round(pnlDai / posDai * 10000) / 100];
}

function openTradeStrigify(openTrade) {
	let string = "";
	if (isOpenTradeLimitTrade(openTrade) == "limit") {
		string = string + "-positionSize: $" + openTrade.positionSize / 1e18 + " minPrice: $" + openTrade.minPrice / 1e10 + " maxPrice: $" + openTrade.maxPrice / 1e10;
	} else {
		string = string + "-posDai: $" + (openTrade.initialPosToken / 1e18) * tokenPrices.gainsNetworkTokenPrice  +  " initialPosToken: " + openTrade.initialPosToken / 1e18 + " openPrice: $" + openTrade.openPrice / 1e10 ;
	}
	string = string + /*" trader: " + openTrade.trader + */" pairIndex: " + getIndexString(openTrade.pairIndex) + " index: " + openTrade.index +  
	" posistionType: " + (openTrade.buy.toString() === "true" ? "long" : "short") + " leverage: " + openTrade.leverage + " tp: $" + openTrade.tp / 1e10 + " sl: $" + openTrade.sl / 1e10;
	return string;
}

let balances = [];
async function refreshBalances() {
	balances = [];
	const daiContract = new web3.eth.Contract(DAI_ABI, "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
	let botAddresses = getBotAddresses();
	for (let i = 0; i < botAddresses.length; i++) {
		let address = botAddresses[i];
		balances.push({
			address: address.toLowerCase(),
			type: "botAddress",
			diaBalance: Math.round(await daiContract.methods.balanceOf(address).call() / 1e18),
			maticBalance: Math.round(web3.utils.fromWei(await web3.eth.getBalance(address), "ether"))
		})
	}
	for (let i = 0; i < CLONE_JSON.length; i++) {
		let address = CLONE_JSON[i].addressToClone;
		balances.push({
			address: address.toLowerCase(),
			type: "cloneAddress",
			diaBalance: Math.round(await daiContract.methods.balanceOf(address).call() / 1e18),
			maticBalance: Math.round(web3.utils.fromWei(await web3.eth.getBalance(address), "ether"))
		})
	}
}

function getAddressBalances(address) {
	for (let i = 0; i < balances.length; i++) {
		if (balances[i].address == address.toLowerCase()) {
			return balances[i];
		}
	}
	return null;
}

// CREATE SERVER (USEFUL FOR CLOUD PLATFORMS)
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listening on port ${port}`));


app.get('/', async (req, res) => {
	await refreshBalances();
	let printString = "";
	for (let j = 0; j < CLONE_JSON.length; j++) {
		balanceClone = getAddressBalances(CLONE_JSON[j].addressToClone);
		printString = printString + "<b>Clone Address------- " + CLONE_JSON[j].addressToClone + " -----Matic Balance: " + balanceClone.maticBalance + " ----- Dai Balance: " + balanceClone.diaBalance + " --------------</b><br/>\n";
		let cloneOpentrades = getAddressOpenTrades(CLONE_JSON[j].addressToClone);
		for (let z = 0; z < cloneOpentrades.length; z++) {
			printString = addOpenTradeToString(cloneOpentrades[z], printString);
		}
		printString = printString + "<br/>";
		for (let i = 0; i < CLONE_JSON[j].botsPublicKeys.length; i++) {
			balanceBot = getAddressBalances(CLONE_JSON[j].botsPublicKeys[i]);
			printString = printString + "-<b>Bot Address-------- " + CLONE_JSON[j].botsPublicKeys[i] + " -----Matic Balance: " + balanceBot.maticBalance + " ----- Dai Balance: " + balanceBot.diaBalance + " ------maxCollateral: " + parseInt(CLONE_JSON[j].maxCollateral).toString() + "--------</b><br/>\n";
			let botOpentrades = getAddressOpenTrades(CLONE_JSON[j].botsPublicKeys[i]);
			for (let y = 0; y < botOpentrades.length; y++) {
				printString = addOpenTradeToString(botOpentrades[y], printString) + "<br/>";
			}
			printString = printString + "<br/>";
		}
	}
	res.send(printString);
})

app.get('/closeAllTrades', async (req, res) => {
	discordLog("Force close all trades");
	const botOpenTrades = getBotOpenTrades();
	let printString = "";
	for (let i = 0; i < botOpenTrades.length; i++) {
		let botOpenTrade = botOpenTrades[i];
		if (isOpenTradeLimitTrade(botOpenTrade) == "limit") {
			cancelOpenLimitOrderByOpenTrade(botOpenTrade.trader, botOpenTrade, "Force");
		} else {
			closeTradeMarketByOpenTrade(botOpenTrade.trader, botOpenTrade, "Force");
		}
	}
	res.send("All Trades Closing");
})

app.get('/tradeData', async (req, res) => {
	res.send(JSON.stringify(tradeData, null, '<br/>'));
})

app.get('/closeTrade/:address/:pairIndex/:index/:type', async (req, res) => {
	const address = req.params.address.toLowerCase();
	const pairIndex = req.params.pairIndex;
	const index = req.params.index;
	const type = req.params.type;

	const botOpenTrades = getBotOpenTrades();
	for (let i = 0; i < botOpenTrades.length; i++) {
		let botOpenTrade = botOpenTrades[i];
		if (botOpenTrade.trader.toLowerCase() == address.toLowerCase() && botOpenTrade.index == index && botOpenTrade.pairIndex == pairIndex) {
			if (type == "limit") {
				cancelOpenLimitOrderByOpenTrade(botOpenTrade.trader, botOpenTrade, "Force");
			} else if (type == "market") {
				closeTradeMarketByOpenTrade(botOpenTrade.trader, botOpenTrade, "Force");
			}
			res.send("Closing: " + openTradeStrigify(botOpenTrade));
			return;
		}
	}
	res.send("Failed to close trade.");
})

app.get('/transferDai/:amount/:from/:to', async (req, res) => {
	const to = req.params.to.toLowerCase();
	const from = req.params.from.toLowerCase();
	const amount = parseInt(req.params.amount);

	res.send(await transferDai(to, from, amount));
})


async function transferDai(to, from, amount) {
	const daiContract = new web3.eth.Contract(DAI_ABI, "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063");
	const publicKeysBot = getBotAddresses();

	let found = false;
	for (let i = 0; i < publicKeysBot.length; i++) {
		if (publicKeysBot[i].toLowerCase() == to.toLowerCase()) {
			found = true;
			break;
		}
	}
	if(!found) {
		return "Unable to send dai to addresses outside app";
	}
	for (let i = 0; i < publicKeysBot.length; i++) {
		if (publicKeysBot[i].toLowerCase() == from.toLowerCase()) {

			const publicKey = publicKeysBot[i],
				privateKey = getBotPrivateKeyFromPublicKey(publicKey);

			const logString = "Bot: " + publicKey + " transfering " + amount + " Dai to " + to;

			console.log(logString);
			discordLog(logString);
		
			const daiToTransfer = web3.utils.toBN(parseInt(amount * 1e18));

			const nonce = getNonce(publicKey);
			incrementNonce(publicKey);
			let txn = {
				nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
				from: publicKey,
				maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee * 1e9),
				maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee) * 1e9),
				gas: web3.utils.toHex("3000000"),
				to: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
				value: "0x0",
				data: daiContract.methods.transfer(to, daiToTransfer).encodeABI()
			};
			web3.eth.accounts.signTransaction(txn, privateKey).then(signed => {
				web3.eth.sendSignedTransaction(signed.rawTransaction)
					.on('receipt', (receipt) => {
						console.log("Trigger transaction success: " + logString);
					}).on('error', (e) => {
						console.log("Failed to trigger transaction: " + logString);
						console.log("<1<--" + e + "-->>");
					});
			}).catch(e => {
				console.log("Failed to trigger transaction: " + logString);
				console.log("<2<--" + e + "-->>");
			});
			return logString;
		}
	}
	return "Failed to send Dai.";
}

async function closeTradeMarketByOpenTrade(publicKey, openTrade, type) {
	const logString = type + " Closing market trade on bot " + publicKey;
	console.log(logString);
	discordLog(logString);

	const privateKey = getBotPrivateKeyFromPublicKey(publicKey);

	const nonce = getNonce(publicKey);
	incrementNonce(publicKey);
	let txn = {
		nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
		from: publicKey,
		to: tradingAddress,
		data: tradingContract.methods.closeTradeMarket(openTrade.pairIndex, openTrade.index).encodeABI(),
		maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee*1.5 * 1e9),
		maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee*1.5) * 1e9),
		gas: web3.utils.toHex("3000000")
	};
	sendTxn(txn, publicKey, privateKey, logString, publicKey);
}

async function cancelOpenLimitOrderByOpenTrade(publicKey, openTrade, type) {
	const logString = type + " Closing limit order on bot " + publicKey;
	console.log(logString);
	discordLog(logString);

	const privateKey = getBotPrivateKeyFromPublicKey(publicKey);

	const nonce = getNonce(publicKey);
	incrementNonce(publicKey);
	let txn = {
		nonce: web3.utils.toHex(JSON.parse(JSON.stringify(nonce))),
		from: publicKey,
		to: tradingAddress,
		data: tradingContract.methods.cancelOpenLimitOrder(openTrade.pairIndex, openTrade.index).encodeABI(),
		maxPriorityFeePerGas: web3.utils.toHex(gasData.fast.maxPriorityFee*1.5 * 1e9),
		maxFeePerGas: web3.utils.toHex(((2 * gasData.estimatedBaseFee) + gasData.fast.maxPriorityFee*1.5) * 1e9),
		gas: web3.utils.toHex("3000000")
	};
	sendTxn(txn, publicKey, privateKey, logString, publicKey);
}

let prices = [];
function pricesWss() {
	let socket = new WebSocket(process.env.PRICES_URL);
	socket.onclose = () => { setTimeout(() => { pricesWss() }, 20*1000); };
	socket.onerror = () => { socket.close(); };
	socket.onmessage = async (msg) => {
		const p = JSON.parse(msg.data);
		if(!p || p.closes === undefined || p.name != "charts") return;
		
		prices = p.closes;
	};
}
pricesWss();

async function restartWss() {
	if (process.env.BEARER_TOKEN) {
		console.log("Restarting gains-trade-wss");
		fetch("https://api.heroku.com/apps/gains-trade-wss/dynos", {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
				'Accept': 'application/vnd.heroku+json; version=3',
				'Authorization': 'Bearer ' + process.env.BEARER_TOKEN
			}
		});
	}
}


const intents = new Discord.Intents(32767);
const dsBot = new Discord.Client({ intents });
const DISCORD_LOGIN_TOKEN = process.env.DISCORD_LOGIN_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

if(DISCORD_LOGIN_TOKEN) {
	dsBot.login(DISCORD_LOGIN_TOKEN);
}

let discordChannel;
dsBot.on("ready", () => {
  console.log("Discord bot ready")
  if(DISCORD_CHANNEL_ID) {
  	  discordChannel = dsBot.channels.cache.find(channel => channel.id == DISCORD_CHANNEL_ID)
  } else {
  	console.log("No discord channel specified")
  }
});

function discordLog(logString) {
	if (discordChannel) {
		discordChannel.send(logString);
	}
}