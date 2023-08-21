import {
  type Transport,
  type TransportConfig,
  createTransport,
} from './createTransport.js'

type EthereumProvider = { request(...args: any): Promise<any> }

export type CustomTransportConfig = {
  /** The key of the transport. */
  key?: TransportConfig['key']
  /** The name of the transport. */
  name?: TransportConfig['name']
  /** The max number of times to retry. */
  retryCount?: TransportConfig['retryCount']
  /** The base delay (in ms) between retries. */
  retryDelay?: TransportConfig['retryDelay']
  /** On request debug helper */
  onRequest?: TransportConfig['onRequest']
  /** On response */
  onResponse?: TransportConfig['onResponse']
}

export type CustomTransport = Transport<
  'custom',
  {},
  EthereumProvider['request']
>

/**
 * @description Creates a custom transport given an EIP-1193 compliant `request` attribute.
 */
export function custom<TProvider extends EthereumProvider>(
  provider: TProvider,
  config: CustomTransportConfig = {},
): CustomTransport {
  const {
    key = 'custom',
    name = 'Custom Provider',
    retryDelay,
    onRequest,
    onResponse,
  } = config
  return ({ retryCount: defaultRetryCount }) =>
    createTransport({
      key,
      name,
      request: provider.request.bind(provider),
      retryCount: config.retryCount ?? defaultRetryCount,
      retryDelay,
      onRequest,
      onResponse,
      type: 'custom',
    })
}
