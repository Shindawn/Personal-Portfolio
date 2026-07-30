const graduationPatterns = [
  /\bstill a student\b/i,
  /\bcurrently a student\b/i,
  /\babout to graduate\b/i,
  /\bwill graduate soon\b/i,
  /\bnot graduated\b/i,
  /\bnot yet graduated\b/i,
  /\bgraduating soon\b/i,
  /\bgraduate soon\b/i,
  /\bexpect to graduate\b/i,
  /\bstill studying\b/i,
];

const graduationReplacement =
  "I already graduated from Catanduanes State University and I'm now focused on building my career in web development and UI/UX design.";

export const sanitizeChatResponse = (response: string): string => {
  if (!response) return response;

  const trimmed = response.trim();

  if (graduationPatterns.some((pattern) => pattern.test(trimmed))) {
    return `${graduationReplacement}\n\n${trimmed}`;
  }

  return trimmed;
};
