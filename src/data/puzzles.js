// Puzzle configuration and answers
// Update these with actual puzzle content

export const puzzles = [
  {
    id: 1,
    title: "Puzzle 1",
    subtitle: "The First Clue",
    hint: "Think about our first conversation...",
    answer: "", // TBD
    type: "text-input"
  },
  {
    id: 2,
    title: "Puzzle 2",
    subtitle: "A Special Memory",
    hint: "Remember that place we talked about?",
    answer: "", // TBD
    type: "text-input"
  },
  {
    id: 3,
    title: "Puzzle 3",
    subtitle: "Our Song",
    hint: "What song makes you think of us?",
    answer: "", // TBD
    type: "text-input"
  },
  {
    id: 4,
    title: "Puzzle 4",
    subtitle: "A Date to Remember",
    hint: "When did we first...",
    answer: "", // TBD
    type: "date-input"
  },
  {
    id: 5,
    title: "Puzzle 5",
    subtitle: "Hidden Message",
    hint: "Look closely at the letters...",
    answer: "", // TBD
    type: "word-scramble"
  },
  {
    id: 6,
    title: "Puzzle 6",
    subtitle: "The Final Key",
    hint: "Put it all together...",
    answer: "", // TBD
    type: "multiple-choice"
  }
]

export function checkAnswer(puzzleIndex, userAnswer) {
  const puzzle = puzzles[puzzleIndex]
  if (!puzzle || !puzzle.answer) {
    // For now, accept any non-empty answer during development
    return userAnswer && userAnswer.trim().length > 0
  }
  return userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim()
}
