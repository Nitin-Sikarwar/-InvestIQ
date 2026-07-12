const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export function streamResearch(company, onProgress, onResult, onError) {
  fetch(`${API_BASE}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company }),
  }).then(async (response) => {
    if (!response.ok) {
      const err = await response.json();
      onError(err.error || "Request failed");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      let currentEvent = null;
      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          if (currentEvent === "progress") onProgress(data.stage, data.message);
          else if (currentEvent === "result") onResult(data);
          else if (currentEvent === "error") onError(data.error);
          currentEvent = null;
        }
      }
    }
  }).catch(() => {
    onError("Cannot connect to server. Make sure the backend is running.");
  });
}
