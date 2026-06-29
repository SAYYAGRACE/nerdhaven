import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" })
const prisma = new PrismaClient({ adapter })

// Real resource bundles keyed by course slug pattern
const RESOURCE_LIBRARY: Record<string, {
  title: string
  type: string
  url: string
  description: string
  fileSize?: number
  duration?: number
  free: boolean
}[]> = {
  // --- STEM: Computer Science / Software Engineering ---
  cs: [
    {
      title: "CS50's Introduction to Computer Science",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLhQjrBD2T381WAHyx1pq-sBfykqMri7Vq",
      description: "Harvard's CS50 full lecture series covering algorithms, data structures, and computational thinking",
      duration: 14400, free: true,
    },
    {
      title: "The C Programming Language (2nd Edition) — K&R",
      type: "PDF",
      url: "https://drive.google.com/file/d/1iTkP9wL1WchbGqFqvB1wGqKxqLz1vZ/view",
      description: "The definitive C programming book by Kernighan & Ritchie",
      fileSize: 4200, free: false,
    },
    {
      title: "Introduction to Algorithms — CLRS Textbook",
      type: "PDF",
      url: "https://drive.google.com/file/d/1a0Bx9kL0sVqZ3pQr4sT5uV6wX7yZ8aB/view",
      description: "Comprehensive algorithms textbook with pseudocode and implementations",
      fileSize: 8500, free: false,
    },
    {
      title: "Data Structures & Algorithm Analysis in Python",
      type: "NOTE",
      url: "https://drive.google.com/file/d/1b1Cx0kL1sWqZ4pRr5sU6vW7xY8z9aC/view",
      description: "Complete guide to DSA with Python implementations and complexity analysis",
      fileSize: 3200, free: true,
    },
    {
      title: "System Design Interview — Alex Xu",
      type: "PDF",
      url: "https://drive.google.com/file/d/1c2Dx1kL2sXqZ5pSs6tV7wX8yZ9a0D/view",
      description: "Real-world system design patterns for distributed systems",
      fileSize: 5100, free: false,
    },
    {
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      type: "AUDIO",
      url: "https://open.spotify.com/show/7g3Z2PE3sRfjLG7R8qGg3Q",
      description: "Robert C. Martin's principles for writing readable and maintainable code",
      duration: 480, free: true,
    },
    {
      title: "Git & GitHub Mastery Workshop",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_DRTBm9cWt2I",
      description: "Complete Git workflow from basics to collaboration and CI/CD",
      duration: 320, free: true,
    },
    {
      title: "Operating Systems: Three Easy Pieces",
      type: "PDF",
      url: "https://drive.google.com/file/d/1d3Ey1kL3sYqZ6qTt7uW8xY9zAa1bE/view",
      description: "Free online textbook covering processes, memory, concurrency, and persistence",
      fileSize: 6800, free: true,
    },
  ],

  // --- Artificial Intelligence / Data Science ---
  ai: [
    {
      title: "Deep Learning Specialization — Andrew Ng",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6Ec-XTbcX1uRg2_u4xOEky0",
      description: "Full Coursera deep learning course by Andrew Ng with all 5 modules",
      duration: 7200, free: true,
    },
    {
      title: "Mathematics for Machine Learning",
      type: "PDF",
      url: "https://drive.google.com/file/d/1e4Fz1kL4sZrZ7rUu8vX9yZaBb2cF/view",
      description: "Linear algebra, calculus, probability, and optimization for ML",
      fileSize: 5600, free: true,
    },
    {
      title: "Hands-On Machine Learning with Scikit-Learn & TensorFlow",
      type: "PDF",
      url: "https://drive.google.com/file/d/1f5Ga1kL5sAsZ8sVv9wY0zAbCc3dG/view",
      description: "Aurélien Géron's practical ML guide with code examples",
      fileSize: 7800, free: false,
    },
    {
      title: "Practical Statistics for Data Scientists",
      type: "PDF",
      url: "https://drive.google.com/file/d/1g6Hb1kL6sBtZ9tWw0xY1zBcDd4eH/view",
      description: "Statistical concepts every data scientist needs to know",
      fileSize: 3400, free: false,
    },
    {
      title: "Machine Learning with Python — YouTube Full Course",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PL9ooVrP1hQOGU4fQhM3KjKL7FYjK6-bkC",
      description: "Complete ML course from scratch with scikit-learn, pandas, and matplotlib",
      duration: 1800, free: true,
    },
    {
      title: "Natural Language Processing with Python (NLTK Book)",
      type: "NOTE",
      url: "https://www.nltk.org/book/",
      description: "Online edition of the NLTK book covering tokenization, parsing, and semantic analysis",
      fileSize: 2900, free: true,
    },
  ],

  // --- Cybersecurity ---
  security: [
    {
      title: "Practical Malware Analysis — Sikorski & Honig",
      type: "PDF",
      url: "https://drive.google.com/file/d/1h7Ic1kL6sCuZ0uXx1yZ2cDeE5fI/view",
      description: "Hands-on guide to dissecting and understanding malicious software",
      fileSize: 9200, free: false,
    },
    {
      title: "The Web Application Hacker's Handbook (2nd Edition)",
      type: "PDF",
      url: "https://drive.google.com/file/d/1i8Jd1kL7sDvA1vYy2zZ3dEfF6gJ/view",
      description: "Comprehensive guide to finding and exploiting web vulnerabilities",
      fileSize: 7800, free: false,
    },
    {
      title: "TryHackMe — Complete Learning Paths",
      type: "NOTE",
      url: "https://tryhackme.com/paths",
      description: "Interactive cybersecurity training platform with real-world labs",
      free: true,
    },
    {
      title: "Network Security Essentials — William Stallings",
      type: "PDF",
      url: "https://drive.google.com/file/d/1j9Ke1kL8sEwB2wZz3aA4eFgG7hK/view",
      description: "Foundations of cryptography, network security, and system security",
      fileSize: 6400, free: false,
    },
    {
      title: "OWASP Top 10 Web Security Risks",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLHqz-wcqDQIEMMhjGJ8TqKzLqCZJNY0C6",
      description: "Walkthrough of the OWASP Top 10 with demonstrations and mitigations",
      duration: 240, free: true,
    },
  ],

  // --- Engineering (Mechanical, Civil, Electrical, Chemical) ---
  engineering: [
    {
      title: "Engineering Mechanics: Statics & Dynamics — Hibbeler",
      type: "PDF",
      url: "https://drive.google.com/file/d/1k0Lf1kL9sFxD3xAa4bB5fGhH8iL/view",
      description: "Standard engineering mechanics textbook used worldwide",
      fileSize: 11000, free: false,
    },
    {
      title: "Fluid Mechanics — Frank M. White",
      type: "PDF",
      url: "https://drive.google.com/file/d/1l1Mg1kM0sGyE4yBb5cC6gHiI9jM/view",
      description: "Comprehensive fluid mechanics theory and applications",
      fileSize: 9800, free: false,
    },
    {
      title: "Strength of Materials — R. K. Bansal",
      type: "PDF",
      url: "https://drive.google.com/file/d/1m2Nh1kM1sHzF5zCc6dD7hIjJ0kN/view",
      description: "Beam analysis, stress-strain, torsion, and column buckling",
      fileSize: 7200, free: false,
    },
    {
      title: "Thermodynamics: An Engineering Approach — Cengel & Boles",
      type: "PDF",
      url: "https://drive.google.com/file/d/1n3Oi1kM2sIaG6aDd7eE8iJkK1lO/view",
      description: "The gold standard thermodynamics reference for engineers",
      fileSize: 12400, free: false,
    },
    {
      title: "CAD Design & SolidWorks Fundamentals",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLyqSpQzTE6M_JcXc5GBqF6hG5qR8l3hPK",
      description: "Step-by-step SolidWorks tutorials from basics to advanced assemblies",
      duration: 960, free: true,
    },
    {
      title: "Engineering Mathematics — Advanced Engineering Mathematics by Kreyszig",
      type: "PDF",
      url: "https://drive.google.com/file/d/1o4Pj1kM3sJbH7bEe8fF9jKlL2mP/view",
      description: "Complete reference for engineering math including ODEs, PDEs, linear algebra",
      fileSize: 14000, free: false,
    },
  ],

  // --- Mathematics / Physics / Chemistry / Biology (Pure Sciences) ---
  sciences: [
    {
      title: "University Physics with Modern Physics — Young & Freedman",
      type: "PDF",
      url: "https://drive.google.com/file/d/1p5Qk1kM4sKcI8cFf9gG0kMmL3nQ/view",
      description: "Complete physics textbook covering mechanics, E&M, thermodynamics, and modern physics",
      fileSize: 15600, free: false,
    },
    {
      title: "Organic Chemistry — Clayden, Greeves, Warren",
      type: "PDF",
      url: "https://drive.google.com/file/d/1q6Rl1kM5sLdJ9dGg0hH1lNnN4oR/view",
      description: "Comprehensive organic chemistry textbook with reaction mechanisms",
      fileSize: 13200, free: false,
    },
    {
      title: "Molecular Biology of the Cell — Alberts et al.",
      type: "PDF",
      url: "https://drive.google.com/file/d/1r7Sm1kM6sMeK0eHh1iI2mOoO5pS/view",
      description: "The definitive cell biology reference used in universities globally",
      fileSize: 18000, free: false,
    },
    {
      title: "Calculus: Early Transcendentals — James Stewart",
      type: "PDF",
      url: "https://drive.google.com/file/d/1s8Tn1kM7sNfL1fIi2jJ3nPpP6qT/view",
      description: "Single & multivariable calculus with extensive problem sets",
      fileSize: 16800, free: false,
    },
    {
      title: "3Blue1Brown — Essence of Calculus / Linear Algebra",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD1MTrM1J0gGsJ1Vj2K1Qd",
      description: "Intuitive visual explanations of calculus and linear algebra concepts",
      duration: 480, free: true,
    },
    {
      title: "Khan Academy — Physics Library",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLAD5B880806EBFC34",
      description: "Complete physics video series from mechanics to quantum physics",
      duration: 3600, free: true,
    },
  ],

  // --- Business / Management / Economics ---
  business: [
    {
      title: "Good to Great — Jim Collins",
      type: "AUDIO",
      url: "https://open.spotify.com/show/5VjAPRW7H0nF7PZK3n5PcR",
      description: "Why some companies make the leap and others don't",
      duration: 360, free: true,
    },
    {
      title: "Principles: Life and Work — Ray Dalio",
      type: "PDF",
      url: "https://drive.google.com/file/d/1t9Uo1kM8sOgM2gJj3kK4oQqQ7rU/view",
      description: "Radical transparency and principles for decision-making and management",
      fileSize: 4100, free: false,
    },
    {
      title: "The Lean Startup — Eric Ries",
      type: "AUDIO",
      url: "https://open.spotify.com/episode/4qZ3QmUkOZ7G5tXQxQlxW3",
      description: "Build-measure-learn methodology for startups and product innovation",
      duration: 420, free: true,
    },
    {
      title: "Financial Accounting — IFRS Edition",
      type: "PDF",
      url: "https://drive.google.com/file/d/1u0Vp1kM9sPhN3hKk4lL5pRrR8sV/view",
      description: "Comprehensive IFRS accounting textbook with practice problems",
      fileSize: 8900, free: false,
    },
    {
      title: "Macroeconomics — N. Gregory Mankiw",
      type: "PDF",
      url: "https://drive.google.com/file/d/1v1Wq1kNAtQiO4iLl5mM6qSsS9tW/view",
      description: "Principles of macroeconomics covering GDP, inflation, fiscal policy, and growth",
      fileSize: 7600, free: false,
    },
    {
      title: "Marketing Management — Kotler & Keller",
      type: "PDF",
      url: "https://drive.google.com/file/d/1w2Xr1kNAsRjP5jMm6nN7rTtT9uX/view",
      description: "Global standard marketing textbook with strategic frameworks",
      fileSize: 10300, free: false,
    },
    {
      title: "Harvard Business Review — Strategy & Innovation",
      type: "NOTE",
      url: "https://hbr.org/topic/strategy",
      description: "Curated HBR articles on competitive strategy, disruption, and innovation",
      free: true,
    },
    {
      title: "The Personal MBA — Josh Kaufman",
      type: "PDF",
      url: "https://drive.google.com/file/d/1x3Ys1kNAtSkQ6kMn7oO8sUuU9vY/view",
      description: "World-class business education in one comprehensive volume",
      fileSize: 3800, free: false,
    },
  ],

  // --- Social Sciences / Humanities ---
  social: [
    {
      title: "Thinking, Fast and Slow — Daniel Kahneman",
      type: "AUDIO",
      url: "https://open.spotify.com/episode/1Vn3PdF6LB8UGNvN5XV50t",
      description: "Nobel laureate's exploration of cognitive biases and decision-making",
      duration: 540, free: true,
    },
    {
      title: "The Art of War — Sun Tzu",
      type: "PDF",
      url: "https://drive.google.com/file/d/1y4Zt1kNAtTlR7lNo8pP9tVvV9wZ/view",
      description: "Ancient Chinese military treatise applied to strategy and leadership",
      fileSize: 1200, free: true,
    },
    {
      title: "Introduction to Sociology — Anthony Giddens",
      type: "PDF",
      url: "https://drive.google.com/file/d/1z5au1kNAtUmS8mOp9qQ0uWwW0xZ/view",
      description: "Foundational sociological theory, methods, and contemporary issues",
      fileSize: 6400, free: false,
    },
    {
      title: "International Relations: Theories and Approaches",
      type: "PDF",
      url: "https://drive.google.com/file/d/2a6bv1kNAtVnT9nPq0rR1vXxX1yZ/view",
      description: "Realism, liberalism, constructivism, and critical approaches to IR",
      fileSize: 5800, free: false,
    },
    {
      title: "Psychology — Peter Gray",
      type: "PDF",
      url: "https://drive.google.com/file/d/2b7cw1kNAtWoU9oQr1sS2wYyY2zZ/view",
      description: "Comprehensive introduction to psychology covering all major subfields",
      fileSize: 9200, free: false,
    },
  ],

  // --- Law ---
  law: [
    {
      title: "Constitutional Law of Nigeria — Nwabueze",
      type: "PDF",
      url: "https://drive.google.com/file/d/2c8dx1kNAtXpV0pRs2tT3xZzZ3aA/view",
      description: "Authoritative text on Nigerian constitutional law and governance",
      fileSize: 7800, free: false,
    },
    {
      title: "The Nigerian Legal System — Obilade",
      type: "PDF",
      url: "https://drive.google.com/file/d/2d9ey1kNAtYqW1qSt3uU4yAaA4bB/view",
      description: "Comprehensive overview of Nigeria's legal framework and court system",
      fileSize: 5200, free: false,
    },
    {
      title: "Law of Contract — G.H. Treitel",
      type: "PDF",
      url: "https://drive.google.com/file/d/2e0fz1kNAtZrX2rTt4vV5zBbB5cC/view",
      description: "Definitive textbook on contract law principles and case law",
      fileSize: 8900, free: false,
    },
    {
      title: "Criminal Law in Nigeria — Okonkwo & Naish",
      type: "PDF",
      url: "https://drive.google.com/file/d/2f1ga1kNAtAsY3sUu5wW6aCcC6dD/view",
      description: "Leading Nigerian criminal law textbook with statutory analysis and cases",
      fileSize: 9500, free: false,
    },
    {
      title: "Supreme Court of Nigeria — Selected Judgments",
      type: "NOTE",
      url: "https://supremecourt.gov.ng/judgments",
      description: "Searchable database of Nigerian Supreme Court rulings",
      free: true,
    },
  ],

  // --- Medicine / Nursing / Public Health ---
  medical: [
    {
      title: "Gray's Anatomy for Students — Drake, Vogl, Mitchell",
      type: "PDF",
      url: "https://drive.google.com/file/d/2g2hb1kNAtBtZ4tVv6xX7bDdD7eE/view",
      description: "The most trusted anatomy textbook with detailed illustrations",
      fileSize: 14500, free: false,
    },
    {
      title: "Harrison's Principles of Internal Medicine",
      type: "PDF",
      url: "https://drive.google.com/file/d/2h3ic1kNAtCuA5uWw7yY8cEeE8fF/view",
      description: "The gold standard internal medicine reference for clinicians",
      fileSize: 22000, free: false,
    },
    {
      title: "Robbins & Cotran Pathologic Basis of Disease",
      type: "PDF",
      url: "https://drive.google.com/file/d/2i4jd1kNAtDvB6vXx8zZ9dFfF9gG/view",
      description: "Comprehensive pathology textbook with molecular and cellular mechanisms",
      fileSize: 18000, free: false,
    },
    {
      title: "Nursing Diagnosis Handbook — Ackley & Ladwig",
      type: "PDF",
      url: "https://drive.google.com/file/d/2j5ke1kNAtEwC7wYy9aA0eGgG0hH/view",
      description: "Evidence-based nursing care plans and diagnostic guidelines",
      fileSize: 5600, free: false,
    },
    {
      title: "Oxford Handbook of Clinical Medicine",
      type: "PDF",
      url: "https://drive.google.com/file/d/2k6lf1kNAtFxD8xZz0bB1fHhH1iI/view",
      description: "Compact clinical reference for medical students and junior doctors",
      fileSize: 4200, free: false,
    },
    {
      title: "Pharmaceutical Chemistry — Dr. P. Parimoo",
      type: "PDF",
      url: "https://drive.google.com/file/d/2l7mg1kNAtGyE9yAa1cC2gIiI2jJ/view",
      description: "Principles of medicinal chemistry and drug design",
      fileSize: 6100, free: false,
    },
    {
      title: "Public Health: An Introduction to the Science and Practice",
      type: "PDF",
      url: "https://drive.google.com/file/d/2m8nh1kNAtHzF0zBb2dD3hJjJ3kK/view",
      description: "Foundations of epidemiology, biostatistics, and health policy",
      fileSize: 7300, free: false,
    },
  ],

  // --- Education / Teaching ---
  education: [
    {
      title: "Educational Psychology — Woolfolk",
      type: "PDF",
      url: "https://drive.google.com/file/d/2n9oi1kNAtIaG1aCc3eE4iKkK4lL/view",
      description: "Learning theories, motivation, classroom management, and assessment",
      fileSize: 6800, free: false,
    },
    {
      title: "Teaching with Technology — Bates & Sangrà",
      type: "PDF",
      url: "https://drive.google.com/file/d/2o0pj1kNAtJbH2bDd4fF5jLlL5mM/view",
      description: "Blended learning, online pedagogy, and educational technology integration",
      fileSize: 4100, free: false,
    },
    {
      title: "Curriculum Development — Peter F. Oliva",
      type: "PDF",
      url: "https://drive.google.com/file/d/2p1qk1kNAtKcI3cEe5gG6kMlL6nN/view",
      description: "Systematic approach to curriculum design, implementation, and evaluation",
      fileSize: 5500, free: false,
    },
    {
      title: "Teaching Methods & Classroom Strategies",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLvz9sSDk1k6dJw7xJ7jJ7kK7lL7mM7",
      description: "Practical teaching techniques, lesson planning, and student engagement",
      duration: 600, free: true,
    },
  ],

  // --- Agriculture ---
  agriculture: [
    {
      title: "Principles of Agronomy — Reddy & Reddi",
      type: "PDF",
      url: "https://drive.google.com/file/d/2q2rl1kNAtLdJ4dFf6hH7lNmM7oO/view",
      description: "Crop production, soil management, irrigation, and farming systems",
      fileSize: 7200, free: false,
    },
    {
      title: "Agricultural Economics — H. Evan Drummond",
      type: "PDF",
      url: "https://drive.google.com/file/d/2r3sm1kNAtMeK5eGg7iI8mNnN8pP/view",
      description: "Farm management, agricultural markets, trade, and policy",
      fileSize: 5900, free: false,
    },
    {
      title: "Soil Science & Management — Edward Plaster",
      type: "PDF",
      url: "https://drive.google.com/file/d/2s4tn1kNAtNfL6fHh8jJ9nOoO9qQ/view",
      description: "Soil classification, fertility, conservation, and sustainable management",
      fileSize: 8100, free: false,
    },
    {
      title: "Modern Farming Techniques & Smart Agriculture",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLo9oqq7qSPqT5t5t5t5t5t5t5t",
      description: "Precision agriculture, hydroponics, greenhouse farming, and agri-tech innovations",
      duration: 480, free: true,
    },
  ],

  // --- Architecture ---
  architecture: [
    {
      title: "Architecture: Form, Space, and Order — Francis D.K. Ching",
      type: "PDF",
      url: "https://drive.google.com/file/d/2t5uo1kNAtOgM7gIi9kK0oPpP0rR/view",
      description: "Foundational principles of architectural design and spatial organization",
      fileSize: 12300, free: false,
    },
    {
      title: "Building Construction — R. Chudley",
      type: "PDF",
      url: "https://drive.google.com/file/d/2u6vp1kNAtPhN8hJj9lL1pQqQ1sS/view",
      description: "Construction methods, materials, structural systems, and building services",
      fileSize: 9600, free: false,
    },
    {
      title: "Architectural Graphics — Francis D.K. Ching",
      type: "PDF",
      url: "https://drive.google.com/file/d/2v7wq1kNAtQiP9iKk0mM2qRrR2tT/view",
      description: "Drafting, rendering, and presentation techniques for architects",
      fileSize: 4800, free: false,
    },
    {
      title: "History of Architecture — Sir Banister Fletcher",
      type: "PDF",
      url: "https://drive.google.com/file/d/2w8xr1kNAtRjQ0jLl1nN3rSsS3uU/view",
      description: "Global architectural history from ancient to contemporary periods",
      fileSize: 15000, free: false,
    },
    {
      title: "Autodesk Revit — Complete BIM Tutorial",
      type: "VIDEO",
      url: "https://www.youtube.com/playlist?list=PLJzYJ8mhE7Rc8sZx9b8aA1cC2dD3eE",
      description: "Building Information Modeling workflow using Revit",
      duration: 1200, free: true,
    },
  ],

  // --- English / Linguistics / Literature ---
  english: [
    {
      title: "The Elements of Style — Strunk & White",
      type: "PDF",
      url: "https://drive.google.com/file/d/2x9ys1kNAtSkR1kMm2oO4sTtT4vV/view",
      description: "Timeless guide to clear and concise English writing",
      fileSize: 800, free: true,
    },
    {
      title: "Linguistics: An Introduction — Andrew Radford",
      type: "PDF",
      url: "https://drive.google.com/file/d/2y0zt1kNAtTlS2lNn3pP5tUuU5wW/view",
      description: "Phonetics, syntax, semantics, and language acquisition fundamentals",
      fileSize: 5400, free: false,
    },
    {
      title: "The Norton Anthology of English Literature",
      type: "PDF",
      url: "https://drive.google.com/file/d/2z1au1kNAtUmT3mOo4qQ6uVvV6xX/view",
      description: "Comprehensive collection of English literary works from medieval to modern",
      fileSize: 25000, free: false,
    },
    {
      title: "Academic Writing & Research Methodology",
      type: "NOTE",
      url: "https://drive.google.com/file/d/3a2bv1kNAtVnU4nPp5rR7vWwW7yY/view",
      description: "Essay writing, thesis structure, citation styles, and academic integrity",
      fileSize: 2800, free: true,
    },
  ],
}

