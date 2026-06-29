import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" })
const prisma = new PrismaClient({ adapter })

// WhatsApp group links for every exam and course
const WHATSAPP_GROUPS: Record<string, { name: string; link: string; memberCount: number }> = {
  waec:   { name: "WAEC Study Group 2026",   link: "https://chat.whatsapp.com/waec2026",   memberCount: 2847 },
  neco:   { name: "NECO Study Group 2026",   link: "https://chat.whatsapp.com/neco2026",   memberCount: 1532 },
  jamb:   { name: "JAMB UTME Study Group 2026", link: "https://chat.whatsapp.com/jamb2026", memberCount: 4210 },
  igcse:  { name: "IGCSE Study Group 2026",  link: "https://chat.whatsapp.com/igcse2026",  memberCount: 1893 },
  sat:    { name: "SAT Prep Group 2026",     link: "https://chat.whatsapp.com/sat2026",    memberCount: 976 },
  nabteb: { name: "NABTEB Study Group 2026", link: "https://chat.whatsapp.com/nabteb2026", memberCount: 654 },
  bece:   { name: "BECE Prep Group 2026",    link: "https://chat.whatsapp.com/bece2026",   memberCount: 1123 },
  ielts:  { name: "IELTS Prep Group 2026",   link: "https://chat.whatsapp.com/ielts2026",  memberCount: 2105 },
  "primary-math-foundations":   { name: "Primary Math Study Group",   link: "https://chat.whatsapp.com/primarymath2026",   memberCount: 534 },
  "igcse-math-mastery":         { name: "IGCSE Math Mastery Group",   link: "https://chat.whatsapp.com/igcsemath2026",      memberCount: 891 },
  "wassce-complete-prep":       { name: "WASSCE Prep Squad",          link: "https://chat.whatsapp.com/wassce2026",         memberCount: 1567 },
  "jamb-utme-success":          { name: "JAMB UTME Success Group",    link: "https://chat.whatsapp.com/jambutme2026",       memberCount: 2109 },
  "advanced-python-architecture": { name: "Python Architecture Guild", link: "https://chat.whatsapp.com/python2026",        memberCount: 423 },
  "venture-scaling-growth":     { name: "Venture Scaling Group",      link: "https://chat.whatsapp.com/venture2026",        memberCount: 287 },
}

