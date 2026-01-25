export function formatHtmlToPlainText(html) {
  if (!html) return "";

  let text = html;

  // Paragraphs & line breaks
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Lists → plain lines
  text = text.replace(/<ol[^>]*>/gi, "\n");
  text = text.replace(/<\/ol>/gi, "\n");
  text = text.replace(/<ul[^>]*>/gi, "\n");
  text = text.replace(/<\/ul>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "");
  text = text.replace(/<\/li>/gi, "\n");

  // Remove formatting tags completely
  text = text.replace(/<\/?(strong|b|em|i|u|span)>/gi, "");

  // Links → keep text + URL
  text = text.replace(
    /<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi,
    "$2 ($1)"
  );

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");

  // Normalize spacing
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  return text;
}
