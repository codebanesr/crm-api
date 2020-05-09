import { ICustomSocket } from "customTypes";

enum stream {
    audio = "audio",
    video = "video"
}

export interface IUSER {
    userid: string,
    broadcastId: string,
    isBroadcastInitiator: boolean,
    maxRelayLimitPerUser?: number,
    relayReceivers?: [],
    receivingFrom?: null,
    canRelay?: boolean,
    socket: ICustomSocket,
    typeOfStream?: stream,
    room: string
}