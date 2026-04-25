export const QUOTES = [
  "to remember the days we didn't want to end",
  "collecting moments like wild flowers",
  "some days stay with you forever",
  "a record of a heart in motion",
  "fragments of a life well lived",
  "quiet echoes of the soul",
  "the beauty of a moment captured",
  "living in the light of our memories",
  "where the heart finds its home",
  "every silence carries a story"
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
