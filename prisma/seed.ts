import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client.js"
import { createHash } from "node:crypto"

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

const hash = (pw: string) => createHash("sha256").update(pw).digest("hex")

const EXAMS = [
  { name: "WAEC", slug: "waec", fullName: "West African Examinations Council", description: "The West African Senior School Certificate Examination (WASSCE) taken by students in Nigeria, Ghana, Sierra Leone, Liberia, and The Gambia.", country: "Nigeria", website: "https://waecafrica.org" },
  { name: "NECO", slug: "neco", fullName: "National Examinations Council", description: "NECO conducts the Senior School Certificate Examination (SSCE) for Nigerian secondary school students.", country: "Nigeria", website: "https://neco.gov.ng" },
  { name: "JAMB", slug: "jamb", fullName: "Joint Admissions and Matriculation Board", description: "JAMB conducts the Unified Tertiary Matriculation Examination (UTME) for admission into Nigerian tertiary institutions.", country: "Nigeria", website: "https://jamb.gov.ng" },
  { name: "IGCSE", slug: "igcse", fullName: "International General Certificate of Secondary Education", description: "Cambridge IGCSE is one of the most recognized international qualifications for secondary school students worldwide.", country: "International", website: "https://cambridgeinternational.org" },
  { name: "SAT", slug: "sat", fullName: "Scholastic Assessment Test", description: "Standardized test widely used for college admissions in the United States.", country: "United States", website: "https://collegeboard.org/sat" },
  { name: "NABTEB", slug: "nabteb", fullName: "National Business and Technical Examinations Board", description: "NABTEB conducts examinations for technical and vocational education in Nigeria.", country: "Nigeria", website: "https://nabteb.gov.ng" },
  { name: "BECE", slug: "bece", fullName: "Basic Education Certificate Examination", description: "BECE taken by Junior Secondary School students in Nigeria to transition to Senior Secondary School.", country: "Nigeria", website: "https://neco.gov.ng" },
  { name: "IELTS", slug: "ielts", fullName: "International English Language Testing System", description: "IELTS assesses English language proficiency for study, work, or migration to English-speaking countries.", country: "International", website: "https://ielts.org" },
]

const SUBJECTS: Record<string, { name: string; slug: string; description: string }[]> = {
  waec: [
    { name: "Mathematics", slug: "waec-mathematics", description: "Core Mathematics covering algebra, geometry, trigonometry, statistics, and number theory." },
    { name: "English Language", slug: "waec-english", description: "English Language covering comprehension, summary, lexical and structural questions." },
    { name: "Physics", slug: "waec-physics", description: "Physics covering mechanics, waves, electricity, magnetism, modern physics." },
    { name: "Chemistry", slug: "waec-chemistry", description: "Chemistry covering atomic structure, bonding, kinetics, equilibrium, organic chemistry." },
    { name: "Biology", slug: "waec-biology", description: "Biology covering cell biology, genetics, ecology, evolution, and physiology." },
    { name: "Government", slug: "waec-government", description: "Government covering political systems, constitutions, and international organizations." },
    { name: "Economics", slug: "waec-economics", description: "Economics covering demand and supply, national income, money and banking." },
    { name: "Literature in English", slug: "waec-literature", description: "Literature covering prose, poetry, drama, and literary appreciation." },
  ],
  neco: [
    { name: "Mathematics", slug: "neco-mathematics", description: "NECO Mathematics covering number systems, algebra, geometry, trigonometry, and statistics." },
    { name: "English Language", slug: "neco-english", description: "NECO English Language covering comprehension, summary, grammar, and oral English." },
    { name: "Physics", slug: "neco-physics", description: "NECO Physics covering mechanics, waves, optics, electricity, and modern physics." },
    { name: "Chemistry", slug: "neco-chemistry", description: "NECO Chemistry covering atomic structure, bonding, thermodynamics, and organic chemistry." },
    { name: "Biology", slug: "neco-biology", description: "NECO Biology covering cell theory, genetics, evolution, ecology, and human physiology." },
    { name: "Financial Accounting", slug: "neco-accounting", description: "Financial Accounting covering ledger accounts, trial balance, financial statements." },
  ],
  jamb: [
    { name: "Use of English", slug: "jamb-english", description: "UTME Use of English covering comprehension, lexis and structure, and oral forms." },
    { name: "Mathematics", slug: "jamb-mathematics", description: "UTME Mathematics covering algebra, geometry, calculus, statistics, and vectors." },
    { name: "Physics", slug: "jamb-physics", description: "UTME Physics covering motion, forces, energy, waves, and electromagnetism." },
    { name: "Chemistry", slug: "jamb-chemistry", description: "UTME Chemistry covering atomic structure, periodic table, bonding, and organic compounds." },
    { name: "Biology", slug: "jamb-biology", description: "UTME Biology covering cell division, genetics, ecology, and classification." },
    { name: "Government", slug: "jamb-government", description: "UTME Government covering political ideologies, constitutions, and governance systems." },
    { name: "Economics", slug: "jamb-economics", description: "UTME Economics covering micro and macroeconomics, development, and economic systems." },
  ],
  igcse: [
    { name: "Mathematics (0580)", slug: "igcse-mathematics", description: "Cambridge IGCSE Mathematics covering number, algebra, shape, space, and probability." },
    { name: "English First Language (0500)", slug: "igcse-english", description: "Cambridge IGCSE English covering reading, writing, and speaking skills." },
    { name: "Physics (0625)", slug: "igcse-physics", description: "Cambridge IGCSE Physics covering general physics, thermal, waves, electricity, and atomic physics." },
    { name: "Chemistry (0620)", slug: "igcse-chemistry", description: "Cambridge IGCSE Chemistry covering particles, bonding, reactions, and organic chemistry." },
    { name: "Biology (0610)", slug: "igcse-biology", description: "Cambridge IGCSE Biology covering cells, transport, respiration, and ecosystems." },
    { name: "Computer Science (0478)", slug: "igcse-cs", description: "Cambridge IGCSE Computer Science covering algorithms, programming, and data representation." },
  ],
  sat: [
    { name: "Math", slug: "sat-math", description: "SAT Math covering algebra, problem solving, advanced math, and geometry/trigonometry." },
    { name: "Evidence-Based Reading", slug: "sat-reading", description: "SAT Reading covering passage comprehension, vocabulary in context, and data analysis." },
    { name: "Writing & Language", slug: "sat-writing", description: "SAT Writing covering grammar, punctuation, style, and rhetorical skills." },
  ],
  nabteb: [
    { name: "Mathematics", slug: "nabteb-mathematics", description: "NABTEB Mathematics covering basic arithmetic, algebra, geometry, and trigonometry." },
    { name: "English Language", slug: "nabteb-english", description: "NABTEB English Language covering comprehension, grammar, and composition." },
  ],
  bece: [
    { name: "Mathematics", slug: "bece-mathematics", description: "BECE Mathematics covering numbers, measurement, geometry, and data handling." },
    { name: "English Studies", slug: "bece-english", description: "BECE English covering reading comprehension, grammar, and composition." },
    { name: "Basic Science", slug: "bece-science", description: "BECE Basic Science covering classification, energy, forces, and living things." },
  ],
  ielts: [
    { name: "Listening", slug: "ielts-listening", description: "IELTS Listening covering four sections of recorded conversations and monologues." },
    { name: "Reading", slug: "ielts-reading", description: "IELTS Reading covering three long passages with academic texts." },
    { name: "Writing", slug: "ielts-writing", description: "IELTS Writing covering task 1 and task 2 essays." },
    { name: "Speaking", slug: "ielts-speaking", description: "IELTS Speaking covering introduction, long turn, and discussion." },
  ],
}

