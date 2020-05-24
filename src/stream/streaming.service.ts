/**
 * @author [Shanur]
 * @email [shanur.cse.nitap@gmail.com]
 * @create date 2020-05-14 23:17:35
 * @modify date 2020-05-14 23:17:35
 * @desc [This provides a streaming connection to nats server]
 */

import { connect, StanOptions, Stan, SubscriptionOptions, Subscription, StartPosition, Message } from "node-nats-streaming";
import Logger from "../util/logger";

export class StreamingService {
    public isConnected: Boolean = false;
    private clusterID: string;
    private clientID: string;
    private options: SubscriptionOptions;
    private sc: Stan;
    private server: string;

    public constructor(clusterID: string, clientID: string, server: string, opts: StanOptions) {
        this.clusterID = clusterID;
        this.clientID = clientID;
        this.options = opts as any;
        this.server = "nats://0.0.0.0:14222";

        this.isConnected = true;
    }

    public connect(): Promise<Stan> {
        if(this.sc) {
            return Promise.resolve(this.sc);
        }
        Logger.warn(this.clientID, this.clusterID, this.server);
        this.sc = connect(this.clusterID, this.clientID, this.server as any);
        this.sc.on('error', (reason: Error) => {
            console.log("An error occured", reason);
        });

        this.sc.on('close', () => {
            this.isConnected = false;
            console.log("Nats connection closed, exiting now")
            process.exit()
        });

        return new Promise((resolve, reject) => {
            this.sc.on('connect', () => {
                this.sc.on('connection_lost', (error: Error) => {
                    this.isConnected = false;
                    console.log('disconnected from stan', error)
                })
                this.isConnected = true;
                console.log('Connected to Nats streaming server!')
                resolve(this.sc);
            })
        })
    }


    public async publish(payload: any) {
        await this.connect();
        this.sc.publish(payload.subject, JSON.stringify(payload.data));
    }


    /** resolves a durable subscription when subscription is ready to receive message events, this is for more sophistacted usage
     * for e.g. when we want to have a replay subject change the start position, or when we want to look for events other than
     * message
     */
    public async getSubscription(subject: string, startPosition: StartPosition = StartPosition.SEQUENCE_START, durableName?: string): Promise<Subscription> {
        await this.connect();
        const so = this.sc.subscriptionOptions()
        so.setMaxInFlight(100);
        so.setAckWait(1000);
        // so.setStartAt(startPosition);
        so.setStartAtTimeDelta(30 * 1000)
        so.setManualAckMode(true);
        if(durableName) {
            so.setDurableName(durableName);
        }

        const subscription = this.sc.subscribe(subject, so);
        return new Promise((resolve, reject) => {
            subscription.on('ready', () => {
                /** resolve subscription when ready to receive messages */
                resolve(subscription)
            });
        })
    }


    public async useCallableSubscription(subject: string, startPosition: StartPosition = StartPosition.NEW_ONLY, callback: CallableFunction, durableName?: string): Promise<void> {
        await this.connect();
        const so = this.sc.subscriptionOptions()
        so.setMaxInFlight(100);
        so.setAckWait(1000);
        so.setStartAt(startPosition);
        so.setManualAckMode(true);
        if(durableName) {
            so.setDurableName(durableName);
        }

        const subscription = this.sc.subscribe(subject, so);
        subscription.on('ready', ()=>{
            subscription.on('message', (message: Message)=>{
                callback(message, subscription);
            });
        })
    }

    /**
    * subscribe, listens for messages on a channel
    * executes the "messageReceivedReference" method on receiving a message
    * @param channel : The channel/subject name
    * Expects json payload to be sent in message.data
    */
    public async subscribe(channel: string,
        messageReceived: (...args: any[]) => Promise<void>,
        messageValidation?: ((...args: any[]) => Promise<boolean>)) {
        await this.connect();
        const subscription = await this.getSubscription(channel);

        subscription.on('message', async (msg: Message) => {
            msg.ack();
            let message = JSON.parse(msg.getData() as any);
            if (!messageValidation || (messageValidation && await messageValidation(message.data))) {
                /* messageReceived gets the parsed message, passing subscription so that it can be subscribed when required */
                try {
                    await messageReceived(message.data, subscription);
                } catch (e) {
                    console.log(e);
                }
            }
        });

        subscription.on('error', (error: Error) => {
            console.error(`Failed to subscribe to channel ${channel}`, error);
            return;
        })
    }

    public close() {
        this.isConnected = false;
        this.sc.close();
    }
}