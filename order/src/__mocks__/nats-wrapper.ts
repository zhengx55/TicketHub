export const natsWrapper = {
  // mock nats-streaming implementation
  client: {
    publish: jest.fn().mockImplementation(() => {
      (sub: string, data: string, cb: Function) => {
        cb();
      };
    }),
  },
};
