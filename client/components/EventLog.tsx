import { ArrowUp, ArrowDown } from "react-feather";
import { useState, ReactElement } from "react";
import type { RealtimeEvent } from "../types";

interface EventProps {
  event: RealtimeEvent;
  timestamp: string;
}

function Event({ event, timestamp }: EventProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClient = event.event_id && !event.event_id.startsWith("event_");

  return (
    <div className="flex flex-col gap-2 p-3 md:p-2 rounded-md bg-gray-50">
      <div
        className="flex items-center gap-2 cursor-pointer min-h-[44px] md:min-h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isClient ? (
          <ArrowDown className="text-blue-400 flex-shrink-0" />
        ) : (
          <ArrowUp className="text-green-400 flex-shrink-0" />
        )}
        <div className="text-sm md:text-sm text-gray-500 break-words">
          <span className="font-medium">{isClient ? "client:" : "server:"}</span>
          <br className="md:hidden" />
          <span className="md:ml-1">{event.type}</span>
          <br className="md:hidden" />
          <span className="md:ml-1 text-xs md:text-sm">| {timestamp}</span>
        </div>
      </div>
      <div
        className={`text-gray-500 bg-gray-200 p-3 md:p-2 rounded-md overflow-x-auto ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(event, null, 2)}</pre>
      </div>
    </div>
  );
}

interface EventLogProps {
  events: RealtimeEvent[];
}

export default function EventLog({ events }: EventLogProps) {
  const eventsToDisplay: ReactElement[] = [];
  let deltaEvents: Record<string, RealtimeEvent> = {};

  events.forEach((event: RealtimeEvent) => {
    if (event.type.endsWith("delta")) {
      if (deltaEvents[event.type]) {
        // for now just log a single event per render pass
        return;
      } else {
        deltaEvents[event.type] = event;
      }
    }

    eventsToDisplay.push(
      <Event key={event.event_id || `event-${Math.random()}`} event={event} timestamp={event.timestamp || 'unknown'} />,
    );
  });

  return (
    <div className="flex flex-col gap-3 md:gap-2 overflow-x-auto px-1">
      {events.length === 0 ? (
        <div className="text-gray-500 text-center py-8 text-sm md:text-base">Awaiting events...</div>
      ) : (
        eventsToDisplay
      )}
    </div>
  );
}
