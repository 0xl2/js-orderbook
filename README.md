# How to test

### boot two grape servers
```shell

grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

### Run server for each grape port
You should set PORT and GPORT as following
```js
PORT=3000 GPORT=30001 node server.js
PORT=4000 GPORT=40001 node server.js
```

### Run client test script
You should set GPORT as following
```js
GPORT=30001 node client.js
GPORT=40001 node client.js
```

# Problems I am having
Currently I am getting error - ```Error: ERR_GRAPE_LOOKUP_EMPTY```

I've run the grapes and also run the server without error.
Then when I run the test codes, I'm seeing above error and I cant resolve it.

Please check it on your side and let me know how can I fix this.

Regards
