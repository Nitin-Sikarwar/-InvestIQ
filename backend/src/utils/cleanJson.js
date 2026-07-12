export function cleanJson(text) {
  return text.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
}
