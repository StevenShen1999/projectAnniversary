// Puzzle configuration and answers

export const puzzles = [
  {
    id: 1,
    title: "True Colours",
    subtitle: "Her Favourite Colour",
    question: "What is her favourite colour and one of my favourite features of her?",
    type: "colour-select",
    colours: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange'],
    answer: "blue"
  },
  {
    id: 2,
    title: "The Secret Code",
    subtitle: "A Secret Only She Knows",
    question: "This is something that only she would know. Disguise is always a self portrait.",
    type: "three-part-input",
    answer: "85-65-90"
  },
  {
    id: 3,
    title: "Sweet Nothings",
    subtitle: "A Special Name",
    question: "What is the nickname she always calls me with?",
    type: "text-input",
    answer: "himbo"
  },
  {
    id: 4,
    title: "Lazy Sundays",
    subtitle: "Weekend Adventures",
    question: "On our weekends, what is our favourite past time?",
    type: "word-scramble",
    answer: "ageofmythology"
  },
  {
    id: 5,
    title: "Homeland",
    subtitle: "Where She's From",
    question: 'Many may confuse her as a Russian, but she is in fact from Belarus, a city called',
    type: "text-input",
    answer: "baranovichi",
    acceptedAnswers: ["baranovichi", "baranavichy", "баранавічы", "барановичи"]
  },
  {
    id: 6,
    title: "Why I Adore Her",
    subtitle: "Her Virtues",
    question: "What are her virtues which I deeply admire?",
    type: "multi-select",
    options: ["Empathy", "Intelligence", "Mental Fortitude", "Loving"],
    answer: ["Empathy", "Intelligence", "Mental Fortitude", "Loving"]
  },
  {
    id: 7,
    title: "No Excuses",
    subtitle: "Daily Ritual",
    question: "What is her absolute must daily routine?",
    type: "emoji-select",
    options: [
      { emoji: "🏋️‍♀️", label: "Workout", correct: true },
      { emoji: "📖", label: "Reading", correct: false },
      { emoji: "🧘‍♀️", label: "Meditation", correct: false },
      { emoji: "🎨", label: "Painting", correct: false },
      { emoji: "☕", label: "Coffee", correct: false },
      { emoji: "🎵", label: "Music", correct: false }
    ]
  }
]

export function checkAnswer(puzzleIndex, userAnswer) {
  const puzzle = puzzles[puzzleIndex]
  if (!puzzle) return false

  // Multi-select: check all options selected
  if (puzzle.type === 'multi-select') {
    if (!Array.isArray(userAnswer)) return false
    const sorted = [...userAnswer].sort()
    const expected = [...puzzle.answer].sort()
    return sorted.length === expected.length && sorted.every((v, i) => v === expected[i])
  }

  // Emoji select: handled in component directly
  if (puzzle.type === 'emoji-select') {
    return userAnswer === true
  }

  // Colour select
  if (puzzle.type === 'colour-select') {
    return userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase()
  }

  // Text input with multiple accepted answers
  if (puzzle.acceptedAnswers) {
    const normalised = userAnswer.toLowerCase().trim()
    return puzzle.acceptedAnswers.some(a => a.toLowerCase() === normalised)
  }

  // Default string comparison
  return userAnswer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim()
}
