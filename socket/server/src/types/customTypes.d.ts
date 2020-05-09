export type ICustomSocket = SocketIO.Socket & {
    userid: string,
    jwtData: IJwt,
    isScalableBroadcastSocket: boolean,
    inRoom: string
}


export type IJwt = {
    name: string,
    userid: string,
    type: string
}