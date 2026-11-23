import type { WormAgentEvent } from "@wormagent/client"
import { useClient } from "./client"

type EventMetadata = {
  directory: string | undefined
}
type WormAgentEventMap = { [Type in WormAgentEvent["type"]]: Extract<WormAgentEvent, { type: Type }> }

export function useEvent() {
  const client = useClient()

  function subscribe(handler: (event: WormAgentEvent, metadata: EventMetadata) => void) {
    return client.event.listen(({ details }) => {
      if (details.type === "server.connected") return
      handler(details, { directory: details.location?.directory })
    })
  }

  function on<T extends WormAgentEvent["type"]>(
    type: T,
    handler: (event: WormAgentEventMap[T], metadata: EventMetadata) => void,
  ) {
    return client.event.on(type, (event) => {
      handler(event, { directory: event.location?.directory })
    })
  }

  return {
    subscribe,
    on,
  }
}
