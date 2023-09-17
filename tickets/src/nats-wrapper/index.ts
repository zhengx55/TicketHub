import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
  constructor() {}
  get client() {
    if (!this._client) {
      throw new Error("cannot access NATS client befrore connectiong");
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this._client!.on("connect", () => {
        resolve();
      });
      this._client!.on("ennro", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
