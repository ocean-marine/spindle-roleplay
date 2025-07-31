import { useEffect, useState } from "react";

const functionDescription = `
Call this function when a user asks for a color palette.
`;

function createSessionUpdate(voice) {
  return {
    type: "session.update",
    session: {
      voice: voice,
      tools: [
        {
          type: "function",
          name: "display_color_palette",
          description: functionDescription,
          parameters: {
            type: "object",
            strict: true,
            properties: {
              theme: {
                type: "string",
                description: "Description of the theme for the color scheme.",
              },
              colors: {
                type: "array",
                description: "Array of five hex color codes based on the theme.",
                items: {
                  type: "string",
                  description: "Hex color code",
                },
              },
            },
            required: ["theme", "colors"],
          },
        },
      ],
      tool_choice: "auto",
    },
  };
}

function FunctionCallOutput({ functionCallOutput }) {
  const { theme, colors } = JSON.parse(functionCallOutput.arguments);

  const colorBoxes = colors.map((color) => (
    <div
      key={color}
      className="w-full h-16 rounded-md flex items-center justify-center border border-gray-200"
      style={{ backgroundColor: color }}
    >
      <p className="text-sm font-bold text-black bg-slate-100 rounded-md p-2 border border-black">
        {color}
      </p>
    </div>
  ));

  return (
    <div className="flex flex-col gap-2">
      <p>Theme: {theme}</p>
      {colorBoxes}
      <pre className="text-xs bg-gray-100 rounded-md p-2 overflow-x-auto">
        {JSON.stringify(functionCallOutput, null, 2)}
      </pre>
    </div>
  );
}

const VOICE_OPTIONS = [
  "alloy",
  "ash", 
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse"
];

export default function ToolPanel({
  isSessionActive,
  sendClientEvent,
  events,
  selectedVoice,
  setSelectedVoice,
}) {
  const [functionAdded, setFunctionAdded] = useState(false);
  const [functionCallOutput, setFunctionCallOutput] = useState(null);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const firstEvent = events[events.length - 1];
    if (!functionAdded && firstEvent.type === "session.created") {
      sendClientEvent(createSessionUpdate(selectedVoice));
      setFunctionAdded(true);
    }

    const mostRecentEvent = events[0];
    if (
      mostRecentEvent.type === "response.done" &&
      mostRecentEvent.response.output
    ) {
      mostRecentEvent.response.output.forEach((output) => {
        if (
          output.type === "function_call" &&
          output.name === "display_color_palette"
        ) {
          setFunctionCallOutput(output);
          setTimeout(() => {
            sendClientEvent({
              type: "response.create",
              response: {
                instructions: `
                ask for feedback about the color palette - don't repeat 
                the colors, just ask if they like the colors.
              `,
              },
            });
          }, 500);
        }
      });
    }
  }, [events, selectedVoice]);

  useEffect(() => {
    if (!isSessionActive) {
      setFunctionAdded(false);
      setFunctionCallOutput(null);
    }
  }, [isSessionActive]);

  return (
    <section className="h-full w-full flex flex-col gap-4">
      <div className="bg-gray-50 rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">Voice Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            disabled={isSessionActive}
            className="w-full p-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {VOICE_OPTIONS.map((voice) => (
              <option key={voice} value={voice}>
                {voice}
              </option>
            ))}
          </select>
          {isSessionActive && (
            <p className="text-xs text-gray-500 mt-1">
              Voice cannot be changed during an active session
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 bg-gray-50 rounded-md p-4">
        <h2 className="text-lg font-bold">Color Palette Tool</h2>
        {isSessionActive ? (
          functionCallOutput ? (
            <FunctionCallOutput functionCallOutput={functionCallOutput} />
          ) : (
            <p>Ask for advice on a color palette...</p>
          )
        ) : (
          <p>Start the session to use this tool...</p>
        )}
      </div>
    </section>
  );
}