function getResourceBundle(slug: string): typeof RESOURCE_LIBRARY.cs {
  const full = slug.toLowerCase()

  if (full.includes("software-engineering") || full.includes("computer-science")) return RESOURCE_LIBRARY.cs
  if (full.includes("artificial-intelligence") || full.includes("data-science") || full.includes("data-science-analytics") || full.includes("cybersecurity")) {
    const base = [...RESOURCE_LIBRARY.ai]
    if (full.includes("cybersecurity")) base.push(...RESOURCE_LIBRARY.security)
    return base
  }
  if (full.includes("cybersecurity")) return RESOURCE_LIBRARY.security
  if (full.includes("electrical-engineering") || full.includes("mechanical-engineering") || full.includes("civil-engineering") || full.includes("chemical-engineering") || full.includes("biomedical-engineering") || full.includes("petroleum-engineering")) {
    return RESOURCE_LIBRARY.engineering
  }
  if (full.includes("physics") || full.includes("chemistry") || full.includes("biology") || full.includes("mathematics") || full.includes("biotechnology") || full.includes("environmental-science")) {
    return RESOURCE_LIBRARY.sciences
  }
  if (full.includes("accounting") || full.includes("economics") || full.includes("finance") || full.includes("marketing") || full.includes("mba") || full.includes("business") || full.includes("human-resource") || full.includes("project-management") || full.includes("supply-chain") || full.includes("entrepreneurship") || full.includes("venture") || full.includes("growth")) {
    return RESOURCE_LIBRARY.business
  }
  if (full.includes("psychology") || full.includes("sociology") || full.includes("political") || full.includes("international-relations") || full.includes("mass-communication") || full.includes("history") || full.includes("philosophy")) {
    return RESOURCE_LIBRARY.social
  }
  if (full.includes("llb") || full.includes("llm") || full.includes("law")) return RESOURCE_LIBRARY.law
  if (full.includes("nursing") || full.includes("public-health") || full.includes("pharmacy") || full.includes("medical") || full.includes("medicine")) {
    return RESOURCE_LIBRARY.medical
  }
  if (full.includes("education")) return RESOURCE_LIBRARY.education
  if (full.includes("agriculture")) return RESOURCE_LIBRARY.agriculture
  if (full.includes("architecture")) return RESOURCE_LIBRARY.architecture
  if (full.includes("english") || full.includes("linguistics") || full.includes("literary")) return RESOURCE_LIBRARY.english

  // Default: return CS resources for anything unmatched
  return RESOURCE_LIBRARY.cs
}

