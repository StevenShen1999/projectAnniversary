// Puzzle configuration — answers stored as SHA-256 hashes

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const puzzles = [
  {
    id: 1,
    title: "Eye Candy",
    question:
      "What is her favourite colour and one of my favourite features of her?",
    type: "colour-select",
    colours: ["Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange"],
    answerHash:
      "16477688c0e00699c6cfa4497a3612d7e83c532062b64b250fed8908128ed548",
  },
  {
    id: 2,
    title: "What's in a Name?",
    question: "What is the nickname she always calls me with?",
    type: "text-input",
    answerHash:
      "6ddc282b3a30d9cb0cb39d0eb48dee4368bcefd30ba2d31734e725c967b90448",
  },
  {
    id: 3,
    title: "Bonding Moments",
    question: "On our weekends, what is our favourite past time?",
    type: "word-scramble",
    answerHash:
      "064859fd8c4f47c6d516076500738d71e895ce894fb4038c7f6641f2f8c1642b",
  },
  {
    id: 4,
    title: "Not From Russia With Love",
    question:
      "Many may confuse her as a Russian, but she is in fact from Belarus, a city (although she was originally from a village) called",
    type: "text-input",
    answerHashes: [
      "9c7c13e9807b0efd5fb8f8fdbb71e6fee0ba2cdad3c2b737d754649417e584f6",
      "99e191266afec3cf238c217be90b77c2e526e1fa946294da11af6d5ee0b36a1d",
      "0c1c2daa93b6a12379447717fdf9493dd0e2fc2b8dd6c40b31ff1605c8163f96",
      "b1d50d50778afa813a05a945fabfe3f5d321e15adc6584c1fe38217a715628cc",
    ],
  },
  {
    id: 5,
    title: "For Her Eyes (And Ears) Only",
    question:
      "She once told me she has only been to one band's live concert. What is that band?",
    type: "concert-ticket",
    answerHash:
      "1ce05c22f7920641660dd3abfa241090175492d710e7d53ba1b0ef22daeff172",
  },
  {
    id: 6,
    title: "Non-Negotiable",
    question: "What is her absolute must daily routine?",
    type: "emoji-select",
    options: [
      { emoji: "\u{1F3CB}\u{FE0F}\u{200D}\u{2640}\u{FE0F}", label: "Workout" },
      { emoji: "\u{1F4D6}", label: "Reading" },
      { emoji: "\u{1F9D8}\u{200D}\u{2640}\u{FE0F}", label: "Meditation" },
      { emoji: "\u{1F3A8}", label: "Painting" },
      { emoji: "\u{2615}", label: "Coffee" },
      { emoji: "\u{1F3B5}", label: "Music" },
    ],
    answerHash:
      "b10c94bd8ae38a2a37365b6d81c4ae1e121cccbcc233c8bdb4238eee7e85e657",
  },
  {
    id: 7,
    title: "Golden Ratio",
    question:
      "This is something that only she would know. Disguise is always a self portrait.",
    type: "three-part-input",
    answerHash:
      "d028060b19d659558317574b64ddf44341bdc93041e6597943ca68cce576770f",
  },
  {
    id: 8,
    title: "The Full Package",
    question: "What are her virtues which I deeply admire?",
    type: "multi-select",
    options: ["Empathy", "Intelligence", "Mental Fortitude", "Loving"],
    answerHash:
      "2ceb3a60b0b4cdabf815f6720d5860f71748ad63e4eb47cec1b3ab18a933bdd8",
  },
];

export async function checkAnswer(puzzleIndex, userAnswer) {
  const puzzle = puzzles[puzzleIndex];
  if (!puzzle) return false;

  // Multi-select: hash sorted joined labels
  if (puzzle.type === "multi-select") {
    if (!Array.isArray(userAnswer)) return false;
    const sorted = [...userAnswer].map((s) => s.toLowerCase().trim()).sort();
    const hashed = await sha256(sorted.join("|"));
    return hashed === puzzle.answerHash;
  }

  // Emoji select: hash the selected label
  if (puzzle.type === "emoji-select") {
    if (!userAnswer) return false;
    const hashed = await sha256(userAnswer.toLowerCase().trim());
    return hashed === puzzle.answerHash;
  }

  // Text with multiple accepted hashes
  if (puzzle.answerHashes) {
    const hashed = await sha256(userAnswer.toLowerCase().trim());
    return puzzle.answerHashes.includes(hashed);
  }

  // Default: single hash comparison
  const hashed = await sha256(userAnswer.toLowerCase().trim());
  return hashed === puzzle.answerHash;
}
