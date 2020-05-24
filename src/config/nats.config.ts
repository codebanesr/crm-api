import { StanOptions } from 'node-nats-streaming';

interface INatsStream {
    clusterID: string,
    server: string,
    clientID: string
};

export const opts: StanOptions & { durableName: string, ackWait: number } = {
    ackTimeout: 4,
    durableName: "durable",
    ackWait: 5
};

export const natsStreamConfig: INatsStream = {
    clusterID: `${process.env.NATS_CLUSTER_ID}` || "nats-streaming",
    server: `${process.env.NATS_CONTAINER_NAME}:${process.env.NATS_PORT}` || "nats://gc_nats_streamer:4222",
    clientID: `${process.env.NATS_CLIENT_ID}` || "PRIVATE_CLIENT_1"
}