const QUESTIONS: Record<string, { question: string; options: string[]; correctAnswer: string; explanation: string; year: number; difficulty: string }[]> = {
  "waec-mathematics": [
    { question: "Simplify: (3x + 2)(x - 4)", options: ["3x\u00b2 - 10x - 8", "3x\u00b2 + 10x - 8", "3x\u00b2 - 10x + 8", "3x\u00b2 + 10x + 8"], correctAnswer: "3x\u00b2 - 10x - 8", explanation: "Using FOIL: (3x)(x) + (3x)(-4) + (2)(x) + (2)(-4) = 3x\u00b2 - 12x + 2x - 8 = 3x\u00b2 - 10x - 8", year: 2023, difficulty: "EASY" },
    { question: "If log\u2082x = 5, find the value of x", options: ["10", "25", "32", "16"], correctAnswer: "32", explanation: "log\u2082x = 5 means 2\u2075 = x, therefore x = 32", year: 2023, difficulty: "EASY" },
    { question: "A man is 4 times as old as his son. In 4 years, he will be 3 times as old. How old is the son?", options: ["6", "8", "10", "12"], correctAnswer: "8", explanation: "Let son = x, man = 4x. In 4 years: 4x + 4 = 3(x + 4) \u2192 4x + 4 = 3x + 12 \u2192 x = 8", year: 2022, difficulty: "MEDIUM" },
    { question: "Find the value of sin 30\u00b0 + cos 60\u00b0", options: ["0", "0.5", "1", "1.5"], correctAnswer: "1", explanation: "sin 30\u00b0 = 0.5, cos 60\u00b0 = 0.5, so sin 30\u00b0 + cos 60\u00b0 = 1", year: 2023, difficulty: "EASY" },
    { question: "The mean of 5 numbers is 12. If one number is removed, the mean becomes 11. Find the removed number.", options: ["14", "16", "17", "15"], correctAnswer: "16", explanation: "Sum of all 5 = 60. Sum of remaining 4 = 44. Removed number = 60 - 44 = 16", year: 2022, difficulty: "MEDIUM" },
    { question: "Evaluate \u222b(2x + 3)dx", options: ["x\u00b2 + 3x + C", "2x\u00b2 + 3x + C", "x\u00b2 + 3 + C", "2x + 3 + C"], correctAnswer: "x\u00b2 + 3x + C", explanation: "\u222b2x dx = x\u00b2, \u222b3 dx = 3x, so \u222b(2x + 3)dx = x\u00b2 + 3x + C", year: 2023, difficulty: "MEDIUM" },
    { question: "Find the equation of a line passing through (2, 3) and (4, 7)", options: ["y = 2x - 1", "y = 2x + 1", "y = x + 1", "y = 3x - 3"], correctAnswer: "y = 2x - 1", explanation: "Slope = (7-3)/(4-2) = 2. Using y - 3 = 2(x - 2): y = 2x - 1", year: 2022, difficulty: "MEDIUM" },
    { question: "In a class of 40 students, 25 study Math, 20 study Physics, 10 study both. How many study neither?", options: ["3", "5", "7", "10"], correctAnswer: "5", explanation: "n(M\u222aP) = 25 + 20 - 10 = 35. Neither = 40 - 35 = 5", year: 2023, difficulty: "HARD" },
    { question: "Solve for x: 2x\u00b2 - 5x - 3 = 0", options: ["x = 3 or x = -\u00bd", "x = -3 or x = \u00bd", "x = 3 or x = \u00bd", "x = -3 or x = -\u00bd"], correctAnswer: "x = 3 or x = -\u00bd", explanation: "Using quadratic formula: x = (5 \u00b1 \u221a(25 + 24))/4 = (5 \u00b1 7)/4, so x = 3 or x = -\u00bd", year: 2022, difficulty: "MEDIUM" },
    { question: "If P = {a, b, c, d} and Q = {c, d, e, f}, find n(P \u2229 Q)", options: ["4", "2", "6", "3"], correctAnswer: "2", explanation: "P \u2229 Q = {c, d} has 2 elements", year: 2023, difficulty: "EASY" },
  ],
  "waec-english": [
    { question: "Choose the correct spelling:", options: ["Accomodation", "Acommodation", "Accommodation", "Acomodation"], correctAnswer: "Accommodation", explanation: "The correct spelling is 'accommodation' with two 'c's and two 'm's.", year: 2023, difficulty: "EASY" },
    { question: "Complete: 'The committee has ____ its decision.'", options: ["made", "taken", "given", "reached"], correctAnswer: "reached", explanation: "The correct collocation is 'reach a decision'.", year: 2023, difficulty: "MEDIUM" },
    { question: "Identify the figure of speech: 'The moon is a silver coin.'", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correctAnswer: "Metaphor", explanation: "Direct comparison without 'like' or 'as' is a metaphor.", year: 2022, difficulty: "EASY" },
    { question: "Antonym of 'benevolent':", options: ["Kind", "Generous", "Malevolent", "Charitable"], correctAnswer: "Malevolent", explanation: "Benevolent means kind; malevolent means wishing evil on others.", year: 2023, difficulty: "MEDIUM" },
    { question: "Which sentence is correct?", options: ["Neither the boys nor their father were present.", "Neither the boys nor their father was present.", "Neither the boys or their father was present.", "Neither the boys nor their father are present."], correctAnswer: "Neither the boys nor their father was present.", explanation: "With 'neither...nor', verb agrees with the nearest subject. 'Father' is singular.", year: 2022, difficulty: "HARD" },
    { question: "Choose the word nearest in meaning to 'elucidate':", options: ["Complicate", "Explain", "Hide", "Simplify"], correctAnswer: "Explain", explanation: "Elucidate means to make something clear or explain.", year: 2023, difficulty: "MEDIUM" },
    { question: "Fill in: 'I am looking forward ____ hearing from you.'", options: ["for", "to", "on", "at"], correctAnswer: "to", explanation: "The phrasal verb 'look forward to' is followed by a gerund.", year: 2022, difficulty: "EASY" },
    { question: "The opposite of 'artificial' is:", options: ["Natural", "Fake", "Synthetic", "False"], correctAnswer: "Natural", explanation: "Artificial means man-made; natural means occurring in nature.", year: 2023, difficulty: "EASY" },
  ],
  "waec-physics": [
    { question: "A body of mass 5 kg moves at 10 m/s. What is its kinetic energy?", options: ["250 J", "500 J", "100 J", "50 J"], correctAnswer: "250 J", explanation: "KE = \u00bdmv\u00b2 = \u00bd \u00d7 5 \u00d7 100 = 250 J", year: 2023, difficulty: "EASY" },
    { question: "SI unit of electric current:", options: ["Volt", "Ohm", "Ampere", "Coulomb"], correctAnswer: "Ampere", explanation: "The ampere (A) is the SI base unit of electric current.", year: 2023, difficulty: "EASY" },
    { question: "A wave has frequency 50 Hz and wavelength 2 m. Its speed is:", options: ["25 m/s", "100 m/s", "52 m/s", "48 m/s"], correctAnswer: "100 m/s", explanation: "v = f\u03bb = 50 \u00d7 2 = 100 m/s", year: 2022, difficulty: "MEDIUM" },
    { question: "The force that opposes motion between surfaces in contact is:", options: ["Gravity", "Friction", "Tension", "Magnetism"], correctAnswer: "Friction", explanation: "Friction is a force that opposes relative motion between surfaces in contact.", year: 2023, difficulty: "EASY" },
    { question: "A car accelerates from rest to 20 m/s in 10 s. What is the acceleration?", options: ["0.5 m/s\u00b2", "2 m/s\u00b2", "10 m/s\u00b2", "200 m/s\u00b2"], correctAnswer: "2 m/s\u00b2", explanation: "a = (v - u)/t = (20 - 0)/10 = 2 m/s\u00b2", year: 2023, difficulty: "EASY" },
  ],
  "waec-chemistry": [
    { question: "Atomic number is determined by the number of:", options: ["Protons", "Neutrons", "Electrons", "Nucleons"], correctAnswer: "Protons", explanation: "Atomic number (Z) equals the number of protons in the nucleus.", year: 2023, difficulty: "EASY" },
    { question: "Example of a chemical change:", options: ["Melting ice", "Rusting iron", "Dissolving sugar", "Cutting wood"], correctAnswer: "Rusting iron", explanation: "Rusting involves oxidation forming a new substance (iron oxide).", year: 2023, difficulty: "EASY" },
    { question: "The pH of a neutral solution is:", options: ["0", "7", "14", "1"], correctAnswer: "7", explanation: "A neutral solution has pH 7 at 25\u00b0C.", year: 2022, difficulty: "EASY" },
    { question: "Which gas is produced when zinc reacts with dilute hydrochloric acid?", options: ["Chlorine", "Hydrogen", "Oxygen", "Carbon dioxide"], correctAnswer: "Hydrogen", explanation: "Zn + 2HCl \u2192 ZnCl\u2082 + H\u2082\u2191", year: 2022, difficulty: "MEDIUM" },
  ],
  "waec-biology": [
    { question: "Organelle responsible for cellular respiration:", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correctAnswer: "Mitochondria", explanation: "Mitochondria are the powerhouse of the cell where ATP is produced.", year: 2023, difficulty: "EASY" },
    { question: "Enzyme pepsin breaks down:", options: ["Carbohydrates", "Proteins", "Fats", "Vitamins"], correctAnswer: "Proteins", explanation: "Pepsin is a protease that breaks down proteins into peptides in the stomach.", year: 2023, difficulty: "MEDIUM" },
    { question: "The basic unit of classification is:", options: ["Genus", "Species", "Phylum", "Kingdom"], correctAnswer: "Species", explanation: "Species is the most specific and basic unit of biological classification.", year: 2022, difficulty: "EASY" },
    { question: "Blood type O is the universal:", options: ["Recipient", "Donor", "Antigen", "Antibody"], correctAnswer: "Donor", explanation: "Type O has no A or B antigens, making it compatible with all types for donation.", year: 2023, difficulty: "EASY" },
  ],
  "waec-government": [
    { question: "Nigeria gained independence in:", options: ["1957", "1960", "1963", "1965"], correctAnswer: "1960", explanation: "Nigeria gained independence from British rule on October 1, 1960.", year: 2023, difficulty: "EASY" },
    { question: "Separation of powers was propounded by:", options: ["John Locke", "Rousseau", "Montesquieu", "Hobbes"], correctAnswer: "Montesquieu", explanation: "Montesquieu in 'The Spirit of the Laws' advocated separation of powers.", year: 2022, difficulty: "MEDIUM" },
    { question: "The upper house of the Nigerian National Assembly is the:", options: ["House of Reps", "Senate", "Supreme Court", "Executive Council"], correctAnswer: "Senate", explanation: "Nigeria's bicameral legislature consists of the Senate (upper) and House of Representatives (lower).", year: 2023, difficulty: "EASY" },
  ],
  "waec-economics": [
    { question: "The law of demand states:", options: ["Price up, demand up", "Price up, supply down", "Price up, demand down", "Price up, supply up"], correctAnswer: "Price up, demand down", explanation: "Inverse relationship between price and quantity demanded.", year: 2023, difficulty: "EASY" },
    { question: "GDP is:", options: ["Total exports value", "Total goods and services produced within a country", "Total citizen income", "Total government revenue"], correctAnswer: "Total goods and services produced within a country", explanation: "GDP measures total monetary value of all finished goods and services within borders.", year: 2023, difficulty: "EASY" },
    { question: "OPEC stands for:", options: ["Organization of Petroleum Exporting Countries", "Organization of Petroleum Economics Council", "Organization of Producing and Exporting Countries", "Organization of Petroleum and Energy Countries"], correctAnswer: "Organization of Petroleum Exporting Countries", explanation: "OPEC is an intergovernmental organization of oil-exporting nations.", year: 2022, difficulty: "MEDIUM" },
  ],
  "jamb-english": [
    { question: "Word nearest in meaning to 'ubiquitous':", options: ["Rare", "Everywhere", "Unique", "Hidden"], correctAnswer: "Everywhere", explanation: "Ubiquitous means present everywhere.", year: 2024, difficulty: "MEDIUM" },
    { question: "Correct option: 'If I _____ you, I would accept.'", options: ["am", "was", "were", "be"], correctAnswer: "were", explanation: "In subjunctive mood, 'were' is used regardless of subject.", year: 2024, difficulty: "MEDIUM" },
    { question: "Choose the correct stress pattern for 'democracy':", options: ["DE-mo-cra-cy", "de-MO-cra-cy", "de-mo-CRA-cy", "de-mo-cra-CY"], correctAnswer: "de-MO-cra-cy", explanation: "In 'democracy', the primary stress is on the second syllable.", year: 2024, difficulty: "HARD" },
  ],
  "jamb-mathematics": [
    { question: "Sum of first 10 terms of AP with a=3, d=4:", options: ["210", "220", "200", "230"], correctAnswer: "210", explanation: "S\u2099 = n/2(2a + (n-1)d) = 10/2(6 + 36) = 5 \u00d7 42 = 210", year: 2024, difficulty: "MEDIUM" },
    { question: "If A={1,2,3} and B={2,3,4}, find A\u2229B:", options: ["{1,2,3,4}", "{2,3}", "{1,4}", "{}"], correctAnswer: "{2,3}", explanation: "A\u2229B contains elements common to both sets: 2 and 3.", year: 2024, difficulty: "EASY" },
    { question: "Differentiate y = 3x\u00b2 + 2x - 5", options: ["6x + 2", "3x + 2", "6x - 2", "3x\u00b2 + 2"], correctAnswer: "6x + 2", explanation: "dy/dx = 6x + 2", year: 2024, difficulty: "MEDIUM" },
    { question: "Find the value of \u222b\u2080\u00b9(2x + 1)dx", options: ["1", "2", "3", "4"], correctAnswer: "2", explanation: "\u222b(2x+1)dx = x\u00b2 + x, evaluate from 0 to 1: (1+1) - (0+0) = 2", year: 2024, difficulty: "MEDIUM" },
  ],
  "jamb-physics": [
    { question: "Car accelerates from rest to 20 m/s in 10 s. Acceleration:", options: ["0.5", "2", "10", "200"], correctAnswer: "2", explanation: "a = (v - u)/t = (20 - 0)/10 = 2 m/s\u00b2", year: 2024, difficulty: "EASY" },
    { question: "The unit of power is:", options: ["Newton", "Joule", "Watt", "Pascal"], correctAnswer: "Watt", explanation: "Power (rate of doing work) is measured in watts (W).", year: 2024, difficulty: "EASY" },
  ],
  "jamb-chemistry": [
    { question: "Mass of 2 moles of water (H\u2082O): [H=1, O=16]", options: ["18 g", "34 g", "36 g", "20 g"], correctAnswer: "36 g", explanation: "Molar mass H\u2082O = 18 g/mol. Mass = 2 \u00d7 18 = 36 g.", year: 2024, difficulty: "MEDIUM" },
    { question: "The most abundant gas in the atmosphere is:", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], correctAnswer: "Nitrogen", explanation: "Nitrogen makes up about 78% of the Earth's atmosphere.", year: 2024, difficulty: "EASY" },
  ],
  "jamb-biology": [
    { question: "Blood group O is universal:", options: ["Recipient", "Donor", "Antigen", "Antibody"], correctAnswer: "Donor", explanation: "Type O has no A or B antigens, making it a universal donor.", year: 2024, difficulty: "EASY" },
    { question: "The smallest bone in the human body is the:", options: ["Femur", "Stapes", "Patella", "Humerus"], correctAnswer: "Stapes", explanation: "The stapes (stirrup bone) in the middle ear is the smallest bone.", year: 2024, difficulty: "MEDIUM" },
  ],
  "igcse-mathematics": [
    { question: "Factorise: x\u00b2 - 9", options: ["(x - 3)\u00b2", "(x + 3)(x - 3)", "(x + 9)(x - 1)", "x(x - 9)"], correctAnswer: "(x + 3)(x - 3)", explanation: "x\u00b2 - 9 is a difference of two squares.", year: 2023, difficulty: "EASY" },
    { question: "Triangle sides 5, 12, 13. Is it right-angled?", options: ["Yes", "No", "Cannot determine", "Only if 13 is base"], correctAnswer: "Yes", explanation: "5\u00b2 + 12\u00b2 = 25 + 144 = 169 = 13\u00b2 satisfies Pythagoras.", year: 2023, difficulty: "EASY" },
    { question: "Probability of rolling an even number on a fair die:", options: ["1/6", "1/3", "1/2", "2/3"], correctAnswer: "1/2", explanation: "Even numbers: 2, 4, 6. Probability = 3/6 = 1/2.", year: 2022, difficulty: "EASY" },
    { question: "Solve: 5(x - 3) = 2x + 9", options: ["x=6", "x=8", "x=4", "x=10"], correctAnswer: "x=8", explanation: "5x - 15 = 2x + 9 \u2192 3x = 24 \u2192 x = 8", year: 2023, difficulty: "MEDIUM" },
  ],
  "sat-math": [
    { question: "If 3x + 7 = 22, what is x?", options: ["3", "5", "7", "15"], correctAnswer: "5", explanation: "3x + 7 = 22 \u2192 3x = 15 \u2192 x = 5", year: 2024, difficulty: "EASY" },
    { question: "f(x) = 2x\u00b2 + 3x - 5. Find f(-1):", options: ["-6", "-4", "0", "6"], correctAnswer: "-6", explanation: "f(-1) = 2(1) + 3(-1) - 5 = 2 - 3 - 5 = -6", year: 2024, difficulty: "MEDIUM" },
    { question: "If x + y = 10 and x - y = 4, find x:", options: ["3", "5", "6", "7"], correctAnswer: "7", explanation: "Adding equations: 2x = 14 \u2192 x = 7", year: 2024, difficulty: "EASY" },
  ],
  "sat-reading": [
    { question: "In context, 'novel' most likely means:", options: ["A book", "New and original", "Fictional", "Unusual"], correctAnswer: "New and original", explanation: "The adjective 'novel' means new and original in this context.", year: 2024, difficulty: "MEDIUM" },
  ],
  "neco-mathematics": [
    { question: "Simplify: \u221a50 + \u221a18 - \u221a8", options: ["6\u221a2", "4\u221a2", "8\u221a2", "5\u221a2"], correctAnswer: "6\u221a2", explanation: "\u221a50 = 5\u221a2, \u221a18 = 3\u221a2, \u221a8 = 2\u221a2. 5\u221a2 + 3\u221a2 - 2\u221a2 = 6\u221a2", year: 2023, difficulty: "MEDIUM" },
    { question: "Find the simple interest on \u20a620,000 at 5% per annum for 3 years.", options: ["\u20a63,000", "\u20a62,000", "\u20a64,000", "\u20a65,000"], correctAnswer: "\u20a63,000", explanation: "SI = PRT/100 = 20000\u00d75\u00d73/100 = \u20a63,000", year: 2023, difficulty: "EASY" },
  ],
  "neco-english": [
    { question: "Which is correct: 'She had ____ gone when I arrived.'", options: ["already", "all ready", "allredy", "alredy"], correctAnswer: "already", explanation: "'Already' means before the time in question.", year: 2023, difficulty: "EASY" },
  ],
}

