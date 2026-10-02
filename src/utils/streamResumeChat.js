const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

/**
 * Opens an SSE connection to the streaming resume-generation endpoint.
 *
 * axios can't consume a streaming response body, so this uses fetch + a manual
 * reader. Server event types:
 *   start    — connection is live, model name
 *   reasoning— a chunk of the model's live reasoning trace
 *   result   — { data } the finished resume wrapper
 *   error    — { message, details }
 *   done     — stream closing normally
 *
 * Resolves with the `result` payload, or rejects on an `error` event.
 */
export async function streamResumeChat({
  userMessage,
  currentResume,
  token,
  onReasoning,
  signal,
}) {
  const response = await fetch(`${BASE_URL}/api/ai/generate-from-chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ userMessage, currentResume }),
    signal,
  });

  // Errors raised before the stream opens (401, 400, ...) come back as JSON.
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.message) message = body.message;
    } catch {
      /* body wasn't JSON — keep the status-based message */
    }
    throw new Error(message);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line. Chunks rarely align to frame
    // boundaries, so whatever is left over stays in the buffer for the next read.
    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      let event = "message";
      const dataLines = [];

      for (const line of frame.split("\n")) {
        if (line.startsWith(":")) continue; // heartbeat comment
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
      }
      if (!dataLines.length) continue;

      let payload;
      try {
        payload = JSON.parse(dataLines.join("\n"));
      } catch {
        continue; // half-written frame; the next read completes it
      }

      if (event === "reasoning") onReasoning?.(payload.delta);
      else if (event === "result") return payload.data;
      else if (event === "error") throw new Error(payload.details || payload.message);
    }
  }

  throw new Error("Connection closed before the resume was ready.");
}

export default streamResumeChat;