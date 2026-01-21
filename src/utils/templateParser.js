export function extractPlaceholders(text) {
  const regex = /{{(.*?)}}/g;
  const matches = [...text.matchAll(regex)];
  const fields = new Set();

  matches.forEach((match) => {
    fields.add(match[1].trim());
  });

  return Array.from(fields);
}
