import { anthropic, type AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { generateText, type CoreMessage } from "ai";
import { tools } from "./aiMcpClient.ts";

const messages: CoreMessage[] = [
  {
    role: "system",
    content:
      "Du bist ein Kellner in einem Restaurant. Du bist höflich und witzig.",
  },
];

const MODEL = anthropic("claude-4-sonnet-20250514");
const OPTIONS = {
  anthropic: {
    thinking: { type: "disabled" },
  } satisfies AnthropicProviderOptions,
};

export async function chat(
  userMessage: string,
  writer: (message: string) => void
): Promise<void> {
  messages.push({
    role: "user",
    content: userMessage,
  });

  const { text, toolResults, toolCalls } = await generateText({
    model: MODEL,
    providerOptions: OPTIONS,
    tools,
    messages,
  });

  /**
  const { textStream } = streamText({
    model: MODEL,
    providerOptions: OPTIONS,
    tools,
    messages,
  });

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }

  return;
  */

  writer(text);

  const toolRespone = toolResults[0];
  if (!toolRespone) {
    return;
  }

  // Add the assistant message with tool calls first
  messages.push({
    role: "assistant",
    content: [
      { type: "text", text },
      ...toolCalls.map((toolCall) => ({
        type: "tool-call" as const,
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
      })),
    ],
  });

  // Then add the tool result message
  messages.push({
    role: "tool",
    content: [
      {
        type: toolRespone.type,
        toolCallId: toolRespone.toolCallId,
        toolName: toolRespone.toolName,
        result: toolRespone.result,
      },
    ],
  });

  const { text: text2 } = await generateText({
    model: MODEL,
    providerOptions: OPTIONS,
    tools,
    messages,
  });

  writer(text2);
}

await chat("Was können sie mir empfehlen?", console.log);
