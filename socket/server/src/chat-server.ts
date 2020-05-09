import express from "express";
import cors from "cors";
import * as https from "https";
import { Message } from "./model";
import { key, cert } from "./config/getCertificates";
import { authorize } from "socketio-jwt"
import { IUSER } from "IUser.interface";
import { IPayload } from "Ipayload.interface";
import { ICustomSocket } from "customTypes";
import {EVENTS} from "./types/events"


export class ChatServer {
    public static readonly PORT: number = 6001;
    private app: express.Application;
    private server: https.Server;
    private io: SocketIO.Server;
    private port: string | number;

    /** This wont scale, should be moved to redis */
    private static allRooms: string[] = []
    private static users: { [id: string]: IUSER; } = {};
    private static https_options = {
        // key: fs.readFileSync(path.join(__dirname, 'config', 'localhost.key')).toString(),
        // cert: fs.readFileSync(path.join(__dirname, 'config', 'localhost.crt')).toString(),
        key: key(),
        cert: cert()
    }

    /** in case you are initializing it from a different application, pass the base express instance in the constructor and
     * pass the same to createApp(), the rest of it will be the same. @Todo move PORT into the shared repository we use for hosting
     * all other submodules, pass some options to the constructor to create chat rooms and namespaces for one to one and
     * group chats, currently it admits everyone in the same room
     */
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    /** creates a new express app instance */
    private createApp(): void {
        this.app = express();
        this.app.use(cors());
    }

    private createServer(): void {
        this.server = https.createServer(ChatServer.https_options, this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }


    private sockets(): void {
        this.io = require("socket.io").listen(this.server, { origins: '*:*' });


        this.io.use(authorize({
            secret: 'supersecretkey',
            decodedPropertyName: "jwtData",
            timeout: 3,
            handshake: true
        }));
    }

    /** Alternatively to provide pingInterval and timeout use the one below;; call in the constructor */
    private timedSockets() {
        this.io = require('socket.io')(this.server, {
            serveClient: false,
            // below are engine.IO options
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false
        });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });

        this.io.on("connect", (socket: ICustomSocket) => {
            let _this = this;
            console.log("Connected client on port %s.", this.port);
            console.log(socket.jwtData);


            /** Not using query params right now, this was just for demonstration */
            // const u = url.parse(socket.handshake.url, true);
            // let ch: string = String(u.query.ch);

            socket.on(EVENTS.joinRoom, (payload: IPayload) => {
                console.log({ payload })
                _this.onJoinReq(socket, payload);
            });


            socket.on(EVENTS.createRoom, (payload: IPayload) => {
                console.log({ payload })
                _this.onCreateRequest(socket, payload);
            })

            /** Dont call the function, socket.on takes a callback */
            socket.on(EVENTS.disconnect, (msg) => this.onDisconnect(socket, msg));
        });
    }

    /** or alternatively you can start the chat application first and then decorate this instance else where, this function
     * returns the decorated express instance 
     */
    public getApp(): express.Application {
        return this.app;
    }



    /** Check limits, authrize users based on permissions and room availability; all clients must be listening to
     *  message and error events, or messages may get lost
     */
    private onJoinReq(socket: ICustomSocket, payload: IPayload) {
        // check if such a room already exists;
        if (ChatServer.allRooms.includes(payload.user.room)) {
            this.registerUser(payload.user, socket);
            socket.join(payload.user.room);
            socket.inRoom = payload.user.room;

            /** Creating a scope for this socket, any message coming to this socket from one of the joined users gets
             * broadcasted to everyone
             */
            let _this = this;
            socket.on(EVENTS.message, (m: Message) => {
                _this.onMessage(socket, m);
            });

            socket.emit(EVENTS.message, "you have joined the room"); // message to the guy who joined
        }
        else {
            /** If the user tries to create an invalid room, drop that socket connection */
            socket.emit(EVENTS.message, "Error! The room with given name doesnot exist, Try creating room first");
            // socket.disconnect();
        }
    }


    private registerUser(user: IUSER, socket: ICustomSocket) {
        if (!ChatServer.users[user.userid]) {
            socket.userid = user.userid;

            ChatServer.users[user.userid] = user;

            this.notifyBroadcasterAboutNumberOfViewers(socket);
        }
    }

    /** where or not to create a new room for the user */
    private onCreateRequest(socket: ICustomSocket, payload: IPayload) {
        if (ChatServer.allRooms.includes(payload.user.room)) {
            socket.emit(EVENTS.message, "Error! room already exists, do you want to join the room?");
            // socket.disconnect();
        }else{
            ChatServer.allRooms.push(payload.user.room);
            socket.emit(EVENTS.message, `Assigned a room with ${payload.user.room}`);
    
            console.log(`Assigned a room with ${payload.user.room}`)
    
            payload.user.isBroadcastInitiator = true;
            payload.user.userid = socket.jwtData.userid;
            /** admit the guy to the room after creating it */
            this.onJoinReq(socket, payload);
        }
    }


    /** socket.id can be used for tracing, but this will change everytime a new socket connection is established, we might 
     * need something better than this
     */
    private onMessage(socket: ICustomSocket, message: Message) {
        console.log("[server](message): %s, socketId: %s", JSON.stringify(message), socket.id);

        /** to allows everyone on that channel to receive the message, this is useful in a case when a user joins a 
         * channel and we want to notify everyone in the channel except him that he has joined the channel... [everyone but one]
         */
        socket.broadcast.to(socket.inRoom).emit('message', message);
    }


    private onDisconnect(socket: ICustomSocket, m: any) {
        let partedUserId = socket.jwtData.userid
        var user = ChatServer.users[partedUserId];
        console.log("Disconnect called");

        if (!user) return;

        this.notifyBroadcasterAboutNumberOfViewers(socket);

        if (user.isBroadcastInitiator === true) {
            // stop entire broadcast
            this.closeRoom(user.room);
            delete ChatServer.users[partedUserId];
            return;
        }
    }

    private notifyBroadcasterAboutNumberOfViewers(socket: ICustomSocket) {
        try {
            var clients = this.io.nsps['/'].adapter.rooms[socket.inRoom];
            if (!clients) return this.broadcastRoomCount(socket, 0);
            return this.broadcastRoomCount(socket, clients.length);
        }
        catch (e) { }
    }


    private broadcastRoomCount(socket:ICustomSocket, count: number) {
        socket.broadcast.to(socket.inRoom).emit(EVENTS.updateInvitees, count);
    }

    /** closing a room if the broadcaster leaves, 
     * @param {string} room 
     * */
    private closeRoom(room: string) {
        this.io.of('/').in(room).clients((error: Error, socketIds: [string]) => {
            if (error) throw error;
            socketIds.forEach(socketId => this.io.sockets.sockets[socketId].leave(room));
        });

        ChatServer.allRooms = ChatServer.allRooms.filter((r)=>r!==room)
    }
}
