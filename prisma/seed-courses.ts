import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" })
const prisma = new PrismaClient({ adapter })

async function getOrCreateCourse(slug: string) {
  let course = await prisma.course.findUnique({ where: { slug } })
  if (!course) return null
  return course
}

async function main() {
  console.log("🌱 Seeding degree programs, resources, and curriculum...")

  // ── 1. UNIVERSITY DEGREE PROGRAMS ──

  const degreePrograms = [
    {
      title: "BSc Computer Science (4-Year Program)",
      slug: "bsc-computer-science",
      description:
        "A comprehensive 4-year bachelor's degree program covering algorithms, data structures, software engineering, AI, networks, and databases. Accredited curriculum aligned with global CS standards.",
      shortDescription: "Full 4-year BSc in Computer Science — algorithms to AI",
      tier: "UNIVERSITY",
      category: "DEGREE_BACHELORS",
      difficulty: "INTERMEDIATE",
      priceInKobo: 1200000,
      modules: [
        { title: "Year 1 — Foundations of Computing", content: "Introduction to Programming (Python), Discrete Mathematics, Computer Organization, Calculus I, Communication Skills." },
        { title: "Year 2 — Core CS Theory", content: "Data Structures & Algorithms, Object-Oriented Programming, Digital Logic Design, Linear Algebra, Probability & Statistics." },
        { title: "Year 3 — Advanced Topics", content: "Operating Systems, Database Systems, Computer Networks, Software Engineering, Theory of Computation." },
        { title: "Year 4 — Specialization & Capstone", content: "Artificial Intelligence, Machine Learning, Cybersecurity, Final Year Project, Industrial Internship." },
      ],
    },
    {
      title: "BSc Business Administration (4-Year Program)",
      slug: "bsc-business-administration",
      description:
        "A comprehensive 4-year bachelor's program in business administration covering management, finance, marketing, entrepreneurship, and organizational behavior.",
      shortDescription: "Full 4-year BSc in Business Administration",
      tier: "UNIVERSITY",
      category: "DEGREE_BACHELORS",
      difficulty: "INTERMEDIATE",
      priceInKobo: 1000000,
      modules: [
        { title: "Year 1 — Business Foundations", content: "Principles of Management, Microeconomics, Financial Accounting, Business Mathematics, Communication Skills." },
        { title: "Year 2 — Core Business", content: "Macroeconomics, Managerial Accounting, Marketing Principles, Organizational Behavior, Business Law." },
        { title: "Year 3 — Advanced Business", content: "Corporate Finance, Human Resource Management, Operations Management, Research Methods, International Business." },
        { title: "Year 4 — Strategy & Capstone", content: "Strategic Management, Entrepreneurship, Business Policy, Final Year Project, Industrial Attachment." },
      ],
    },
    {
      title: "MSc Data Science (18-Month Program)",
      slug: "msc-data-science",
      description:
        "An intensive 18-month master's degree program covering statistical modeling, machine learning, big data engineering, data visualization, and AI ethics.",
      shortDescription: "18-month MSc in Data Science — stats to deep learning",
      tier: "UNIVERSITY",
      category: "DEGREE_MASTERS",
      difficulty: "ADVANCED",
      priceInKobo: 1500000,
      modules: [
        { title: "Semester 1 — Foundations", content: "Advanced Statistics & Probability, Python for Data Science, SQL & Data Warehousing, Research Methods." },
        { title: "Semester 2 — Core Data Science", content: "Machine Learning, Big Data Engineering (Spark, Hadoop), Data Visualization (D3, Tableau), Natural Language Processing." },
        { title: "Semester 3 — Specialization & Thesis", content: "Deep Learning, MLOps, AI Ethics & Governance, Master's Thesis Project." },
      ],
    },
    {
      title: "Master of Business Administration (MBA)",
      slug: "mba",
      description:
        "A 12-month accelerated MBA program for experienced professionals covering strategic leadership, financial management, innovation, and global business strategy.",
      shortDescription: "12-month executive MBA — lead, innovate, scale",
      tier: "BUSINESS",
      category: "DEGREE_MASTERS",
      difficulty: "ADVANCED",
      priceInKobo: 2500000,
      modules: [
        { title: "Module 1 — Strategic Leadership", content: "Strategic Management, Leadership & Change, Organizational Design, Corporate Governance." },
        { title: "Module 2 — Finance & Operations", content: "Corporate Finance, Financial Modeling, Operations & Supply Chain, Managerial Economics." },
        { title: "Module 3 — Innovation & Growth", content: "Innovation Management, Digital Transformation, Growth Strategy, Mergers & Acquisitions." },
        { title: "Module 4 — Capstone & Practicum", content: "Business Simulation, Consulting Project, Executive Coaching, Global Business Immersion." },
      ],
    },
  ]

  for (const dp of degreePrograms) {
    const { modules, ...fields } = dp
    const existing = await prisma.course.findUnique({ where: { slug: dp.slug } })
    if (!existing) {
      await prisma.course.create({
        data: {
          ...fields,
          published: true,
          curriculumNodes: {
            create: modules.map((m, i) => ({
              type: "MODULE",
              title: m.title,
              content: m.content,
              order: i,
              xpReward: (i + 1) * 100,
            })),
          },
        },
      })
      console.log(`  ✅ Created: ${dp.title}`)
    } else {
      console.log(`  ⏭️  Skipped (exists): ${dp.title}`)
    }
  }

  // ── 2. ADD CURRICULUM CONTENT TO EXISTING COURSES ──
  // Adding detailed lessons under each course's modules

  const lessonDefs: { slug: string; moduleTitle: string; lessons: { title: string; content: string; type: string }[] }[] = [
    {
      slug: "primary-math-foundations",
      moduleTitle: "Number Sense",
      lessons: [
        { title: "Understanding Place Value", content: "Learn about units, tens, hundreds, and thousands. Practice breaking down numbers into their place values with interactive exercises.", type: "LESSON" },
        { title: "Counting Forward and Backward", content: "Master counting from 1 to 1000. Understand skip counting by 2s, 5s, and 10s.", type: "LESSON" },
        { title: "Comparing and Ordering Numbers", content: "Use greater than, less than, and equal to symbols. Order numbers from smallest to largest.", type: "LESSON" },
        { title: "Number Patterns Quiz", content: "Test your understanding of number patterns, sequences, and place value concepts.", type: "QUIZ" },
      ],
    },
    {
      slug: "primary-math-foundations",
      moduleTitle: "Basic Operations",
      lessons: [
        { title: "Addition Strategies", content: "Learn mental math strategies for addition: making tens, doubles, and near-doubles.", type: "LESSON" },
        { title: "Subtraction Techniques", content: "Understand subtraction as taking away and difference. Practice borrowing.", type: "LESSON" },
        { title: "Introduction to Multiplication", content: "Learn multiplication as repeated addition. Practice times tables 1-12.", type: "LESSON" },
        { title: "Division Fundamentals", content: "Understand division as sharing and grouping. Practice with remainders.", type: "LESSON" },
      ],
    },
    {
      slug: "advanced-python-architecture",
      moduleTitle: "Design Patterns in Python",
      lessons: [
        { title: "Singleton & Factory Patterns", content: "Deep dive into creational patterns. Implement thread-safe singletons and factory methods.", type: "LESSON" },
        { title: "Observer & Strategy Patterns", content: "Behavioral patterns for event-driven systems and interchangeable algorithms.", type: "LESSON" },
        { title: "Decorator & Adapter Patterns", content: "Structural patterns for extending functionality and bridging interfaces.", type: "LESSON" },
        { title: "Patterns in Practice — Code Review", content: "Real-world codebase refactoring using design patterns. Identify anti-patterns.", type: "ASSESSMENT" },
      ],
    },
    {
      slug: "venture-scaling-growth",
      moduleTitle: "Scaling Frameworks",
      lessons: [
        { title: "The Scaling Readiness Assessment", content: "Evaluate your startup's readiness to scale across 8 dimensions: product, team, operations, finance, sales, marketing, culture, and technology.", type: "LESSON" },
        { title: "Building Scalable Operations", content: "Systems, processes, and automation. Learn how to build operations that grow without proportional cost increases.", type: "LESSON" },
        { title: "The 80/20 Rule in Scaling", content: "Identify the 20% of efforts that drive 80% of growth. Focus resources on highest-impact activities.", type: "LESSON" },
      ],
    },
  ]

  for (const def of lessonDefs) {
    const course = await prisma.course.findUnique({ where: { slug: def.slug } })
    if (!course) continue
    const parentNode = await prisma.curriculumNode.findFirst({
      where: { courseId: course.id, title: def.moduleTitle, type: "MODULE" },
    })
    if (!parentNode) continue

    const existingChildren = await prisma.curriculumNode.count({
      where: { parentId: parentNode.id },
    })
    if (existingChildren > 0) {
      console.log(`  ⏭️  Lessons exist for ${def.slug} / ${def.moduleTitle}`)
      continue
    }

    for (let i = 0; i < def.lessons.length; i++) {
      const l = def.lessons[i]
      await prisma.curriculumNode.create({
        data: {
          courseId: course.id,
          parentId: parentNode.id,
          type: l.type,
          title: l.title,
          content: l.content,
          order: i,
          xpReward: l.type === "QUIZ" || l.type === "ASSESSMENT" ? 30 : 15,
        },
      })
    }
    console.log(`  ✅ Added ${def.lessons.length} lessons to ${def.slug} / ${def.moduleTitle}`)
  }

  // ── 3. RESOURCES FOR ALL COURSES ──

  interface ResourceDef {
    slug: string
    resources: { title: string; type: string; url: string; description: string; free: boolean }[]
  }

  const courseResources: ResourceDef[] = [
    {
      slug: "primary-math-foundations",
      resources: [
        { title: "Primary Math Workbook Vol. 1 (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f7g8h9i0j", description: "200+ pages of practice problems with answer keys for grades 1-3.", free: true },
        { title: "Counting Songs Compilation (Audio)", type: "AUDIO", url: "https://open.spotify.com/playlist/0primarymath", description: "Fun counting songs to help young learners memorize number sequences.", free: true },
        { title: "Multiplication Table Video Course", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLprimarymath", description: "Step-by-step video lessons for times tables 1-12 with practice quizzes.", free: false },
        { title: "Math Games for Kids (Interactive)", type: "NOTE", url: "https://www.mathplayground.com", description: "Curated list of the best interactive math games for primary students.", free: true },
        { title: "Primary Mathematics Complete Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1primaryguide", description: "Complete curriculum guide covering all primary math topics with examples.", free: false },
        { title: "Weekly Math Challenge Audio Series", type: "AUDIO", url: "https://podcasts.apple.com/podcast/primarymath", description: "Weekly audio challenges to build problem-solving skills.", free: true },
      ],
    },
    {
      slug: "igcse-math-mastery",
      resources: [
        { title: "IGCSE Mathematics 0580 Syllabus (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1igcsesyllabus", description: "Official Cambridge IGCSE Mathematics syllabus with learning objectives.", free: true },
        { title: "Algebra Masterclass Video Series", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLigcsemath", description: "Complete algebra coverage from linear equations to quadratic functions.", free: false },
        { title: "IGCSE Past Paper Walkthroughs (Audio)", type: "AUDIO", url: "https://open.spotify.com/show/igcsepastpapers", description: "Audio walkthroughs of past exam papers with examiner tips.", free: true },
        { title: "Formula Sheet & Cheat Codes (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1igcseformulas", description: "Quick reference sheet with all IGCSE math formulas and key concepts.", free: true },
        { title: "IGCSE Math Problem-Solving Course", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLigcsemath2", description: "Advanced problem-solving techniques for A* students.", free: false },
        { title: "Topical Past Questions Bank (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1igcsetopical", description: "Past questions organized by topic for focused practice.", free: true },
      ],
    },
    {
      slug: "wassce-complete-prep",
      resources: [
        { title: "WASSCE Mathematics Past Questions 2010-2024 (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1wasscemaths", description: "Complete collection of WASSCE mathematics past questions with marking schemes.", free: true },
        { title: "English Language Essay Writing Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1wassceenglish", description: "Comprehensive guide to WASSCE English essays with sample answers.", free: true },
        { title: "Physics Practical Video Demos", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLwasscephysics", description: "Step-by-step video demonstrations of WASSCE physics practical experiments.", free: false },
        { title: "WASSCE Oral English Practice (Audio)", type: "AUDIO", url: "https://open.spotify.com/show/wassceoral", description: "Audio exercises for WASSCE oral English test preparation.", free: true },
        { title: "Chemistry Reaction Summary Sheets (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1wasscechem", description: "Quick reference for all WASSCE chemistry reactions and equations.", free: true },
        { title: "Biology Diagrams & Labeling Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1wasscebio", description: "Essential biology diagrams with labeling exercises for WASSCE.", free: true },
        { title: "WASSCE Mock Exam Papers (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1wasscemocks", description: "Full mock examination papers simulating the actual WASSCE format.", free: false },
        { title: "Sciences Audio Revision Podcast", type: "AUDIO", url: "https://podcasts.apple.com/podcast/wasscesciences", description: "Audio revision series covering Physics, Chemistry, and Biology core topics.", free: true },
      ],
    },
    {
      slug: "jamb-utme-success",
      resources: [
        { title: "JAMB Use of English Past Questions (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1jambenglish", description: "20 years of JAMB Use of English past questions with detailed answers.", free: true },
        { title: "JAMB Mathematics Formula Sheet (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1jambmaths", description: "All formulas needed for JAMB mathematics with worked examples.", free: true },
        { title: "JAMB Physics Crash Course (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLjambphysics", description: "Complete JAMB physics video course covering all topics.", free: false },
        { title: "JAMB Chemistry Key Points (Audio)", type: "AUDIO", url: "https://open.spotify.com/show/jambchem", description: "Audio revision of key chemistry concepts for JAMB UTME.", free: true },
        { title: "JAMB Government & Economics Notes (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1jambgovt", description: "Comprehensive notes for JAMB Government and Economics.", free: true },
        { title: "JAMB Biology Quick Review (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1jambbiology", description: "Concise biology review with diagrams for last-minute revision.", free: true },
        { title: "JAMB UTME Mock Test Series", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLjambmocks", description: "Full mock test walkthroughs with time management tips.", free: false },
        { title: "JAMB Current Affairs Audio Brief", type: "AUDIO", url: "https://podcasts.apple.com/podcast/jambcurrent", description: "Monthly current affairs audio briefings for JAMB candidates.", free: true },
      ],
    },
    {
      slug: "advanced-python-architecture",
      resources: [
        { title: "Python Design Patterns Reference (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1pythondesignpatterns", description: "Complete reference for all Gang of Four design patterns implemented in Python.", free: true },
        { title: "Advanced Python Video Course", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLpythonadvanced", description: "In-depth video series on decorators, generators, context managers, and metaclasses.", free: false },
        { title: "Concurrency & Async Programming Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1pythonconcurrency", description: "Comprehensive guide to threading, multiprocessing, and asyncio patterns.", free: true },
        { title: "Python Architecture Podcast", type: "AUDIO", url: "https://open.spotify.com/show/pythonarch", description: "Weekly podcast on Python architecture patterns, anti-patterns, and best practices.", free: true },
        { title: "Metaprogramming Mastery (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1pythonmeta", description: "Deep dive into decorators, descriptors, metaclasses, and AST manipulation.", free: false },
        { title: "Real-World Python Code Reviews (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLpythoncodereview", description: "Code review sessions of real-world Python projects with refactoring tips.", free: true },
      ],
    },
    {
      slug: "venture-scaling-growth",
      resources: [
        { title: "Startup Scaling Playbook (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1scalingplaybook", description: "Step-by-step playbook for scaling from $1M to $100M ARR.", free: true },
        { title: "Growth Marketing Video Course", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLgrowthmarketing", description: "Complete growth marketing course covering acquisition, retention, and monetization.", free: false },
        { title: "Financial Modeling Templates (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1financialmodels", description: "Ready-to-use financial model templates for startups with instructions.", free: true },
        { title: "Founder Interview Podcast Series", type: "AUDIO", url: "https://open.spotify.com/show/founderinsights", description: "Interviews with founders who scaled from 0 to 1 and beyond.", free: true },
        { title: "Unit Economics Workbook (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1uniteconomics", description: "Interactive workbook for calculating and optimizing unit economics.", free: true },
        { title: "Fundraising Pitch Deck Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1pitchdeck", description: "Guide to building winning pitch decks with real examples from funded startups.", free: false },
        { title: "Scaling Operations Webinar Recording", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLscalingops", description: "Webinar series on building scalable operations and systems.", free: true },
      ],
    },
  ]

  for (const def of courseResources) {
    const course = await prisma.course.findUnique({ where: { slug: def.slug } })
    if (!course) { console.log(`  ⚠️ Course not found: ${def.slug}`); continue }

    const existingCount = await prisma.studyResource.count({ where: { courseId: course.id } })
    if (existingCount > 0) {
      console.log(`  ⏭️ Resources exist for ${def.slug} (${existingCount} already)`)
      continue
    }

    for (const r of def.resources) {
      await prisma.studyResource.create({
        data: {
          courseId: course.id,
          title: r.title,
          type: r.type,
          url: r.url,
          description: r.description,
          free: r.free,
          downloads: Math.floor(Math.random() * 500) + 50,
          duration: r.type === "VIDEO" ? Math.floor(Math.random() * 120) + 15 : r.type === "AUDIO" ? Math.floor(Math.random() * 30) + 5 : null,
          fileSize: r.type === "PDF" ? Math.floor(Math.random() * 5000) + 500 : null,
        },
      })
    }
    console.log(`  ✅ Added ${def.resources.length} resources to ${def.slug}`)
  }

  // ── 4. RESOURCES FOR DEGREE PROGRAMS ──

  const degreeResources: ResourceDef[] = [
    {
      slug: "bsc-computer-science",
      resources: [
        { title: "CS Degree Handbook & Curriculum Map (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1cshandbook", description: "Complete 4-year curriculum map with course descriptions and prerequisites.", free: true },
        { title: "Introduction to Programming Lecture Series (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLcs101", description: "Full lecture series on Python programming for CS freshmen.", free: false },
        { title: "Data Structures & Algorithms Visual Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1csdsalgo", description: "Visual explanations of all major data structures and algorithms with complexity analysis.", free: true },
        { title: "Computer Science Research Podcast", type: "AUDIO", url: "https://open.spotify.com/show/csresearch", description: "Weekly discussions on cutting-edge CS research papers and trends.", free: true },
        { title: "Operating Systems: Three Easy Pieces (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1csostep", description: "Free textbook covering OS concepts with practical exercises.", free: true },
        { title: "Machine Learning Crash Course (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLcsml", description: "Comprehensive ML course from fundamentals to neural networks.", free: false },
        { title: "CS Final Year Project Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1csproject", description: "Step-by-step guide for planning, executing, and presenting your capstone project.", free: true },
        { title: "Algorithmic Problem Solving (Audio)", type: "AUDIO", url: "https://open.spotify.com/show/csalgo", description: "Audio walkthroughs of algorithmic problems and competitive programming techniques.", free: true },
      ],
    },
    {
      slug: "bsc-business-administration",
      resources: [
        { title: "Business Administration Handbook (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1bizhandbook", description: "Complete program guide with course outlines and academic policies.", free: true },
        { title: "Financial Accounting Essentials (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLbizacct", description: "Video course covering financial accounting from basics to advanced topics.", free: false },
        { title: "Marketing Strategy Frameworks (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1bizmarketing", description: "Collection of strategic marketing frameworks with real-world case studies.", free: true },
        { title: "Business Law Lecture Recordings (Audio)", type: "AUDIO", url: "https://open.spotify.com/show/bizlaw", description: "Audio lectures on contract law, company law, and regulatory compliance.", free: true },
        { title: "Organizational Behavior Case Studies (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1bizob", description: "Real-world case studies on organizational behavior and management.", free: true },
        { title: "Strategic Management Video Series", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLbizstrategy", description: "In-depth strategic management course with industry examples.", free: false },
        { title: "Business Research Methods Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1bizresearch", description: "Guide to business research methods, data analysis, and academic writing.", free: true },
      ],
    },
    {
      slug: "msc-data-science",
      resources: [
        { title: "MSc Data Science Program Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mscdsguide", description: "Complete 18-month program structure with course descriptions.", free: true },
        { title: "Advanced Statistics for Data Science (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLmscstats", description: "Advanced statistics video lectures covering inference, Bayesian methods, and experimental design.", free: false },
        { title: "Machine Learning Algorithms Handbook (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mscmlhandbook", description: "Comprehensive handbook on all major ML algorithms with Python implementations.", free: true },
        { title: "Big Data Engineering with Spark (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLmscspark", description: "Hands-on video course on Apache Spark, Hadoop, and distributed data processing.", free: false },
        { title: "Data Science Ethics & Governance (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mscethics", description: "Essential reading on AI ethics, data privacy, and responsible ML.", free: true },
        { title: "Data Science Weekly Podcast", type: "AUDIO", url: "https://open.spotify.com/show/datascienceweekly", description: "Weekly podcast covering latest data science tools, techniques, and industry news.", free: true },
        { title: "Thesis Writing & Research Methods (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mscthesis", description: "Guide to writing your master's thesis with templates and examples.", free: true },
        { title: "Deep Learning Specialization Notes (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mscdlnotes", description: "Comprehensive notes on deep learning architectures, CNNs, RNNs, and transformers.", free: false },
      ],
    },
    {
      slug: "mba",
      resources: [
        { title: "MBA Program Handbook (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mbahandbook", description: "Complete MBA program overview with module descriptions and schedules.", free: true },
        { title: "Strategic Leadership Video Course", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLmba leadership", description: "Executive-level strategic leadership course with case studies from top CEOs.", free: false },
        { title: "Financial Modeling Mastery (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mbafinmodel", description: "Advanced financial modeling guide with Excel templates and exercises.", free: true },
        { title: "MBA Case Study Library (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mbacases", description: "Curated collection of MBA case studies from Harvard, Stanford, and INSEAD.", free: true },
        { title: "Executive Leadership Podcast", type: "AUDIO", url: "https://open.spotify.com/show/mbaleadership", description: "Interviews with global business leaders on leadership, strategy, and innovation.", free: true },
        { title: "Digital Transformation Strategy (Video)", type: "VIDEO", url: "https://www.youtube.com/playlist?list=PLmbadigital", description: "Video series on leading digital transformation in established organizations.", free: false },
        { title: "Mergers & Acquisitions Guide (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mbama", description: "Complete guide to M&A strategy, valuation, due diligence, and integration.", free: true },
        { title: "Global Business Immersion Readings (PDF)", type: "PDF", url: "https://drive.google.com/uc?export=download&id=1mbaglobal", description: "Readings on global business strategy, cross-cultural management, and international markets.", free: true },
      ],
    },
  ]

  for (const def of degreeResources) {
    const course = await prisma.course.findUnique({ where: { slug: def.slug } })
    if (!course) { console.log(`  ⚠️ Course not found: ${def.slug}`); continue }

    const existingCount = await prisma.studyResource.count({ where: { courseId: course.id } })
    if (existingCount > 0) {
      console.log(`  ⏭️ Resources exist for ${def.slug} (${existingCount} already)`)
      continue
    }

    for (const r of def.resources) {
      await prisma.studyResource.create({
        data: {
          courseId: course.id,
          title: r.title,
          type: r.type,
          url: r.url,
          description: r.description,
          free: r.free,
          downloads: Math.floor(Math.random() * 500) + 50,
          duration: r.type === "VIDEO" ? Math.floor(Math.random() * 120) + 15 : r.type === "AUDIO" ? Math.floor(Math.random() * 30) + 5 : null,
          fileSize: r.type === "PDF" ? Math.floor(Math.random() * 5000) + 500 : null,
        },
      })
    }
    console.log(`  ✅ Added ${def.resources.length} resources to ${def.slug}`)
  }

  console.log("")
  console.log("🎉 Seeding complete!")
  console.log("")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
