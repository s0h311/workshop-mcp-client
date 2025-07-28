import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function createToolTextResponse(payload: unknown): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload),
      },
    ],
  };
}
