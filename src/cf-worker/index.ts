import { makeDurableObject, makeWorker } from '@livestore/sync-cf/cf-worker'

export class WebSocketServer extends makeDurableObject({
  onPush: async (message) => {
    console.log('onPush', message.batch)
  },
  onPull: async (message) => {
    console.log('onPull', message)
  },
}) {}

export default makeWorker({
  validatePayload: (payload: any) => {
    //TODO: use origin to limit unwanted requests dont bother with auth token
    // if (payload?.authToken !== 'insecure-token-change-me') {
    //   throw new Error('Invalid auth token')
    // }
  },
  enableCORS: true,
})
