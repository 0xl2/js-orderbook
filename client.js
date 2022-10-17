'use strict'

const { PeerRPCClient }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const gPort = process.env.GPORT || 0;

const link = new Link({
    grape: `http://127.0.0.1:${gPort}`
})
link.start()
    
const peer = new PeerRPCClient(link, {})
peer.init()

function wait(sTime) {
    return new Promise((res) => {
        setTimeout(() => {
            res()
        }, sTime)
    });
}

async function test_func() {
    if(gPort && gPort > 0) {
        let reqArr = [];
        for(let i = 0; i < 10; i++) {
            const price = (Math.random() + 9).toFixed(1);
            const type = Math.random() > 0.5 ? "bid" : "ask";
            const amount = Math.ceil(Math.random() * 99) + 1;

            reqArr.push({
                price,
                type,
                amount
            });
        }

        for(const reqKey in reqArr) {
            const reqItem = reqArr[reqKey];
            console.log(reqItem);

            peer.request('rpc_test', { msg: reqItem }, { timeout: 10000 }, (err, data) => {
                if (err) {
                    console.error(err)
                    process.exit(-1)
                }

                console.log(data) // get orderbook info
            });

            await wait(15000);
        }
    } else {
        console.error("Invalid port");
    }
}

test_func()
.then(() => process.exit())
.catch((err) => {
    console.error(err);
    process.exit(1);
})
