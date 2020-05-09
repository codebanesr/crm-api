## Run Server

To run server locally, just install dependencies and run `gulp` task to create a build:

```bash
$ cd server
$ npm install -g gulp-cli
$ npm install
$ gulp build
$ npm start
```

The `socket.io` server will be running on port `6001`

When you run `npm start`, this folder leverages [nodemon](https://nodemon.io/) which will automatically reload the server after you make a change and save your Typescript file. Along with nodemon, there is also a `gulp watch` task that you can run to reload the files but it's not necessary and is provided merely as a teaching alternative. 


# Contribution
Contributions are greatly appreciated. You can contribute by adding `i18n` support with your language, the testing section or any other feature.

# Contributors
[You](https://github.com/shanurrahman) |

## License

MIT


## Client Side code for interaction
```
    import io from "socket.io-client";

    //Connection
    const socket = io( "http://localhost:6001?ch=random", {
    "transports": ["polling","websocket"]
    });

    // Listeners

    socket.on("connect", (data) => {
    console.log("socket connected");
    });

    socket.on("message", (data) => {
    console.log(data)
    });

    socket.on("undefined", (data) => {
    console.log(data)
    });

    socket.on("disconnect", () => {
    console.log("socket disconnected");
    });
```


Connect to server running on 
`http://localhost:6001?ch=random`

* Start listening for message and error events - (when connected to appropriate rooms, these will be fired)

* To Create a new Room, emit `createRoom` event with <roomName> in the payload, this will also put you in the room you just created

* To join a room, emit `joinRoom` with <roomName> in the payload

> Currently there is no limit on the no of people that can join a chat group, its a simple socket level api - 
> use sock.limitListeners(20)



### Creating key and certificates for localhost
```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")


```

* or use this 
```openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt```


```
https://socket.io/docs/emit-cheatsheet/

socket.emit('message', "this is a test"); //sending to sender-client only
socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
io.emit('message', "this is a test"); //sending to all clients, include sender
io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
socket.emit(); //send to all connected clients
socket.broadcast.emit(); //send to all connected clients except the one that sent the message
socket.on(); //event listener, can be called on client to execute on server
io.sockets.socket(); //for emiting to specific clients
io.sockets.emit(); //send to all connected clients (same as socket.emit)
io.sockets.on() ; //initial connection from a client.
```




req body
```{
  "user": {
    "room" : "private1"
  }
}```