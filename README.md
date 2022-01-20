# Gains Clone
Fork this repo to begin cloning.
Find the best traders: https://tradehistory.herokuapp.com/

## CONFIG

### CLONE_JSON
```
[
   {
      "addressToClone":"addressIWantToClone1",
      "botsPublicKeys":[
         "myBotPublicKey1"
      ],
      "botsPrivateKeys":[
         "myBotPrivateKey1"
      ],
      "maxCollateral":"40"
   },
   {
      "addressToClone":"addressIWantToClone2",
      "botsPublicKeys":[
         "myBotPublicKey1", "myBotPublicKey2"
      ],
      "botsPrivateKeys":[
         "myBotPrivateKey1", "myBotPrivateKey2"
      ],
      "maxCollateral":"250"
   }
]
```
trades will not open of maxCollateral causes the trade to be below min posistion size

### WSS_URL
Create your own private wss with https://www.alchemy.com/ for free

### Manually Closing Trades
You can maually close trades by opening your app in a browser and hitting your app with the close trade string as an endpoint. eg www.myapp.com/closetradestring/a/b/c
