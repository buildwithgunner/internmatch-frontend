/**
 * Strips emoji characters from a string.
 * Use this on name / bio / company_name inputs before submission
 * to give instant feedback instead of waiting for server validation.
 */
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu;

export const stripEmojis = (value) => {
  if (typeof value !== 'string') return value;
  return value.replace(EMOJI_REGEX, '');
};

export const hasEmojis = (value) => {
  if (typeof value !== 'string') return false;
  return EMOJI_REGEX.test(value);
};

/**
 * Creates an onChange handler that strips emojis from input values.
 * Usage: <input onChange={noEmojiHandler(setName)} />
 */
export const noEmojiHandler = (setter) => (e) => {
  const cleaned = stripEmojis(e.target.value);
  setter(cleaned);
};