const RESOURCES: Record<string, { title: string; type: string; description: string; free: boolean; content?: string }[]> = {
  waec: [
    { title: "WAEC Mathematics Syllabus 2025", type: "NOTE", description: "Complete syllabus breakdown with topic weighting and recommended study hours.", free: true },
    { title: "WAEC English Past Questions & Answers (2015-2024)", type: "NOTE", description: "Compilation of 10 years of WAEC English Language past questions with marking schemes.", free: false },
    { title: "WAEC Physics Practical Guide", type: "NOTE", description: "Step-by-step guide to common WAEC Physics practical experiments.", free: true },
    { title: "WAEC Chemistry Video Tutorial Series", type: "VIDEO", description: "50+ video lessons covering the entire WAEC Chemistry syllabus.", free: false },
    { title: "WAEC Biology Diagrams Handbook", type: "NOTE", description: "All essential biology diagrams with labels and explanations.", free: true },
    { title: "WAEC Government Key Points", type: "NOTE", description: "Summary of key government topics with past question analysis.", free: true },
    { title: "WAEC Economics Formula & Graph Guide", type: "NOTE", description: "Essential economics formulas and graph interpretation guide.", free: true },
    { title: "Complete WAEC Literature Text Summaries", type: "NOTE", description: "Summaries and analysis of prescribed prose, drama, and poetry texts.", free: false },
  ],
  neco: [
    { title: "NECO Mathematics Formula Sheet", type: "NOTE", description: "Quick reference for all essential formulas needed for NECO Mathematics.", free: true },
    { title: "NECO Financial Accounting Workbook", type: "NOTE", description: "Practice workbook with 100+ accounting problems and solutions.", free: false },
    { title: "NECO Physics Practical Handbook", type: "NOTE", description: "Guide to NECO Physics practical examinations with sample experiments.", free: true },
  ],
  jamb: [
    { title: "JAMB UTME Syllabus 2025", type: "NOTE", description: "Complete UTME syllabus for all subjects with topic breakdowns.", free: true },
    { title: "JAMB Past Questions Database (2000-2024)", type: "NOTE", description: "Searchable database of 24 years of JAMB past questions with answers.", free: false },
    { title: "JAMB Use of English Comprehension Passages", type: "NOTE", description: "50 practice comprehension passages following UTME format.", free: true },
    { title: "JAMB Mathematics Formula Compilation", type: "NOTE", description: "All formulas needed for JAMB Mathematics with worked examples.", free: true },
    { title: "JAMB Physics Solved Problems", type: "NOTE", description: "200+ solved physics problems from past JAMB examinations.", free: false },
  ],
  igcse: [
    { title: "IGCSE Mathematics Extended Revision Guide", type: "NOTE", description: "Complete revision notes for Cambridge IGCSE Mathematics (0580) Extended.", free: true },
    { title: "IGCSE Physics Practical Skills Handbook", type: "NOTE", description: "Guide to planning experiments and evaluating results for Paper 6.", free: false },
    { title: "IGCSE Chemistry Theory Summary", type: "NOTE", description: "Concise theory notes covering all core IGCSE Chemistry topics.", free: true },
    { title: "IGCSE Computer Science Algorithms Guide", type: "NOTE", description: "Guide to algorithm design, pseudocode, and flowcharts for IGCSE CS.", free: true },
  ],
  sat: [
    { title: "SAT Math Formula Reference", type: "NOTE", description: "All formulas provided on test day plus additional high-utility formulas.", free: true },
    { title: "SAT Reading Strategy Guide", type: "NOTE", description: "Proven strategies for tackling passage-based reading questions.", free: true },
    { title: "SAT Writing Grammar Rules", type: "NOTE", description: "Complete guide to SAT grammar, punctuation, and rhetorical skills.", free: true },
    { title: "SAT Full-Length Practice Tests", type: "NOTE", description: "5 full-length SAT practice tests with detailed answer explanations.", free: false },
  ],
  nabteb: [
    { title: "NABTEB Mathematics Past Questions", type: "NOTE", description: "Compiled past questions for NABTEB mathematics examinations.", free: true },
  ],
  bece: [
    { title: "BECE Mathematics Revision Notes", type: "NOTE", description: "Simplified revision notes for JSS3 BECE Mathematics.", free: true },
    { title: "BECE Basic Science Study Guide", type: "NOTE", description: "Comprehensive study guide covering all BECE Basic Science topics.", free: true },
  ],
  ielts: [
    { title: "IELTS Writing Task 2 Essay Templates", type: "NOTE", description: "Proven templates for all IELTS Writing Task 2 question types.", free: true },
    { title: "IELTS Speaking Part 1, 2 & 3 Guide", type: "NOTE", description: "Complete speaking preparation with sample answers and tips.", free: true },
    { title: "IELTS Listening Practice Tests", type: "NOTE", description: "10 full listening practice tests with audio transcripts.", free: false },
  ],
}

