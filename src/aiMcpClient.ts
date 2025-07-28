import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { experimental_createMCPClient as createMCPClient } from "ai";

const transport = new StdioClientTransport({
  command: "/Users/soheil.nazari/.nvm/versions/node/v24.2.0/bin/node",
  args: ["/Users/soheil.nazari/projects/workshop-mcp-client/src/server.ts"],
});

const mcpClient = await createMCPClient({
  name: "menu-client",
  transport,
});

export const tools = await mcpClient.tools();
