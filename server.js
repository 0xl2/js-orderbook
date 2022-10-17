'use strict'

const { PeerRPCServer }  = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const isNull = require('is-null');
const LimitOrder = require('limit-order-book').LimitOrder
const LimitOrderBook = require('limit-order-book').LimitOrderBook

const port = process.env.PORT || 0;
const gPort = process.env.GPORT || 0;

if(port && port > 0 && gPort && gPort > 0) {
    let book = new LimitOrderBook()
    let orderCnt = 0;

    const link = new Link({
        grape: `http://127.0.0.1:${gPort}` // 30001
    })
    link.start()

    console.log(link.lookup())
    
    const peer = new PeerRPCServer(link, {
        timeout: 300000
    })
    peer.init()
    
    const service = peer.transport('server')
    service.listen(parseInt(port))
    
    setInterval(function () {
        link.announce('rpc_test', service.port, {})
    }, 1000)
    
    service.on('request', (rid, key, payload, handler) => {
        console.log(payload)

        // check payload has the values
        if(isNull(payload.price) || isNull(payload.type) || isNull(payload.amount)) {
            handler.reply(null, { msg: 'Invalid order' })
        } else {
            if(payload.type == "bid") { // check order type is "bid"
                const newOrder = new LimitOrder(`order${orderCnt}`, "bid", parseFloat(payload.price), parseInt(payload.amount))
                book.add(newOrder);

                orderCnt++;
                handler.reply(null, { msg: book.bidLimits.map })
            } else if(payload.type == "ask") { // check order type is "ask"
                const newOrder = new LimitOrder(`order${orderCnt}`, "ask", parseFloat(payload.price), parseInt(payload.amount))
                book.add(newOrder);

                orderCnt++;
                handler.reply(null, { msg: book.askLimits.map })
            } else { // returns error
                handler.reply(null, { msg: 'Invalid order type' })
            }
        }
    })
} else {
    console.error("Invalid port")
}