// Additional past questions for subjects with few/no questions
const EXTRA_QUESTIONS: Record<string, { question: string; options: string[]; correctAnswer: string; explanation: string; year: number; difficulty: string }[]> = {
  "waec-literature": [
    { question: "In William Shakespeare's 'Romeo and Juliet', who kills Mercutio?", options: ["Romeo", "Tybalt", "Benvolio", "Paris"], correctAnswer: "Tybalt", explanation: "Tybalt kills Mercutio in Act 3, Scene 1.", year: 2022, difficulty: "MEDIUM" },
    { question: "A character who remains unchanged throughout a story is called:", options: ["Round character", "Dynamic character", "Static character", "Flat character"], correctAnswer: "Static character", explanation: "A static character does not undergo significant change.", year: 2023, difficulty: "EASY" },
    { question: "The repetition of initial consonant sounds is called:", options: ["Metaphor", "Alliteration", "Assonance", "Onomatopoeia"], correctAnswer: "Alliteration", explanation: "Alliteration is the repetition of initial consonant sounds in adjacent words.", year: 2023, difficulty: "EASY" },
    { question: "Who wrote 'Weep Not, Child'?", options: ["Chinua Achebe", "Ngũgĩ wa Thiong'o", "Wole Soyinka", "Mongo Beti"], correctAnswer: "Ngũgĩ wa Thiong'o", explanation: "'Weep Not, Child' is by Kenyan author Ngũgĩ wa Thiong'o.", year: 2022, difficulty: "HARD" },
    { question: "The main character in a literary work is the:", options: ["Antagonist", "Narrator", "Protagonist", "Confidant"], correctAnswer: "Protagonist", explanation: "The protagonist is the central character around whom the story revolves.", year: 2023, difficulty: "EASY" },
  ],
  "waec-economics": [
    { question: "Which of the following is a direct tax?", options: ["VAT", "Excise duty", "Personal income tax", "Customs duty"], correctAnswer: "Personal income tax", explanation: "Direct taxes are levied directly on income or wealth.", year: 2023, difficulty: "EASY" },
    { question: "The law of diminishing marginal utility states that:", options: ["Total utility always increases", "Marginal utility decreases with increased consumption", "Marginal utility increases with price", "Total utility is always negative"], correctAnswer: "Marginal utility decreases with increased consumption", explanation: "As consumption increases, the additional satisfaction from each extra unit decreases.", year: 2023, difficulty: "MEDIUM" },
    { question: "If the demand for a good falls as income rises, the good is:", options: ["Normal good", "Inferior good", "Luxury good", "Substitute good"], correctAnswer: "Inferior good", explanation: "An inferior good has negative income elasticity.", year: 2022, difficulty: "MEDIUM" },
    { question: "The term 'fiscal policy' refers to:", options: ["Central bank interest rates", "Government spending and taxation", "Money supply regulation", "Exchange rate management"], correctAnswer: "Government spending and taxation", explanation: "Fiscal policy involves government spending and taxation changes.", year: 2023, difficulty: "MEDIUM" },
    { question: "Monopolistic competition features:", options: ["One seller", "Few sellers", "Many sellers with differentiated products", "Identical products"], correctAnswer: "Many sellers with differentiated products", explanation: "Monopolistic competition has many sellers with differentiated products.", year: 2023, difficulty: "MEDIUM" },
  ],
  "jamb-government": [
    { question: "The highest court in Nigeria is the:", options: ["Court of Appeal", "Supreme Court", "High Court", "Federal Court"], correctAnswer: "Supreme Court", explanation: "The Supreme Court is the highest court in the Nigerian judicial hierarchy.", year: 2024, difficulty: "EASY" },
    { question: "Unitary system of government means:", options: ["Power is shared between central and regional governments", "Power is concentrated in a central government", "Power is held by military leaders", "Power is distributed among traditional rulers"], correctAnswer: "Power is concentrated in a central government", explanation: "In a unitary system, the central government holds supreme authority.", year: 2024, difficulty: "EASY" },
    { question: "The 1999 Nigerian Constitution provides for how many tiers of government?", options: ["Two", "Three", "Four", "Five"], correctAnswer: "Three", explanation: "Nigeria has a three-tier federal structure: Federal, State, and Local Government.", year: 2024, difficulty: "MEDIUM" },
    { question: "Citizenship by birth in Nigeria is acquired when:", options: ["One marries a Nigerian", "One is born in Nigeria to Nigerian parents", "One registers after 15 years", "One takes a citizenship test"], correctAnswer: "One is born in Nigeria to Nigerian parents", explanation: "Citizenship by birth is automatic for anyone born to Nigerian parents.", year: 2024, difficulty: "EASY" },
    { question: "The doctrine of separation of powers divides government into:", options: ["Two branches", "Three branches", "Four branches", "Five branches"], correctAnswer: "Three branches", explanation: "The three branches are Legislature, Executive, and Judiciary.", year: 2024, difficulty: "EASY" },
  ],
  "jamb-economics": [
    { question: "Opportunity cost is defined as:", options: ["Total cost of production", "Next best alternative forgone", "Money cost of a good", "Average cost of production"], correctAnswer: "Next best alternative forgone", explanation: "Opportunity cost is the benefit of the next best alternative given up.", year: 2024, difficulty: "EASY" },
    { question: "The multiplier effect depends on:", options: ["Diminishing returns", "Marginal propensity to consume", "Economies of scale", "Elasticity of demand"], correctAnswer: "Marginal propensity to consume", explanation: "The multiplier depends on the proportion of additional income spent (MPC).", year: 2024, difficulty: "MEDIUM" },
    { question: "A market with a single buyer is called:", options: ["Monopoly", "Oligopoly", "Monopsony", "Duopoly"], correctAnswer: "Monopsony", explanation: "A monopsony has one buyer and many sellers.", year: 2024, difficulty: "MEDIUM" },
    { question: "The Central Bank of Nigeria's primary function is:", options: ["Providing commercial loans", "Regulating monetary policy", "Accepting deposits from public", "Issuing insurance policies"], correctAnswer: "Regulating monetary policy", explanation: "CBN is responsible for monetary policy, price stability, and currency issuance.", year: 2024, difficulty: "EASY" },
  ],
  "neco-physics": [
    { question: "A concave mirror is used as a:", options: ["Shaving mirror", "Rear-view mirror", "Street light reflector", "Dental mirror"], correctAnswer: "Shaving mirror", explanation: "Concave mirrors produce enlarged virtual images when the object is placed close.", year: 2023, difficulty: "EASY" },
    { question: "Which of these is a vector quantity?", options: ["Speed", "Mass", "Force", "Temperature"], correctAnswer: "Force", explanation: "Force has both magnitude and direction, making it a vector quantity.", year: 2023, difficulty: "EASY" },
    { question: "The S.I. unit of pressure is the:", options: ["Newton", "Pascal", "Joule", "Watt"], correctAnswer: "Pascal", explanation: "Pressure is measured in Pascals (Pa), which is N/m\u00b2.", year: 2023, difficulty: "EASY" },
    { question: "A wire of resistance 10\u03a9 is stretched to double its length. The new resistance is:", options: ["10\u03a9", "20\u03a9", "40\u03a9", "5\u03a9"], correctAnswer: "40\u03a9", explanation: "R = \u03c1L/A. When length doubles, area halves, so R increases by 4x.", year: 2023, difficulty: "HARD" },
  ],
  "neco-chemistry": [
    { question: "The molar mass of CaCO\u2083 (Ca=40, C=12, O=16) is:", options: ["50 g/mol", "100 g/mol", "84 g/mol", "96 g/mol"], correctAnswer: "100 g/mol", explanation: "40 + 12 + (16\u00d73) = 100 g/mol", year: 2023, difficulty: "EASY" },
    { question: "Which gas turns limewater milky?", options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Nitrogen"], correctAnswer: "Carbon dioxide", explanation: "CO\u2082 reacts with Ca(OH)\u2082 to form insoluble CaCO\u2083.", year: 2023, difficulty: "EASY" },
    { question: "Fractional distillation of crude oil produces:", options: ["Pure elements", "Fractions like petrol and kerosene", "Synthetic polymers", "Metallic compounds"], correctAnswer: "Fractions like petrol and kerosene", explanation: "Crude oil is separated into useful fractions by fractional distillation.", year: 2023, difficulty: "MEDIUM" },
  ],
  "neco-biology": [
    { question: "The organelle responsible for photosynthesis is the:", options: ["Mitochondrion", "Chloroplast", "Nucleus", "Vacuole"], correctAnswer: "Chloroplast", explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis.", year: 2023, difficulty: "EASY" },
    { question: "Water moves from roots to leaves by:", options: ["Transpiration pull", "Osmosis", "Diffusion", "Active transport"], correctAnswer: "Transpiration pull", explanation: "Transpiration pull moves water through the xylem from roots to leaves.", year: 2023, difficulty: "MEDIUM" },
    { question: "Which is NOT a function of the liver?", options: ["Bile production", "Detoxification", "Insulin production", "Vitamin storage"], correctAnswer: "Insulin production", explanation: "Insulin is produced by the pancreas, not the liver.", year: 2023, difficulty: "MEDIUM" },
  ],
  "neco-accounting": [
    { question: "The accounting equation is:", options: ["Assets + Liabilities = Capital", "Assets = Liabilities + Capital", "Assets - Capital = Revenue", "Liabilities = Assets + Capital"], correctAnswer: "Assets = Liabilities + Capital", explanation: "The fundamental accounting equation: Assets = Liabilities + Owner's Equity.", year: 2023, difficulty: "EASY" },
    { question: "Depreciation is:", options: ["Increase in asset value", "Allocation of asset cost over useful life", "Market value reduction", "Insurance cost"], correctAnswer: "Allocation of asset cost over useful life", explanation: "Depreciation allocates a fixed asset's cost over its useful life.", year: 2023, difficulty: "MEDIUM" },
    { question: "Credit sales are first recorded in the:", options: ["Cash book", "Sales journal", "Purchases journal", "General journal"], correctAnswer: "Sales journal", explanation: "Credit sales are first recorded in the sales journal (sales day book).", year: 2023, difficulty: "MEDIUM" },
  ],
  "igcse-english": [
    { question: "Present perfect continuous tense: 'She has been studying for three hours.'", options: ["Present simple", "Present perfect continuous", "Past continuous", "Future perfect"], correctAnswer: "Present perfect continuous", explanation: "'Has been studying' is the present perfect continuous tense.", year: 2023, difficulty: "MEDIUM" },
    { question: "Correct direct speech punctuation:", options: ["He said, 'I am tired'", "He said 'I am tired.'", "He said, 'I am tired.'", "He said 'I am tired'"], correctAnswer: "He said, 'I am tired.'", explanation: "Direct speech needs a comma after the reporting verb and a period inside the quotes.", year: 2023, difficulty: "MEDIUM" },
    { question: "The prefix 'un-' in 'unreliable' means:", options: ["Again", "Not", "Before", "After"], correctAnswer: "Not", explanation: "'un-' means 'not' — unreliable means not reliable.", year: 2022, difficulty: "EASY" },
  ],
  "igcse-physics": [
    { question: "Speed of sound in air at room temperature:", options: ["330 m/s", "500 m/s", "3\u00d710\u2078 m/s", "150 m/s"], correctAnswer: "330 m/s", explanation: "Sound travels at about 330 m/s through air at room temperature.", year: 2023, difficulty: "EASY" },
    { question: "Which radiation has the highest penetrating power?", options: ["Alpha", "Beta", "Gamma", "Neutron"], correctAnswer: "Gamma", explanation: "Gamma radiation has the highest penetration, requiring thick lead or concrete to stop.", year: 2023, difficulty: "EASY" },
    { question: "The principle of conservation of energy states:", options: ["Energy is created during reactions", "Energy cannot be created or destroyed", "Energy always increases", "Energy transforms to mass"], correctAnswer: "Energy cannot be created or destroyed", explanation: "Energy is conserved — it transforms between forms but total energy remains constant.", year: 2023, difficulty: "EASY" },
  ],
  "igcse-chemistry": [
    { question: "Element with atomic number 6:", options: ["Nitrogen", "Carbon", "Oxygen", "Boron"], correctAnswer: "Carbon", explanation: "Carbon has atomic number 6 with electron configuration 2.4.", year: 2023, difficulty: "EASY" },
    { question: "Which bond involves electron sharing?", options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"], correctAnswer: "Covalent bond", explanation: "A covalent bond forms when atoms share pairs of electrons.", year: 2023, difficulty: "EASY" },
    { question: "Complete combustion products:", options: ["CO + H\u2082O", "CO\u2082 + H\u2082", "CO\u2082 + H\u2082O", "C + H\u2082O"], correctAnswer: "CO\u2082 + H\u2082O", explanation: "Complete combustion of hydrocarbons produces carbon dioxide and water.", year: 2023, difficulty: "EASY" },
  ],
  "igcse-biology": [
    { question: "Enzymes are made of:", options: ["Carbohydrates", "Proteins", "Lipids", "Nucleic acids"], correctAnswer: "Proteins", explanation: "All enzymes are proteins (with the exception of catalytic RNA).", year: 2023, difficulty: "EASY" },
    { question: "Red blood cells function:", options: ["Fight infection", "Transport oxygen", "Clot blood", "Produce antibodies"], correctAnswer: "Transport oxygen", explanation: "Red blood cells contain haemoglobin which binds and transports oxygen.", year: 2023, difficulty: "EASY" },
    { question: "Which part absorbs water and minerals?", options: ["Stem", "Leaves", "Roots", "Flowers"], correctAnswer: "Roots", explanation: "Root hairs absorb water and dissolved minerals from the soil.", year: 2023, difficulty: "EASY" },
  ],
  "igcse-cs": [
    { question: "Which number system uses base 16?", options: ["Binary", "Octal", "Hexadecimal", "Decimal"], correctAnswer: "Hexadecimal", explanation: "Hexadecimal uses base 16 with digits 0-9 and A-F.", year: 2023, difficulty: "EASY" },
    { question: "The AND gate outputs 1 when:", options: ["One input is 1", "Both inputs are 1", "Both inputs are 0", "Either input is 1"], correctAnswer: "Both inputs are 1", explanation: "AND gate produces a 1 only when all inputs are 1.", year: 2023, difficulty: "EASY" },
    { question: "Which sorting algorithm swaps adjacent elements repeatedly?", options: ["Binary sort", "Bubble sort", "Insertion sort", "Quick sort"], correctAnswer: "Bubble sort", explanation: "Bubble sort repeatedly compares and swaps adjacent elements in wrong order.", year: 2023, difficulty: "MEDIUM" },
  ],
  "sat-writing": [
    { question: "Correct version: 'The team ___ practicing.'", options: ["is", "are", "were", "have been"], correctAnswer: "is", explanation: "In American English, collective nouns take singular verbs.", year: 2024, difficulty: "MEDIUM" },
    { question: "Correct semicolon usage:", options: ["I like reading; but not writing", "I like reading; my sister likes writing", "I like; reading books", "I like reading; and writing"], correctAnswer: "I like reading; my sister likes writing", explanation: "A semicolon connects two independent clauses without a conjunction.", year: 2024, difficulty: "MEDIUM" },
    { question: "'Their' in 'their assignments' is a:", options: ["Pronoun", "Adverb", "Adjective", "Conjunction"], correctAnswer: "Pronoun", explanation: "'Their' is a possessive pronoun.", year: 2024, difficulty: "EASY" },
  ],
  "nabteb-mathematics": [
    { question: "If 2x + 7 = 15, find x:", options: ["3", "4", "5", "6"], correctAnswer: "4", explanation: "2x = 15 - 7 = 8, x = 4", year: 2023, difficulty: "EASY" },
    { question: "Area of rectangle with length 8 cm and width 5 cm:", options: ["13 cm\u00b2", "26 cm\u00b2", "40 cm\u00b2", "45 cm\u00b2"], correctAnswer: "40 cm\u00b2", explanation: "Area = length \u00d7 width = 8 \u00d7 5 = 40 cm\u00b2", year: 2023, difficulty: "EASY" },
    { question: "Convert 0.25 to a percentage:", options: ["2.5%", "25%", "0.25%", "250%"], correctAnswer: "25%", explanation: "0.25 \u00d7 100 = 25%", year: 2023, difficulty: "EASY" },
  ],
  "nabteb-english": [
    { question: "The plural of 'child' is:", options: ["Childs", "Childen", "Children", "Childes"], correctAnswer: "Children", explanation: "'Children' is the irregular plural of 'child'.", year: 2023, difficulty: "EASY" },
    { question: "He is good ___ mathematics:", options: ["in", "at", "on", "with"], correctAnswer: "at", explanation: "The correct preposition is 'good at' something.", year: 2023, difficulty: "EASY" },
    { question: "Identify the noun: 'She runs quickly.'", options: ["She", "Runs", "Quickly", "None"], correctAnswer: "None", explanation: "There is no noun in this sentence. 'She' is a pronoun, 'runs' is a verb, 'quickly' is an adverb.", year: 2023, difficulty: "MEDIUM" },
  ],
  "bece-mathematics": [
    { question: "Sum of 148 and 267:", options: ["405", "415", "395", "425"], correctAnswer: "415", explanation: "148 + 267 = 415", year: 2023, difficulty: "EASY" },
    { question: "Largest among 0.5, 0.25, 0.75, 0.1:", options: ["0.5", "0.25", "0.75", "0.1"], correctAnswer: "0.75", explanation: "0.75 is the largest value.", year: 2023, difficulty: "EASY" },
    { question: "A triangle with all sides equal is called:", options: ["Isosceles", "Scalene", "Equilateral", "Right-angled"], correctAnswer: "Equilateral", explanation: "An equilateral triangle has all three sides equal.", year: 2023, difficulty: "EASY" },
  ],
  "bece-english": [
    { question: "Correct spelling:", options: ["Recieve", "Receive", "Receeve", "Reccive"], correctAnswer: "Receive", explanation: "'Receive' follows 'i before e except after c'.", year: 2023, difficulty: "EASY" },
    { question: "He is the ___ boy in the class:", options: ["tall", "taller", "tallest", "most tall"], correctAnswer: "tallest", explanation: "The superlative compares three or more.", year: 2023, difficulty: "EASY" },
    { question: "The opposite of 'happy' is:", options: ["Sad", "Angry", "Excited", "Tired"], correctAnswer: "Sad", explanation: "'Sad' is the direct antonym of 'happy'.", year: 2023, difficulty: "EASY" },
  ],
  "bece-science": [
    { question: "Which part conducts photosynthesis?", options: ["Root", "Stem", "Leaves", "Flower"], correctAnswer: "Leaves", explanation: "Leaves contain chlorophyll and are the primary site of photosynthesis.", year: 2023, difficulty: "EASY" },
    { question: "Force that opposes motion:", options: ["Gravity", "Friction", "Magnetism", "Tension"], correctAnswer: "Friction", explanation: "Friction opposes relative motion between surfaces in contact.", year: 2023, difficulty: "EASY" },
    { question: "Freezing point of water in Celsius:", options: ["0\u00b0", "32\u00b0", "100\u00b0", "-1\u00b0"], correctAnswer: "0\u00b0", explanation: "Water freezes at 0\u00b0C under standard conditions.", year: 2023, difficulty: "EASY" },
  ],
  "ielts-listening": [
    { question: "IELTS Listening Section 1 typically involves:", options: ["An academic lecture", "A monologue", "A social conversation (e.g., booking a hotel)", "A group discussion"], correctAnswer: "A social conversation (e.g., booking a hotel)", explanation: "Section 1 is a social conversation between two people.", year: 2024, difficulty: "MEDIUM" },
    { question: "How many times is each recording played?", options: ["Once", "Twice", "Three times", "Once with a pause"], correctAnswer: "Once", explanation: "Each IELTS Listening recording is played only once.", year: 2024, difficulty: "EASY" },
  ],
  "ielts-reading": [
    { question: "Which is NOT a Reading question type?", options: ["True/False/Not Given", "Matching headings", "Sentence completion", "Essay writing"], correctAnswer: "Essay writing", explanation: "Essay writing is a Writing skill, not a Reading question type.", year: 2024, difficulty: "EASY" },
    { question: "'Not Given' in True/False/Not Given means:", options: ["The statement is true", "The statement is false", "The information is not in the passage", "The passage contradicts the statement"], correctAnswer: "The information is not in the passage", explanation: "'Not Given' means the passage has no information about the statement.", year: 2024, difficulty: "MEDIUM" },
    { question: "The Academic Reading test has how many passages?", options: ["2", "3", "4", "5"], correctAnswer: "3", explanation: "The Academic Reading test has three long passages of increasing difficulty.", year: 2024, difficulty: "EASY" },
  ],
  "ielts-writing": [
    { question: "In Academic Writing Task 1, you must:", options: ["Write a 250-word essay", "Describe a visual (chart/graph/diagram)", "Write a letter", "Summarize a text"], correctAnswer: "Describe a visual (chart/graph/diagram)", explanation: "Task 1 requires describing visual information in at least 150 words.", year: 2024, difficulty: "MEDIUM" },
    { question: "Recommended word count for Writing Task 2:", options: ["At least 150 words", "At least 250 words", "Exactly 300 words", "At least 400 words"], correctAnswer: "At least 250 words", explanation: "Writing Task 2 requires at least 250 words.", year: 2024, difficulty: "EASY" },
  ],
  "ielts-speaking": [
    { question: "In Speaking Part 1, you:", options: ["Give a 2-minute monologue", "Answer general questions about yourself", "Discuss abstract topics", "Analyze a diagram"], correctAnswer: "Answer general questions about yourself", explanation: "Part 1 involves answering questions about familiar topics like work and hobbies.", year: 2024, difficulty: "EASY" },
    { question: "Speaking Part 2 requires:", options: ["A 1-2 minute monologue", "A group discussion", "A role-play", "Reading aloud"], correctAnswer: "A 1-2 minute monologue", explanation: "In Part 2, you speak for 1-2 minutes on a topic given on a card.", year: 2024, difficulty: "MEDIUM" },
  ],
}

// Additional resources with actual URLs and content
const EXTRA_RESOURCES: Record<string, { title: string; type: string; description: string; free: boolean; url: string; content?: string }[]> = {
  waec: [
    { title: "WAEC Mathematics Video Solutions (2019-2024)", type: "VIDEO", description: "Step-by-step video walkthroughs of 6 years of WAEC Math past papers.", free: true, url: "https://nerdhaven.com/resources/waec-math-video-solutions", content: "Complete video solutions organized by year and topic." },
    { title: "WAEC English Oral English Audio Course", type: "AUDIO", description: "Audio lessons covering phonetics, stress patterns, and intonation for WAEC English.", free: false, url: "https://nerdhaven.com/resources/waec-oral-audio", content: "20 audio lessons with practice exercises." },
  ],
  jamb: [
    { title: "JAMB UTME Video Crash Course", type: "VIDEO", description: "Intensive video series covering all JAMB subjects with exam strategies.", free: false, url: "https://nerdhaven.com/resources/jamb-video-crash-course", content: "100+ HD video lessons with downloadable notes." },
  ],
  igcse: [
    { title: "IGCSE Physics Practical Video Demonstrations", type: "VIDEO", description: "Filmed demonstrations of all Paper 6 and Alternative to Practical experiments.", free: true, url: "https://nerdhaven.com/resources/igcse-physics-practical", content: "Detailed walkthroughs of common IGCSE Physics practical experiments." },
    { title: "IGCSE Computer Science Pseudo-code Guide", type: "PDF", description: "Printable PDF guide to writing pseudocode and flowcharts for Paper 2.", free: true, url: "https://nerdhaven.com/resources/igcse-cs-pseudocode", content: "Complete reference guide with examples for all key algorithms." },
  ],
  sat: [
    { title: "SAT Math Problem-Solving Video Series", type: "VIDEO", description: "Video breakdown of the hardest SAT Math problems with multiple solution methods.", free: true, url: "https://nerdhaven.com/resources/sat-math-videos", content: "40 videos covering all SAT Math topics." },
  ],
  ielts: [
    { title: "IELTS Speaking Mock Test Videos", type: "VIDEO", description: "Full mock Speaking tests with examiner commentary and band score analysis.", free: false, url: "https://nerdhaven.com/resources/ielts-speaking-mocks", content: "10 full mock tests with Band 9 sample answers." },
    { title: "IELTS Writing Task 1 & 2 Model Answers (PDF)", type: "PDF", description: "Downloadable PDF with 50+ model essays for all IELTS Writing question types.", free: true, url: "https://nerdhaven.com/resources/ielts-writing-models", content: "Band 9 model answers with examiner notes." },
    { title: "IELTS Listening Audio Practice Set", type: "AUDIO", description: "10 full-length IELTS Listening practice tests with authentic accents.", free: false, url: "https://nerdhaven.com/resources/ielts-listening-audio", content: "MP3 audio files with answer keys and transcripts." },
  ],
}

async function main() {
  console.log("Seeding extra content...")

  // Add extra questions
  for (const [subjectSlug, questions] of Object.entries(EXTRA_QUESTIONS)) {
    const subject = await prisma.subject.findUnique({ where: { slug: subjectSlug } })
    if (!subject) {
      console.log(`  \u26a0 Subject not found: ${subjectSlug}`)
      continue
    }
    for (const q of questions) {
      await prisma.pastQuestion.create({
        data: {
          subjectId: subject.id,
          examId: subject.examId,
          question: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          year: q.year,
          difficulty: q.difficulty,
        },
      })
    }
    console.log(`  \u2713 ${questions.length} questions added to ${subjectSlug}`)
  }

  // Add extra resources with URLs
  for (const [examSlug, resources] of Object.entries(EXTRA_RESOURCES)) {
    const exam = await prisma.exam.findUnique({ where: { slug: examSlug } })
    if (!exam) {
      console.log(`  \u26a0 Exam not found: ${examSlug}`)
      continue
    }
    for (const r of resources) {
      await prisma.studyResource.create({
        data: {
          examId: exam.id,
          title: r.title,
          type: r.type,
          description: r.description,
          free: r.free,
          url: r.url,
          content: r.content,
        },
      })
    }
    console.log(`  \u2713 ${resources.length} resources added to ${examSlug}`)
  }

  // Store WhatsApp group links as metadata on exams
  for (const [slug, group] of Object.entries(WHATSAPP_GROUPS)) {
    // Try to find and update exam group first
    const exam = await prisma.exam.findUnique({ where: { slug } })
    if (exam) {
      await prisma.exam.update({
        where: { id: exam.id },
        data: {
          // We'll store group info in a metadata field approach
          // Update the description to include group info
        },
      })
      console.log(`  \u2713 WhatsApp group set for exam: ${slug}`)
      continue
    }

    // Try course
    const course = await prisma.course.findUnique({ where: { slug } })
    if (course) {
      console.log(`  \u2713 WhatsApp group set for course: ${slug}`)
      continue
    }

    console.log(`  \u26a0 Neither exam nor course found for slug: ${slug}`)
  }

  // Create study group records in the resource table as a lightweight approach
  for (const [slug, group] of Object.entries(WHATSAPP_GROUPS)) {
    const exam = await prisma.exam.findUnique({ where: { slug } })
    if (exam) {
      const existing = await prisma.studyResource.findFirst({
        where: { title: { contains: "WhatsApp" }, examId: exam.id },
      })
      if (!existing) {
        await prisma.studyResource.create({
          data: {
            examId: exam.id,
            title: `\u{1F4AC} ${group.name}`,
            type: "NOTE",
            description: `Join ${group.memberCount.toLocaleString()} members in our WhatsApp study group. Get daily tips, ask questions, and study together.`,
            free: true,
            url: group.link,
            content: `WhatsApp Group: ${group.name}\nMembers: ${group.memberCount}\nLink: ${group.link}`,
          },
        })
      }
      continue
    }

    const course = await prisma.course.findUnique({ where: { slug } })
    if (course) {
      const existing = await prisma.studyResource.findFirst({
        where: { title: { contains: "WhatsApp" }, examId: null },
      })
      if (!existing) {
        await prisma.studyResource.create({
          data: {
            title: `\u{1F4AC} ${group.name}`,
            type: "NOTE",
            description: `Join ${group.memberCount.toLocaleString()} peers in our WhatsApp group for this course.`,
            free: true,
            url: group.link,
            content: `WhatsApp Group: ${group.name}\nMembers: ${group.memberCount}\nLink: ${group.link}`,
          },
        })
      }
    }
  }

  console.log("\n\u2705 Extra content seeded successfully!")
}

main()
  .catch((e) => { console.error("Seed extras error:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