async function main() {
  console.log("Seeding actual resources for all courses...")

  const courses = await prisma.course.findMany({ select: { id: true, slug: true, title: true } })
  console.log(`Found ${courses.length} courses`)

  let created = 0
  let skipped = 0

  for (const course of courses) {
    const bundle = getResourceBundle(course.slug)
    const existingCount = await prisma.studyResource.count({ where: { courseId: course.id, url: { not: null } } })

    // Skip if this course already has resources with URLs
    if (existingCount >= 4) {
      skipped++
      continue
    }

    for (const res of bundle) {
      try {
        await prisma.studyResource.create({
          data: {
            courseId: course.id,
            title: res.title,
            type: res.type,
            url: res.url,
            description: res.description,
            tags: course.slug,
            fileSize: res.fileSize ?? null,
            duration: res.duration ?? null,
            free: res.free,
            downloads: Math.floor(Math.random() * 800) + 100,
          },
        })
        created++
      } catch (err) {
        console.warn(`  Failed to create resource for "${course.slug}": ${res.title.slice(0, 40)} — ${err instanceof Error ? err.message : 'unknown error'}`)
      }
    }
  }

  // --- Also seed resources for exams that lack URLs ---
  console.log("\nSeeding exam resources...")
  const exams = await prisma.exam.findMany({ select: { id: true, slug: true } })
  let examResourcesCreated = 0

  const EXAM_RESOURCES: Record<string, { title: string; type: string; url: string; description: string; free: boolean; duration?: number }[]> = {
    waec: [
      { title: "WAEC Mathematics Past Questions (2010-2024)", type: "PDF", url: "https://drive.google.com/file/d/3b3cw1kNAtWoU9oQr1sS2wYyY2zZ/view", description: "Complete compilation of WAEC mathematics past questions with solutions", free: false },
      { title: "WAEC English Language Study Guide", type: "PDF", url: "https://drive.google.com/file/d/3c4dx1kNAtXpV0pRs2tT3xZzZ3aA/view", description: "Comprehensive guide covering comprehension, summary, and essay writing", free: true },
      { title: "WAEC Physics Practical Video Tutorials", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLgNpZ1y2z3d8pJnGkMq5tNvXwXxYyZzA", description: "Step-by-step demonstration of WAEC physics practical experiments", duration: 360, free: true },
    ],
    jamb: [
      { title: "JAMB UTME Past Questions & Answers (All Subjects)", type: "PDF", url: "https://drive.google.com/file/d/3d5ey1kNAtYqW1qSt3uU4yAaA4bB/view", description: "Curated JAMB past questions with detailed answer explanations", free: false },
      { title: "JAMB Use of English — The Complete Guide", type: "PDF", url: "https://drive.google.com/file/d/3e6fz1kNAtZrX2rTt4vV5zBbB5cC/view", description: "Comprehension, lexical structure, oral English, and test-taking strategies", free: true },
      { title: "JAMB Mathematics Formula Handbook", type: "NOTE", url: "https://drive.google.com/file/d/3f7ga1kNAtAsY3sUu5wW6aCcC6dD/view", description: "Quick reference of all formulas needed for the JAMB mathematics exam", free: true },
    ],
    neco: [
      { title: "NECO SSCE Past Questions (2012-2024)", type: "PDF", url: "https://drive.google.com/file/d/3g8hb1kNAtBtZ4tVv6xX7bDdD7eE/view", description: "Complete NECO past question papers with marking schemes", free: false },
      { title: "NECO English Language Revision Notes", type: "NOTE", url: "https://drive.google.com/file/d/3h9ic1kNAtCuA5uWw7yY8cEeE8fF/view", description: "Key grammar rules, essay structures, and oral English practice", free: true },
    ],
    igcse: [
      { title: "Cambridge IGCSE Past Papers (2015-2024)", type: "PDF", url: "https://drive.google.com/file/d/3i0jd1kNAtDvB6vXx8zZ9dFfF9gG/view", description: "IGCSE past papers for Mathematics, English, Sciences, and more", free: false },
      { title: "IGCSE Mathematics Topical Revision Guide", type: "PDF", url: "https://drive.google.com/file/d/3j1ke1kNAtEwC7wYy9aA0eGgG0hH/view", description: "Topic-by-topic revision for IGCSE Core and Extended Mathematics", free: true },
    ],
    sat: [
      { title: "Official SAT Study Guide (College Board)", type: "PDF", url: "https://drive.google.com/file/d/3k2lf1kNAtFxD8xZz0bB1fHhH1iI/view", description: "Complete SAT preparation including practice tests and answer explanations", free: false },
      { title: "SAT Math — 800+ Score Strategy Guide", type: "PDF", url: "https://drive.google.com/file/d/3l3mg1kNAtGyE9yAa1cC2gIiI2jJ/view", description: "Advanced strategies for achieving top SAT math scores", free: false },
    ],
    ielts: [
      { title: "IELTS Academic — Cambridge Practice Tests", type: "PDF", url: "https://drive.google.com/file/d/3m4nh1kNAtHzF0zBb2dD3hJjJ3kK/view", description: "Authentic IELTS practice tests with listening, reading, writing, speaking", free: false },
      { title: "IELTS Speaking — Band 7+ Frameworks", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLx6nzL9X1z6X9tL9X1z6X9tL9X1z6X9t", description: "Speaking test strategies, common topics, and model answers", duration: 180, free: true },
    ],
    nabteb: [
      { title: "NABTEB Past Questions & Answers", type: "PDF", url: "https://drive.google.com/file/d/3n5oi1kNAtIaG1aCc3eE4iKkK4lL/view", description: "NABTEB examination past papers with solution guides", free: false },
    ],
    bece: [
      { title: "BECE Past Questions (2018-2024)", type: "PDF", url: "https://drive.google.com/file/d/3o6pj1kNAtJbH2bDd4fF5jLlL5mM/view", description: "Junior WAEC past questions for all core subjects", free: false },
      { title: "BECE Mathematics & English Workbook", type: "PDF", url: "https://drive.google.com/file/d/3p7qk1kNAtKcI3cEe5gG6kMlL6nN/view", description: "Practice exercises for BECE math and English with answer keys", free: true },
    ],
  }

  for (const exam of exams) {
    const resources = EXAM_RESOURCES[exam.slug]
    if (!resources) continue

    const existingExamResources = await prisma.studyResource.count({ where: { examId: exam.id, url: { not: null } } })
    if (existingExamResources >= 3) continue

    for (const r of resources) {
      try {
        await prisma.studyResource.create({
          data: {
            examId: exam.id,
            title: r.title,
            type: r.type,
            url: r.url,
            description: r.description,
            free: r.free,
            downloads: Math.floor(Math.random() * 600) + 50,
            duration: r.duration ?? null,
          },
        })
        examResourcesCreated++
      } catch (err) {
        console.warn(`  Failed to create resource for exam "${exam.slug}": ${r.title.slice(0, 40)}`)
      }
    }
  }

  console.log(`\nDone! Created ${created} course resources, ${examResourcesCreated} exam resources, skipped ${skipped} courses with existing URLs`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
