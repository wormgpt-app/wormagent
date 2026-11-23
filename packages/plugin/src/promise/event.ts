import type { WormAgentEvent } from "@wormagent/client"
import type { SelectedEvent, SubscribeOptions } from "@wormagent/client/promise/api"

type EventType = Exclude<WormAgentEvent["type"], "server.connected">

export interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(
    options?: SubscribeOptions<Type>,
  ) => AsyncIterable<SelectedEvent<WormAgentEvent, Type>>
}
