export function formatMarkdownText(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("*")) {
        return line.replace(/^\s*\*\s+/, "• ");
      }
      return line;
    })
    .join("\n");
}
