import { StanOptions, Message } from "node-nats-streaming";
import { StreamingService } from "./streaming.service";


/** steps::
 * docker-compose up -d --build --no-deps nats-streaming-1
 * ts-node natsStreaming.ts
 */
(async function connect() {
    const clientID = "client2";
    const clusterID = "nats-streaming";
    const server = "nats://localhost:14222";

    const opts: StanOptions & { durableName: string, ackWait: number } = {
        ackTimeout: 4,
        durableName: "durableName",
        ackWait: 5
    };
    const stream = new StreamingService(clusterID, clientID, server as any, opts);
    await stream.connect();

    console.log("connected")

    console.log("calling subscription")
    const subscription = await stream.getSubscription("mysubject");

    console.log("got subscription")

    // checking durable subscription
    subscription.on('message', async(message: Message) => {
        console.log(message.getData());
    });

    subscription.on('error', (err: Error) => {
        console.log('subscription failed', err);
    });
    subscription.on('timeout', (err: Error) => {
        console.log('subscription timeout', err)
    });
    subscription.on('unsubscribed', () => {
        console.log('subscription unsubscribed')
    });

    stream.publish({subject: "mysubject", data: "some data"});
})();

