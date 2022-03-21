MONITOR YOUR BOT. USE MANUAL CLOSING IF AN ACTION IS MISSED.

# Gains Clone
Fork this repo to begin cloning.
Find the best traders at https://tradehistory.herokuapp.com/

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
*trades will not open if maxCollateral causes the trade to be below min position size

*if bot has open trades close trades before updaing maxCollateral

### WSS_URL
Create your own private wss with https://www.alchemy.com/ for free.

### Manually Closing Trades
Maually close trades by opening your app in a browser and hitting your app with the close trade string as an endpoint. eg. www.myapp.com/closetrade/a/b/c

### Interface
![image](https://user-images.githubusercontent.com/3924075/160455689-0da1c0c1-7583-491c-afce-22a23cd9f5bc.png)
