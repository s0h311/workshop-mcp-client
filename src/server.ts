import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fakeMenuData } from "./fakeData.ts";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createToolTextResponse } from "./utils.ts";

const server = new McpServer({
  name: "menu-server",
  version: "0.0.0",
});

server.registerTool(
  "list-all-dishes",
  {
    description: "List all dishes on the menu",
    inputSchema: {},
  },
  async () => {
    console.log("TOOL CALL");

    // Fake API call
    const repsonse = await new Promise((resolve) => {
      setTimeout(() => resolve(fakeMenuData), 1000);
    });

    return createToolTextResponse(repsonse);
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