async function main() {
  console.log("Seeding Nerdhaven database...")

  // Clean
  await prisma.cognitiveDiagnostic.deleteMany()
  await prisma.assessmentAttempt.deleteMany()
  await prisma.practiceTest.deleteMany()
  await prisma.studyPlan.deleteMany()
  await prisma.studyResource.deleteMany()
  await prisma.pastQuestion.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.paymentEvent.deleteMany()
  await prisma.paymentStateTransition.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.curriculumNode.deleteMany()
  await prisma.course.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Users
  const admin = await prisma.user.create({
    data: { name: "Admin", email: "admin@nerdhaven.com", password: hash("admin"), role: "ADMIN", profile: { create: { tier: "UNIVERSITY", displayName: "Admin" } } },
  })
  const demo = await prisma.user.create({
    data: { name: "Demo Student", email: "demo@nerdhaven.com", password: hash("admin"), role: "STUDENT", profile: { create: { tier: "SECONDARY", displayName: "Demo" } } },
  })
  console.log("  \u2713 Users created")

  // Courses
  const courseDefs = [
    { title: "Primary Mathematics: Foundations", slug: "primary-math-foundations", description: "Build a rock-solid foundation in primary mathematics with interactive lessons and engaging assessments.", shortDescription: "Numbers, operations & shapes for ages 6-12", tier: "PRIMARY", category: "Mathematics", difficulty: "BEGINNER", priceInKobo: 150000, modules: [
      { title: "Number Sense", content: "Understanding numbers, place value, counting, and basic arithmetic operations." },
      { title: "Basic Operations", content: "Addition, subtraction, multiplication, and division with real-world applications." },
      { title: "Shapes & Geometry", content: "2D and 3D shapes, symmetry, patterns, and spatial reasoning." },
    ]},
    { title: "IGCSE Mathematics Mastery", slug: "igcse-math-mastery", description: "Comprehensive IGCSE Mathematics covering all core and extended topics with exam-style questions.", shortDescription: "Complete IGCSE syllabus with exam prep", tier: "SECONDARY", category: "Mathematics", difficulty: "INTERMEDIATE", priceInKobo: 150000, modules: [
      { title: "Algebra & Functions", content: "Linear and quadratic equations, inequalities, functions, graphs, sequences and series." },
      { title: "Geometry & Trigonometry", content: "Angles, circles, transformations, vectors, and trigonometric ratios." },
      { title: "Statistics & Probability", content: "Data handling, measures of central tendency, probability rules." },
    ]},
    { title: "WASSCE Complete Prep Bundle", slug: "wassce-complete-prep", description: "All-in-one WASSCE preparation covering Mathematics, English, Physics, Chemistry, and Biology.", shortDescription: "Comprehensive WAEC WASSCE exam preparation", tier: "SECONDARY", category: "Exam Preparation", difficulty: "INTERMEDIATE", priceInKobo: 450000, modules: [
      { title: "WASSCE Mathematics Core", content: "Number bases, modular arithmetic, fractions, ratios, percentages, commercial arithmetic." },
      { title: "WASSCE English Language", content: "Comprehension, summary, lexical/structural questions, oral English, essay writing." },
      { title: "WASSCE Sciences", content: "Physics, Chemistry, and Biology core topics with practical guides." },
      { title: "Mock Examinations", content: "Full-length WASSCE mocks under timed conditions with automated scoring." },
    ]},
    { title: "JAMB UTME Success Pack", slug: "jamb-utme-success", description: "Complete JAMB UTME preparation with subject-based learning and practice tests.", shortDescription: "Ace JAMB UTME with past questions & mocks", tier: "SECONDARY", category: "Exam Preparation", difficulty: "INTERMEDIATE", priceInKobo: 350000, modules: [
      { title: "JAMB Use of English", content: "Comprehension, lexis and structure, oral English, and writing skills." },
      { title: "JAMB Subject Mastery", content: "Core subjects: Mathematics, Physics, Chemistry, Biology, Government, Economics." },
      { title: "JAMB Past Questions", content: "Thousands of past questions from 2000-2024 with detailed explanations." },
    ]},
    { title: "Advanced Python Architecture", slug: "advanced-python-architecture", description: "Master advanced Python patterns, concurrency, and metaprogramming.", shortDescription: "Design patterns, async, metaprogramming", tier: "UNIVERSITY", category: "Computer Science", difficulty: "ADVANCED", priceInKobo: 450000, modules: [
      { title: "Design Patterns in Python", content: "Creational, structural, and behavioral patterns in modern Python." },
      { title: "Concurrency & Async", content: "Threading, multiprocessing, asyncio, concurrent.futures." },
      { title: "Metaprogramming & Internals", content: "Decorators, descriptors, metaclasses, AST manipulation." },
    ]},
    { title: "Venture Scaling & Growth Marketing", slug: "venture-scaling-growth", description: "Strategic frameworks for scaling startups and growth marketing.", shortDescription: "Scale your startup from $1M to $100M+", tier: "BUSINESS", category: "Entrepreneurship", difficulty: "ADVANCED", priceInKobo: 1200000, modules: [
      { title: "Scaling Frameworks", content: "Scaling operations, team building, and infrastructure post product-market fit." },
      { title: "Growth Marketing Systems", content: "Data-driven acquisition, retention loops, viral mechanics." },
      { title: "Financial Modeling & Fundraising", content: "Unit economics, fundraising strategy, cap table management." },
    ]},
  ]

  for (const cd of courseDefs) {
    const { modules, ...fields } = cd
    const course = await prisma.course.create({
      data: { ...fields, published: true, curriculumNodes: { create: modules.map((m, i) => ({ type: "MODULE", title: m.title, content: m.content, order: i, xpReward: (i + 1) * 50 })) } },
    })
    console.log(`  \u2713 Course: ${course.title}`)
  }

  // Exams, subjects, questions, resources
  for (const examDef of EXAMS) {
    const exam = await prisma.exam.create({ data: examDef })
    const subjectDefs = SUBJECTS[examDef.slug] || []

    for (const subDef of subjectDefs) {
      const subject = await prisma.subject.create({ data: { ...subDef, examId: exam.id } })
      const questions = QUESTIONS[subDef.slug] || []
      for (const q of questions) {
        await prisma.pastQuestion.create({
          data: { subjectId: subject.id, examId: exam.id, question: q.question, options: JSON.stringify(q.options), correctAnswer: q.correctAnswer, explanation: q.explanation, year: q.year, difficulty: q.difficulty },
        })
      }
    }

    const resources = RESOURCES[examDef.slug] || []
    for (const r of resources) {
      await prisma.studyResource.create({ data: { examId: exam.id, title: r.title, type: r.type, description: r.description, free: r.free } })
    }
    console.log(`  \u2713 Exam: ${examDef.name} (${subjectDefs.length} subjects, ${QUESTIONS[examDef.slug] ? Object.keys(QUESTIONS).filter(k => k.startsWith(examDef.slug)).reduce((a, k) => a + (QUESTIONS[k]?.length || 0), 0) : 0} questions)`)
  }

  // Enroll demo in secondary courses
  const igcseCourse = await prisma.course.findUnique({ where: { slug: "igcse-math-mastery" } })
  if (igcseCourse) await prisma.enrollment.create({ data: { userId: demo.id, courseId: igcseCourse.id, status: "ACTIVE" } })

  const wassceCourse = await prisma.course.findUnique({ where: { slug: "wassce-complete-prep" } })
  if (wassceCourse) await prisma.enrollment.create({ data: { userId: demo.id, courseId: wassceCourse.id, status: "ACTIVE" } })

  console.log("\n\u2705 Nerdhaven database seeded successfully!")
  console.log("   Admin: admin@nerdhaven.com / admin")
  console.log("   Demo:  demo@nerdhaven.com / admin")
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
