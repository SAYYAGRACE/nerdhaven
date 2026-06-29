import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" })
const prisma = new PrismaClient({ adapter })

interface ProgramDef {
  title: string
  slug: string
  description: string
  shortDescription: string
  tier: string
  category: string
  difficulty: string
  priceInKobo: number
  modules: { title: string; content: string }[]
  resources: { title: string; type: string; description: string; free: boolean }[]
}

const programs: ProgramDef[] = [
  // ─── COMPUTER SCIENCE & IT ───
  {
    title: "BSc Information Technology",
    slug: "bsc-information-technology",
    description: "A 4-year bachelor's program covering networking, databases, web technologies, IT project management, and systems administration.",
    shortDescription: "Networks, databases, web & IT infrastructure",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — IT Foundations", content: "Introduction to IT, Programming Fundamentals, Computer Hardware, Discrete Mathematics, Communication Skills." },
      { title: "Year 2 — Core IT", content: "Database Systems, Computer Networks, Web Development, Operating Systems, Object-Oriented Programming." },
      { title: "Year 3 — Advanced IT", content: "Network Security, Cloud Computing, IT Project Management, Human-Computer Interaction, Data Analytics." },
      { title: "Year 4 — Capstone & Internship", content: "Enterprise Architecture, IT Governance, Capstone Project, Industrial Training, Professional Ethics." },
    ],
    resources: [
      { title: "IT Essentials Handbook (PDF)", type: "PDF", description: "Complete guide to IT fundamentals with networking and hardware sections.", free: true },
      { title: "Network Security Video Course", type: "VIDEO", description: "Full video course on network security, firewalls, and ethical hacking.", free: false },
      { title: "Cloud Computing Architecture Guide (PDF)", type: "PDF", description: "AWS, Azure, and GCP architecture patterns and best practices.", free: true },
      { title: "IT Project Management Podcast", type: "AUDIO", description: "Weekly podcast on IT project management methodologies and case studies.", free: true },
    ],
  },
  {
    title: "BSc Software Engineering",
    slug: "bsc-software-engineering",
    description: "A 4-year bachelor's program focused on software design, development methodologies, testing, DevOps, and large-scale system architecture.",
    shortDescription: "Design, build & ship production software",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 1200000,
    modules: [
      { title: "Year 1 — Programming Core", content: "Introduction to Programming (Python), Object-Oriented Design, Calculus I, Digital Logic, Communication Skills." },
      { title: "Year 2 — Software Development", content: "Data Structures & Algorithms, Database Design, Web Development, Software Requirements, UI/UX Design." },
      { title: "Year 3 — Advanced Engineering", content: "Software Architecture, DevOps & CI/CD, Testing & QA, Mobile Development, Distributed Systems." },
      { title: "Year 4 — Capstone & Industry", content: "Enterprise Software Development, Cloud Native Architecture, Capstone Project, Internship, Tech Ethics." },
    ],
    resources: [
      { title: "Software Engineering Body of Knowledge (PDF)", type: "PDF", description: "SWEBOK guide covering all software engineering knowledge areas.", free: true },
      { title: "DevOps Masterclass Video Series", type: "VIDEO", description: "Complete DevOps course covering Docker, Kubernetes, Jenkins, and Terraform.", free: false },
      { title: "System Design Interview Guide (PDF)", type: "PDF", description: "Comprehensive system design patterns and interview preparation.", free: true },
      { title: "Clean Code Audio Book", type: "AUDIO", description: "Audio version of software engineering best practices and clean code principles.", free: true },
    ],
  },
  {
    title: "BSc Cybersecurity",
    slug: "bsc-cybersecurity",
    description: "A 4-year bachelor's program covering network security, cryptography, ethical hacking, digital forensics, and security governance.",
    shortDescription: "Defend networks, systems & data",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Year 1 — Computing Foundations", content: "Programming (Python), Computer Networks, Operating Systems, Mathematics for Security, Communication Skills." },
      { title: "Year 2 — Security Core", content: "Network Security, Cryptography, Web Security, Database Security, Introduction to Ethical Hacking." },
      { title: "Year 3 — Advanced Security", content: "Penetration Testing, Digital Forensics, Malware Analysis, Security Operations Center, Cloud Security." },
      { title: "Year 4 — Capstone & Certification", content: "Security Governance & Compliance, Capstone Project, Internship, CEH/CISSP Preparation." },
    ],
    resources: [
      { title: "Cybersecurity Fundamentals Guide (PDF)", type: "PDF", description: "Complete introduction to cybersecurity concepts and principles.", free: true },
      { title: "Ethical Hacking Lab Videos", type: "VIDEO", description: "Hands-on penetration testing labs with Kali Linux and Metasploit.", free: false },
      { title: "Digital Forensics Toolkit (PDF)", type: "PDF", description: "Guide to digital forensics tools, procedures, and chain of custody.", free: true },
      { title: "Security Weekly Podcast", type: "AUDIO", description: "Weekly cybersecurity news, breaches analysis, and expert interviews.", free: true },
    ],
  },
  {
    title: "BSc Artificial Intelligence",
    slug: "bsc-artificial-intelligence",
    description: "A 4-year bachelor's program specializing in machine learning, deep learning, natural language processing, computer vision, and AI ethics.",
    shortDescription: "ML, deep learning, NLP & computer vision",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1400000,
    modules: [
      { title: "Year 1 — Math & Programming", content: "Linear Algebra, Calculus, Python Programming, Discrete Mathematics, Introduction to AI." },
      { title: "Year 2 — AI Core", content: "Probability & Statistics, Data Structures, Machine Learning Fundamentals, Data Science, Database Systems." },
      { title: "Year 3 — Advanced AI", content: "Deep Learning, Natural Language Processing, Computer Vision, Reinforcement Learning, AI Ethics." },
      { title: "Year 4 — Specialization & Research", content: "Advanced ML, AI in Production, Capstone AI Project, Research Methods, Industrial Internship." },
    ],
    resources: [
      { title: "Deep Learning Specialization Notes (PDF)", type: "PDF", description: "Comprehensive notes on neural networks, CNNs, RNNs, and transformers.", free: true },
      { title: "Machine Learning Crash Course (Video)", type: "VIDEO", description: "Full video course on ML algorithms from regression to neural networks.", free: false },
      { title: "NLP with Transformers Guide (PDF)", type: "PDF", description: "Practical guide to NLP using BERT, GPT, and transformer architectures.", free: true },
      { title: "AI Research Paper Podcast", type: "AUDIO", description: "Weekly breakdown of important AI research papers and breakthroughs.", free: true },
    ],
  },
  {
    title: "BSc Data Science",
    slug: "bsc-data-science-ug",
    description: "A 4-year bachelor's program in data science covering statistics, machine learning, data engineering, visualization, and big data analytics.",
    shortDescription: "Statistics, ML, big data & visualization",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 1200000,
    modules: [
      { title: "Year 1 — Foundations", content: "Calculus, Linear Algebra, Python Programming, Introduction to Data Science, Communication Skills." },
      { title: "Year 2 — Core Data Science", content: "Probability & Statistics, Data Wrangling, SQL & Databases, Data Visualization, Machine Learning I." },
      { title: "Year 3 — Advanced Topics", content: "Machine Learning II, Big Data Technologies, Deep Learning, Time Series Analysis, Experimental Design." },
      { title: "Year 4 — Capstone & Industry", content: "Data Engineering at Scale, MLOps, Capstone Data Science Project, Internship, Ethics in Data." },
    ],
    resources: [
      { title: "Data Science from Scratch (PDF)", type: "PDF", description: "Complete data science fundamentals with Python implementations.", free: true },
      { title: "Big Data with Spark Video Course", type: "VIDEO", description: "Hands-on Spark, Hadoop, and distributed computing video series.", free: false },
      { title: "Statistical Learning Guide (PDF)", type: "PDF", description: "Introduction to statistical learning methods with R/Python examples.", free: true },
      { title: "Data Engineering Weekly Podcast", type: "AUDIO", description: "Data engineering best practices, tools, and architecture discussions.", free: true },
    ],
  },
  {
    title: "MSc Artificial Intelligence",
    slug: "msc-artificial-intelligence",
    description: "An intensive 18-month master's program covering advanced machine learning, deep learning, AI research methods, and specialized AI applications.",
    shortDescription: "Advanced ML, DL research & AI applications",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1800000,
    modules: [
      { title: "Semester 1 — Advanced Foundations", content: "Advanced Machine Learning, Deep Learning Architectures, Research Methods, Bayesian Inference." },
      { title: "Semester 2 — Specialization", content: "Natural Language Processing, Computer Vision, Reinforcement Learning, AI Ethics & Policy." },
      { title: "Semester 3 — Thesis & Applications", content: "AI in Production, Advanced Topics (GANs, Transformers, Diffusion Models), Master's Thesis." },
    ],
    resources: [
      { title: "Advanced Deep Learning Textbook (PDF)", type: "PDF", description: "Graduate-level deep learning covering advanced architectures and theory.", free: true },
      { title: "Reinforcement Learning Video Series", type: "VIDEO", description: "Complete RL course from MDPs to policy gradients and multi-agent systems.", free: false },
      { title: "AI Research Methods Guide (PDF)", type: "PDF", description: "Systematic approaches to AI research, experimentation, and publication.", free: true },
      { title: "AI in Industry Podcast", type: "AUDIO", description: "Interviews with AI leaders on deploying ML systems in production.", free: true },
    ],
  },
  {
    title: "MSc Cybersecurity",
    slug: "msc-cybersecurity",
    description: "An 18-month master's program in advanced cybersecurity covering threat intelligence, exploit development, security architecture, and cyber operations.",
    shortDescription: "Threat intel, exploit dev & security architecture",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1700000,
    modules: [
      { title: "Semester 1 — Advanced Security", content: "Advanced Network Security, Cryptography & Protocol Analysis, Malware Analysis & Reverse Engineering, Research Methods." },
      { title: "Semester 2 — Specialization", content: "Threat Intelligence, Exploit Development, Cloud Security Architecture, Cyber Operations & Forensics." },
      { title: "Semester 3 — Thesis & Practicum", content: "Security Leadership & Governance, Advanced Topics (Zero Trust, AI Security), Master's Thesis." },
    ],
    resources: [
      { title: "Advanced Malware Analysis Guide (PDF)", type: "PDF", description: "Reverse engineering and malware analysis techniques and tools.", free: true },
      { title: "Exploit Development Video Course", type: "VIDEO", description: "Buffer overflows, ROP chains, and advanced exploit techniques.", free: false },
      { title: "Threat Intelligence Framework (PDF)", type: "PDF", description: "Structured threat intelligence methodologies and frameworks.", free: true },
      { title: "Cyber Security Today Podcast", type: "AUDIO", description: "Daily cybersecurity news and deep dives into major incidents.", free: true },
    ],
  },
  {
    title: "MSc Software Engineering",
    slug: "msc-software-engineering",
    description: "An 18-month master's program in advanced software engineering focusing on distributed systems, software architecture, and engineering leadership.",
    shortDescription: "Distributed systems, architecture & tech leadership",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1600000,
    modules: [
      { title: "Semester 1 — Advanced Engineering", content: "Advanced Software Architecture, Distributed Systems, Advanced DevOps, Research Methods in SE." },
      { title: "Semester 2 — Leadership & Scale", content: "Technical Leadership, Site Reliability Engineering, Advanced Testing & Formal Methods, Cloud Native Patterns." },
      { title: "Semester 3 — Capstone & Thesis", content: "Software Engineering at Scale, Emerging Technologies, Master's Thesis or Capstone Project." },
    ],
    resources: [
      { title: "Distributed Systems Design (PDF)", type: "PDF", description: "Comprehensive guide to distributed systems patterns and protocols.", free: true },
      { title: "Site Reliability Engineering Video Series", type: "VIDEO", description: "SRE principles, SLIs/SLOs, incident response, and production engineering.", free: false },
      { title: "Software Architecture Handbook (PDF)", type: "PDF", description: "Enterprise architecture patterns, microservices, and event-driven design.", free: true },
      { title: "Engineering Leadership Podcast", type: "AUDIO", description: "Interviews with CTOs and engineering VPs on leading technical organizations.", free: true },
    ],
  },

  // ─── ENGINEERING ───
  {
    title: "BSc Electrical Engineering",
    slug: "bsc-electrical-engineering",
    description: "A 4-year bachelor's program in electrical engineering covering circuit theory, power systems, electronics, control systems, and signal processing.",
    shortDescription: "Circuits, power, electronics & control",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Engineering Foundations", content: "Engineering Mathematics, Physics for Engineers, Programming (C/C++), Engineering Drawing, Communication Skills." },
      { title: "Year 2 — Core Electrical", content: "Circuit Analysis, Electronics I, Electromagnetics, Digital Logic Design, Engineering Mechanics." },
      { title: "Year 3 — Advanced Electrical", content: "Power Systems, Control Systems, Signal Processing, Microprocessors, Electrical Machines." },
      { title: "Year 4 — Capstone & Specialization", content: "Power Electronics, Renewable Energy Systems, Capstone Project, Industrial Training, Professional Ethics." },
    ],
    resources: [
      { title: "Electrical Engineering Fundamentals (PDF)", type: "PDF", description: "Complete guide to circuit analysis, electronics, and power systems.", free: true },
      { title: "Control Systems Video Course", type: "VIDEO", description: "Full video course on control theory, PID controllers, and state-space analysis.", free: false },
      { title: "Power Systems Analysis Guide (PDF)", type: "PDF", description: "Power generation, transmission, distribution, and protection systems.", free: true },
      { title: "Embedded Systems Podcast", type: "AUDIO", description: "Discussions on embedded systems design, microcontrollers, and IoT.", free: true },
    ],
  },
  {
    title: "BSc Mechanical Engineering",
    slug: "bsc-mechanical-engineering",
    description: "A 4-year bachelor's program in mechanical engineering covering thermodynamics, fluid mechanics, solid mechanics, manufacturing, and CAD/CAM.",
    shortDescription: "Thermodynamics, fluids, mechanics & CAD",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Foundations", content: "Engineering Mathematics, Physics, Chemistry, Engineering Drawing, Programming Basics." },
      { title: "Year 2 — Core Mechanical", content: "Thermodynamics, Fluid Mechanics, Solid Mechanics, Materials Science, Manufacturing Processes." },
      { title: "Year 3 — Advanced Topics", content: "Heat Transfer, Machine Design, CAD/CAM, Vibrations, Control Systems." },
      { title: "Year 4 — Capstone & Industry", content: "Finite Element Analysis, Renewable Energy, Capstone Project, Internship, Engineering Management." },
    ],
    resources: [
      { title: "Mechanical Engineering Handbook (PDF)", type: "PDF", description: "Comprehensive reference for thermodynamics, fluids, and mechanics.", free: true },
      { title: "CAD/CAM Video Tutorial Series", type: "VIDEO", description: "Hands-on SolidWorks and AutoCAD tutorials for mechanical design.", free: false },
      { title: "Finite Element Analysis Guide (PDF)", type: "PDF", description: "FEA theory and practical applications using ANSYS and Abaqus.", free: true },
      { title: "Manufacturing Engineering Podcast", type: "AUDIO", description: "Industry insights on manufacturing, automation, and supply chain.", free: true },
    ],
  },
  {
    title: "BSc Civil Engineering",
    slug: "bsc-civil-engineering",
    description: "A 4-year bachelor's program in civil engineering covering structural analysis, geotechnical engineering, transportation, water resources, and construction management.",
    shortDescription: "Structures, geotech, transport & water",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Foundations", content: "Engineering Mathematics, Physics, Chemistry, Engineering Surveying, Communication Skills." },
      { title: "Year 2 — Core Civil", content: "Structural Analysis I, Geotechnical Engineering, Fluid Mechanics, Building Materials, Engineering Geology." },
      { title: "Year 3 — Advanced Topics", content: "Structural Design (Steel/Concrete), Transportation Engineering, Water Resources, Construction Management." },
      { title: "Year 4 — Capstone & Practice", content: "Foundation Engineering, Environmental Engineering, Capstone Design Project, Internship, Professional Practice." },
    ],
    resources: [
      { title: "Structural Analysis Fundamentals (PDF)", type: "PDF", description: "Complete guide to structural analysis methods and design principles.", free: true },
      { title: "Construction Management Video Course", type: "VIDEO", description: "Project management, scheduling, and cost estimation for construction.", free: false },
      { title: "Geotechnical Engineering Guide (PDF)", type: "PDF", description: "Soil mechanics, foundation design, and geotechnical investigation methods.", free: true },
      { title: "Infrastructure Development Podcast", type: "AUDIO", description: "Discussions on civil infrastructure projects and engineering innovations.", free: true },
    ],
  },
  {
    title: "BSc Chemical Engineering",
    slug: "bsc-chemical-engineering",
    description: "A 4-year bachelor's program in chemical engineering covering process engineering, thermodynamics, reaction engineering, separation processes, and plant design.",
    shortDescription: "Process design, reactions & separation",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Foundations", content: "Engineering Mathematics, General Chemistry, Physics, Programming, Communication Skills." },
      { title: "Year 2 — Core Chemical", content: "Material & Energy Balances, Chemical Thermodynamics, Fluid Mechanics, Process Calculations." },
      { title: "Year 3 — Advanced Topics", content: "Heat & Mass Transfer, Reaction Engineering, Separation Processes, Process Control." },
      { title: "Year 4 — Capstone & Design", content: "Plant Design & Economics, Process Safety, Capstone Design Project, Internship, Environmental Engineering." },
    ],
    resources: [
      { title: "Chemical Engineering Design Guide (PDF)", type: "PDF", description: "Complete process design principles with equipment sizing and economics.", free: true },
      { title: "Process Safety Video Series", type: "VIDEO", description: "HAZOP, risk assessment, and process safety management fundamentals.", free: false },
      { title: "Reaction Engineering Textbook (PDF)", type: "PDF", description: "Kinetics, reactor design, and catalytic processes.", free: true },
      { title: "Chemical Engineering Podcast", type: "AUDIO", description: "Industry insights on process engineering, pharmaceuticals, and energy.", free: true },
    ],
  },
  {
    title: "BSc Biomedical Engineering",
    slug: "bsc-biomedical-engineering",
    description: "A 4-year bachelor's program combining engineering with medicine, covering biomaterials, medical devices, biomechanics, and clinical engineering.",
    shortDescription: "Engineering meets medicine & healthcare",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Year 1 — Foundations", content: "Engineering Mathematics, Biology for Engineers, Chemistry, Physics, Programming." },
      { title: "Year 2 — Core Biomedical", content: "Human Anatomy & Physiology, Biomaterials, Biomechanics, Circuit Analysis, Signals & Systems." },
      { title: "Year 3 — Advanced Topics", content: "Medical Imaging, Biosensors & Instrumentation, Rehabilitation Engineering, Tissue Engineering." },
      { title: "Year 4 — Capstone & Clinical", content: "Medical Device Design, Clinical Engineering, Capstone Project, Hospital Internship, Regulatory Affairs." },
    ],
    resources: [
      { title: "Biomedical Engineering Fundamentals (PDF)", type: "PDF", description: "Introduction to biomaterials, biomechanics, and medical devices.", free: true },
      { title: "Medical Imaging Video Course", type: "VIDEO", description: "MRI, CT, ultrasound, and X-ray imaging principles and applications.", free: false },
      { title: "Biosensor Design Guide (PDF)", type: "PDF", description: "Design and development of biosensors for medical diagnostics.", free: true },
      { title: "Biomedical Engineering Podcast", type: "AUDIO", description: "Latest innovations in medical devices, bioengineering, and healthcare tech.", free: true },
    ],
  },
  {
    title: "BSc Petroleum Engineering",
    slug: "bsc-petroleum-engineering",
    description: "A 4-year bachelor's program in petroleum engineering covering reservoir engineering, drilling, production, and petroleum geology.",
    shortDescription: "Reservoir, drilling & production engineering",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Year 1 — Foundations", content: "Engineering Mathematics, Geology, Chemistry, Physics, Programming for Engineers." },
      { title: "Year 2 — Core Petroleum", content: "Petroleum Geology, Fluid Mechanics, Thermodynamics, Reservoir Rock Properties, Drilling Engineering." },
      { title: "Year 3 — Advanced Topics", content: "Reservoir Engineering, Production Engineering, Well Logging, Petroleum Economics, Formation Evaluation." },
      { title: "Year 4 — Capstone & Industry", content: "Enhanced Oil Recovery, Natural Gas Engineering, Capstone Design, Industrial Training, Health Safety & Environment." },
    ],
    resources: [
      { title: "Petroleum Engineering Handbook (PDF)", type: "PDF", description: "Comprehensive reference for reservoir, drilling, and production engineering.", free: true },
      { title: "Drilling Engineering Video Series", type: "VIDEO", description: "Drilling operations, equipment, and well design principles.", free: false },
      { title: "Reservoir Simulation Guide (PDF)", type: "PDF", description: "Reservoir modeling and simulation techniques for oil and gas fields.", free: true },
      { title: "Energy Industry Podcast", type: "AUDIO", description: "Oil, gas, and renewable energy industry analysis and expert interviews.", free: true },
    ],
  },
  {
    title: "MSc Electrical Engineering",
    slug: "msc-electrical-engineering",
    description: "An 18-month master's program in advanced electrical engineering covering power systems, renewable energy, smart grids, and advanced control.",
    shortDescription: "Power systems, smart grids & renewable energy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Advanced Power Systems, Power Electronics, Advanced Control Theory, Research Methods." },
      { title: "Semester 2 — Specialization", content: "Smart Grids, Renewable Energy Integration, Electric Vehicle Technology, Power System Protection." },
      { title: "Semester 3 — Thesis", content: "Advanced Topics in Electrical Engineering, Master's Thesis Project, Seminar Series." },
    ],
    resources: [
      { title: "Smart Grid Technology Guide (PDF)", type: "PDF", description: "Advanced smart grid concepts, IoT integration, and grid modernization.", free: true },
      { title: "Power Electronics Video Course", type: "VIDEO", description: "Advanced power electronic converters, inverters, and motor drives.", free: false },
      { title: "Renewable Energy Systems Handbook (PDF)", type: "PDF", description: "Solar, wind, and hybrid renewable energy system design and analysis.", free: true },
      { title: "Energy Systems Podcast", type: "AUDIO", description: "Expert discussions on power systems, energy policy, and grid technology.", free: true },
    ],
  },
  {
    title: "MSc Mechanical Engineering",
    slug: "msc-mechanical-engineering",
    description: "An 18-month master's program in advanced mechanical engineering focusing on computational mechanics, advanced materials, and sustainable energy systems.",
    shortDescription: "Computational mechanics, advanced materials & energy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Computational Fluid Dynamics, Finite Element Analysis, Advanced Materials, Research Methods." },
      { title: "Semester 2 — Specialization", content: "Sustainable Energy Systems, Additive Manufacturing, Robotics & Mechatronics, Advanced Thermodynamics." },
      { title: "Semester 3 — Thesis", content: "Advanced Topics in Mechanical Engineering, Master's Thesis, Industrial Collaboration Project." },
    ],
    resources: [
      { title: "Computational Fluid Dynamics Guide (PDF)", type: "PDF", description: "CFD theory, meshing, solvers, and practical applications.", free: true },
      { title: "Additive Manufacturing Video Series", type: "VIDEO", description: "3D printing technologies, materials, and design for additive manufacturing.", free: false },
      { title: "Advanced Materials Science (PDF)", type: "PDF", description: "Nanomaterials, composites, smart materials, and material characterization.", free: true },
      { title: "Advanced Manufacturing Podcast", type: "AUDIO", description: "Industry 4.0, smart manufacturing, and advanced production technologies.", free: true },
    ],
  },
  {
    title: "MSc Civil Engineering",
    slug: "msc-civil-engineering",
    description: "An 18-month master's program in advanced civil engineering covering structural dynamics, sustainable infrastructure, and advanced construction methods.",
    shortDescription: "Structural dynamics, sustainable infrastructure",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Structural Dynamics, Advanced Geotechnical Engineering, Research Methods, Sustainable Design." },
      { title: "Semester 2 — Specialization", content: "Earthquake Engineering, Transportation Systems, Water Resources Management, Construction Innovation." },
      { title: "Semester 3 — Thesis", content: "Advanced Structural Analysis, Master's Thesis, Industry Research Project." },
    ],
    resources: [
      { title: "Structural Dynamics Handbook (PDF)", type: "PDF", description: "Dynamic analysis of structures, vibration, and seismic design.", free: true },
      { title: "Earthquake Engineering Video Course", type: "VIDEO", description: "Seismic analysis, base isolation, and retrofit techniques.", free: false },
      { title: "Sustainable Infrastructure Guide (PDF)", type: "PDF", description: "Green building, sustainable materials, and infrastructure resilience.", free: true },
      { title: "Infrastructure Podcast", type: "AUDIO", description: "Civil engineering projects, urban development, and infrastructure planning.", free: true },
    ],
  },

  // ─── SCIENCES ───
  {
    title: "BSc Physics",
    slug: "bsc-physics",
    description: "A 4-year bachelor's program in physics covering classical mechanics, electromagnetism, quantum physics, thermodynamics, and mathematical methods.",
    shortDescription: "Classical to quantum physics",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "General Physics I & II, Calculus I & II, Chemistry, Programming for Scientists." },
      { title: "Year 2 — Core Physics", content: "Classical Mechanics, Electromagnetism I, Mathematical Methods, Thermodynamics, Modern Physics." },
      { title: "Year 3 — Advanced Physics", content: "Quantum Mechanics I, Electromagnetism II, Statistical Mechanics, Optics, Computational Physics." },
      { title: "Year 4 — Specialization & Project", content: "Nuclear Physics, Solid State Physics, Research Project, Seminar, Internship." },
    ],
    resources: [
      { title: "University Physics Textbook (PDF)", type: "PDF", description: "Complete university physics reference covering all core topics.", free: true },
      { title: "Quantum Mechanics Video Lecture Series", type: "VIDEO", description: "Full quantum mechanics course from wave functions to perturbation theory.", free: false },
      { title: "Mathematical Methods for Physics (PDF)", type: "PDF", description: "Advanced mathematical techniques used in theoretical physics.", free: true },
      { title: "Physics Today Podcast", type: "AUDIO", description: "Latest discoveries and research in physics and related fields.", free: true },
    ],
  },
  {
    title: "BSc Chemistry",
    slug: "bsc-chemistry",
    description: "A 4-year bachelor's program in chemistry covering organic, inorganic, physical, analytical, and biochemistry with extensive laboratory training.",
    shortDescription: "Organic, inorganic, physical & analytical chem",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "General Chemistry I & II, Calculus, Physics, Biology, Communication Skills." },
      { title: "Year 2 — Core Chemistry", content: "Organic Chemistry I, Inorganic Chemistry, Analytical Chemistry, Physical Chemistry I." },
      { title: "Year 3 — Advanced Chemistry", content: "Organic Chemistry II, Physical Chemistry II, Spectroscopy, Polymer Chemistry, Environmental Chemistry." },
      { title: "Year 4 — Specialization & Research", content: "Advanced Topics (Medicinal/Nuclear Chem), Research Project, Seminar, Industrial Attachment." },
    ],
    resources: [
      { title: "Organic Chemistry Reaction Guide (PDF)", type: "PDF", description: "Complete reaction mechanisms and synthesis pathways for organic chemistry.", free: true },
      { title: "Analytical Chemistry Lab Techniques (Video)", type: "VIDEO", description: "Laboratory techniques including chromatography, spectroscopy, and titration.", free: false },
      { title: "Spectroscopy Interpretation Guide (PDF)", type: "PDF", description: "NMR, IR, UV-Vis, and mass spectrometry interpretation with examples.", free: true },
      { title: "Chemistry World Podcast", type: "AUDIO", description: "Chemistry research news, industry insights, and career advice.", free: true },
    ],
  },
  {
    title: "BSc Biology",
    slug: "bsc-biology",
    description: "A 4-year bachelor's program in biology covering cell biology, genetics, ecology, evolution, microbiology, and molecular biology.",
    shortDescription: "Cell biology, genetics, ecology & evolution",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "General Biology I & II, General Chemistry, Calculus, Physics, Communication Skills." },
      { title: "Year 2 — Core Biology", content: "Cell Biology, Genetics, Ecology, Evolutionary Biology, Biochemistry I." },
      { title: "Year 3 — Advanced Biology", content: "Molecular Biology, Microbiology, Plant Biology, Animal Physiology, Immunology." },
      { title: "Year 4 — Specialization & Research", content: "Conservation Biology, Biotechnology, Research Project, Field Course, Internship." },
    ],
    resources: [
      { title: "Molecular Biology of the Cell (PDF)", type: "PDF", description: "Comprehensive cell and molecular biology reference textbook.", free: true },
      { title: "Genetics Video Lecture Series", type: "VIDEO", description: "Mendelian genetics, genomics, and molecular genetics laboratory techniques.", free: false },
      { title: "Ecology Field Methods Guide (PDF)", type: "PDF", description: "Field sampling, data collection, and statistical analysis in ecology.", free: true },
      { title: "Biology Podcast", type: "AUDIO", description: "Biology research discoveries and scientific methodology discussions.", free: true },
    ],
  },
  {
    title: "BSc Mathematics",
    slug: "bsc-mathematics",
    description: "A 4-year bachelor's program in mathematics covering pure mathematics, applied mathematics, statistics, and computational mathematics.",
    shortDescription: "Pure math, applied math & statistics",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 800000,
    modules: [
      { title: "Year 1 — Foundations", content: "Calculus I & II, Linear Algebra, Introduction to Proofs, Programming, Communication Skills." },
      { title: "Year 2 — Core Mathematics", content: "Real Analysis, Abstract Algebra, Differential Equations, Probability, Vector Calculus." },
      { title: "Year 3 — Advanced Topics", content: "Complex Analysis, Topology, Numerical Analysis, Mathematical Modeling, Statistical Inference." },
      { title: "Year 4 — Specialization & Project", content: "Functional Analysis, Combinatorics, Research Project, Seminar, Internship." },
    ],
    resources: [
      { title: "Principles of Mathematical Analysis (PDF)", type: "PDF", description: "Classic analysis textbook covering real and complex analysis.", free: true },
      { title: "Abstract Algebra Video Course", type: "VIDEO", description: "Group theory, ring theory, and field theory with problem sessions.", free: false },
      { title: "Mathematical Modeling Guide (PDF)", type: "PDF", description: "Techniques for building and analyzing mathematical models.", free: true },
      { title: "Numberphile Podcast", type: "AUDIO", description: "Fascinating mathematical concepts explained by experts.", free: true },
    ],
  },
  {
    title: "BSc Biotechnology",
    slug: "bsc-biotechnology",
    description: "A 4-year bachelor's program in biotechnology covering genetic engineering, bioinformatics, fermentation technology, and bioprocess engineering.",
    shortDescription: "Genetic engineering, bioinformatics & bioprocessing",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Foundations", content: "Biology, Chemistry, Mathematics, Physics, Introduction to Biotechnology." },
      { title: "Year 2 — Core Biotechnology", content: "Biochemistry, Molecular Biology, Genetics, Microbiology, Cell Culture Techniques." },
      { title: "Year 3 — Advanced Topics", content: "Genetic Engineering, Bioinformatics, Fermentation Technology, Immunology, Enzyme Technology." },
      { title: "Year 4 — Capstone & Industry", content: "Bioprocess Engineering, Biopharmaceuticals, Capstone Project, Industrial Training, Bioethics." },
    ],
    resources: [
      { title: "Biotechnology Principles & Applications (PDF)", type: "PDF", description: "Comprehensive guide to biotechnology methods and applications.", free: true },
      { title: "Genetic Engineering Lab Video Series", type: "VIDEO", description: "CRISPR, gene cloning, and recombinant DNA technology demonstrations.", free: false },
      { title: "Bioinformatics Tools Guide (PDF)", type: "PDF", description: "Practical bioinformatics using Python, BLAST, and sequence analysis tools.", free: true },
      { title: "Biotech Innovation Podcast", type: "AUDIO", description: "Biotechnology industry trends, startup stories, and research breakthroughs.", free: true },
    ],
  },
  {
    title: "BSc Environmental Science",
    slug: "bsc-environmental-science",
    description: "A 4-year bachelor's program covering environmental chemistry, ecology, pollution control, climate change, and environmental management.",
    shortDescription: "Ecology, pollution, climate & management",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "Biology, Chemistry, Mathematics, Earth Science, Communication Skills." },
      { title: "Year 2 — Core Environmental", content: "Ecology, Environmental Chemistry, Geology, Atmospheric Science, Environmental Law." },
      { title: "Year 3 — Advanced Topics", content: "Pollution Control, Climate Change Science, Water Resources Management, Environmental Impact Assessment." },
      { title: "Year 4 — Capstone & Practice", content: "Environmental Modeling, Renewable Energy, Capstone Project, Field Work, Environmental Policy." },
    ],
    resources: [
      { title: "Environmental Science Handbook (PDF)", type: "PDF", description: "Comprehensive environmental science reference with case studies.", free: true },
      { title: "Climate Change Science Video Course", type: "VIDEO", description: "Climate modeling, impacts, and mitigation strategies.", free: false },
      { title: "Environmental Impact Assessment Guide (PDF)", type: "PDF", description: "EIA methodologies, procedures, and reporting standards.", free: true },
      { title: "Planet Earth Podcast", type: "AUDIO", description: "Environmental issues, conservation, and sustainability discussions.", free: true },
    ],
  },
  {
    title: "MSc Physics",
    slug: "msc-physics",
    description: "An 18-month master's program in advanced physics covering quantum field theory, particle physics, astrophysics, and condensed matter physics.",
    shortDescription: "Quantum field theory, particle & astrophysics",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Quantum Field Theory I, Advanced Classical Mechanics, Computational Physics, Research Methods." },
      { title: "Semester 2 — Specialization", content: "Particle Physics, Astrophysics, Condensed Matter Physics, Advanced Electrodynamics." },
      { title: "Semester 3 — Thesis", content: "Quantum Field Theory II, Advanced Topics, Master's Thesis, Seminar Presentation." },
    ],
    resources: [
      { title: "Quantum Field Theory Textbook (PDF)", type: "PDF", description: "Graduate-level QFT covering relativistic quantum mechanics and Feynman diagrams.", free: true },
      { title: "Astrophysics Video Lecture Series", type: "VIDEO", description: "Stellar evolution, cosmology, and galactic astrophysics.", free: false },
      { title: "Computational Physics Guide (PDF)", type: "PDF", description: "Numerical methods and simulations for physics research.", free: true },
      { title: "Physics World Podcast", type: "AUDIO", description: "Latest physics research news and interviews with leading physicists.", free: true },
    ],
  },
  {
    title: "MSc Chemistry",
    slug: "msc-chemistry",
    description: "An 18-month master's program in advanced chemistry covering synthetic chemistry, computational chemistry, and advanced analytical techniques.",
    shortDescription: "Synthetic, computational & analytical chemistry",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Advanced Organic Synthesis, Advanced Analytical Chemistry, Computational Chemistry, Research Methods." },
      { title: "Semester 2 — Specialization", content: "Medicinal Chemistry, Materials Chemistry, Supramolecular Chemistry, Advanced Spectroscopy." },
      { title: "Semester 3 — Thesis", content: "Advanced Topics in Chemistry, Master's Research Thesis, Laboratory Research Project." },
    ],
    resources: [
      { title: "Advanced Organic Synthesis Guide (PDF)", type: "PDF", description: "Retrosynthesis, stereoselective reactions, and total synthesis strategies.", free: true },
      { title: "Computational Chemistry Video Course", type: "VIDEO", description: "Molecular modeling, DFT calculations, and cheminformatics.", free: false },
      { title: "Advanced Analytical Techniques (PDF)", type: "PDF", description: "Mass spectrometry, NMR, X-ray crystallography, and surface analysis.", free: true },
      { title: "Chemistry Research Podcast", type: "AUDIO", description: "Cutting-edge chemistry research and industry applications.", free: true },
    ],
  },
  {
    title: "MSc Biology",
    slug: "msc-biology",
    description: "An 18-month master's program in advanced biology covering molecular biology, genomics, systems biology, and bioinformatics.",
    shortDescription: "Molecular biology, genomics & systems biology",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Semester 1 — Advanced Core", content: "Advanced Molecular Biology, Genomics & Proteomics, Research Methods, Biostatistics." },
      { title: "Semester 2 — Specialization", content: "Systems Biology, Developmental Biology, Neurobiology, Advanced Bioinformatics." },
      { title: "Semester 3 — Thesis", content: "Advanced Topics in Biology, Master's Research Thesis, Laboratory Rotation." },
    ],
    resources: [
      { title: "Genomics & Proteomics Handbook (PDF)", type: "PDF", description: "Next-gen sequencing, transcriptomics, and proteomics technologies.", free: true },
      { title: "Systems Biology Video Course", type: "VIDEO", description: "Network biology, dynamical systems, and computational modeling.", free: false },
      { title: "Bioinformatics Algorithms Guide (PDF)", type: "PDF", description: "Sequence alignment, phylogenetic analysis, and genome assembly.", free: true },
      { title: "Biology Research Podcast", type: "AUDIO", description: "Latest biology research and career insights for life scientists.", free: true },
    ],
  },

  // ─── BUSINESS & ECONOMICS ───
  {
    title: "BSc Accounting",
    slug: "bsc-accounting",
    description: "A 4-year bachelor's program in accounting covering financial accounting, management accounting, auditing, taxation, and corporate finance.",
    shortDescription: "Financial accounting, audit, tax & finance",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "Financial Accounting I, Microeconomics, Business Mathematics, Business Law, Communication Skills." },
      { title: "Year 2 — Core Accounting", content: "Financial Accounting II, Management Accounting, Macroeconomics, Company Law, Statistics." },
      { title: "Year 3 — Advanced Accounting", content: "Auditing, Taxation, Corporate Finance, Advanced Financial Accounting, Research Methods." },
      { title: "Year 4 — Professional & Capstone", content: "Advanced Auditing, Public Sector Accounting, Capstone Project, Internship, Ethics & Governance." },
    ],
    resources: [
      { title: "Financial Accounting Principles (PDF)", type: "PDF", description: "Complete guide to financial accounting under IFRS and GAAP.", free: true },
      { title: "Auditing Video Course", type: "VIDEO", description: "Audit procedures, risk assessment, and internal control evaluation.", free: false },
      { title: "Taxation Guide (PDF)", type: "PDF", description: "Corporate and personal taxation with practical computations.", free: true },
      { title: "Accounting Podcast", type: "AUDIO", description: "Accounting standards updates, career advice, and industry insights.", free: true },
    ],
  },
  {
    title: "BSc Economics",
    slug: "bsc-economics",
    description: "A 4-year bachelor's program in economics covering microeconomics, macroeconomics, econometrics, development economics, and international trade.",
    shortDescription: "Micro, macro, econometrics & development",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 850000,
    modules: [
      { title: "Year 1 — Foundations", content: "Principles of Economics, Calculus, Statistics, Political Science, Communication Skills." },
      { title: "Year 2 — Core Economics", content: "Microeconomics I, Macroeconomics I, Mathematics for Economists, Economic History." },
      { title: "Year 3 — Advanced Economics", content: "Microeconomics II, Macroeconomics II, Econometrics, Development Economics, International Trade." },
      { title: "Year 4 — Specialization & Research", content: "Monetary Economics, Public Economics, Research Project, Economic Policy, Internship." },
    ],
    resources: [
      { title: "Principles of Economics Textbook (PDF)", type: "PDF", description: "Comprehensive economics principles covering micro and macro.", free: true },
      { title: "Econometrics Video Course", type: "VIDEO", description: "Regression analysis, time series, and causal inference in economics.", free: false },
      { title: "Development Economics Guide (PDF)", type: "PDF", description: "Economic development theories, poverty, and policy interventions.", free: true },
      { title: "Economics Explained Podcast", type: "AUDIO", description: "Economic concepts, policy analysis, and global economic trends.", free: true },
    ],
  },
  {
    title: "BSc Finance",
    slug: "bsc-finance",
    description: "A 4-year bachelor's program in finance covering corporate finance, investment analysis, financial markets, risk management, and financial modeling.",
    shortDescription: "Corporate finance, investments & risk management",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 1000000,
    modules: [
      { title: "Year 1 — Foundations", content: "Financial Accounting, Microeconomics, Business Mathematics, Statistics, Communication Skills." },
      { title: "Year 2 — Core Finance", content: "Corporate Finance I, Financial Markets, Macroeconomics, Business Law, Quantitative Methods." },
      { title: "Year 3 — Advanced Finance", content: "Investment Analysis, Corporate Finance II, Risk Management, Financial Modeling, International Finance." },
      { title: "Year 4 — Capstone & Professional", content: "Portfolio Management, Derivatives & Hedging, Capstone Project, Internship, Ethics in Finance." },
    ],
    resources: [
      { title: "Corporate Finance Principles (PDF)", type: "PDF", description: "Valuation, capital budgeting, and capital structure theory.", free: true },
      { title: "Financial Modeling Video Course", type: "VIDEO", description: "Excel-based financial modeling for valuation and forecasting.", free: false },
      { title: "Investment Analysis Guide (PDF)", type: "PDF", description: "Security analysis, portfolio theory, and asset allocation strategies.", free: true },
      { title: "Finance Podcast", type: "AUDIO", description: "Financial markets analysis, investing strategies, and economic outlook.", free: true },
    ],
  },
  {
    title: "BSc Marketing",
    slug: "bsc-marketing",
    description: "A 4-year bachelor's program in marketing covering consumer behavior, brand management, digital marketing, market research, and advertising.",
    shortDescription: "Branding, digital marketing & consumer behavior",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "Principles of Marketing, Microeconomics, Psychology, Business Mathematics, Communication Skills." },
      { title: "Year 2 — Core Marketing", content: "Consumer Behavior, Market Research, Brand Management, Digital Marketing, Business Statistics." },
      { title: "Year 3 — Advanced Marketing", content: "Advertising & Promotion, Sales Management, Social Media Marketing, Marketing Analytics, International Marketing." },
      { title: "Year 4 — Capstone & Industry", content: "Strategic Marketing Management, Content Marketing Strategy, Capstone Project, Internship, Marketing Ethics." },
    ],
    resources: [
      { title: "Marketing Management Guide (PDF)", type: "PDF", description: "Strategic marketing frameworks and modern marketing principles.", free: true },
      { title: "Digital Marketing Masterclass (Video)", type: "VIDEO", description: "SEO, SEM, social media marketing, and email marketing strategies.", free: false },
      { title: "Brand Management Handbook (PDF)", type: "PDF", description: "Brand strategy, positioning, and brand equity measurement.", free: true },
      { title: "Marketing Podcast", type: "AUDIO", description: "Marketing trends, campaign analysis, and expert interviews.", free: true },
    ],
  },
  {
    title: "MSc Accounting & Finance",
    slug: "msc-accounting-finance",
    description: "A 12-month master's program in accounting and finance covering advanced financial reporting, strategic management accounting, and corporate governance.",
    shortDescription: "Advanced accounting, finance & governance",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1400000,
    modules: [
      { title: "Module 1 — Advanced Accounting", content: "Advanced Financial Reporting, Strategic Management Accounting, Corporate Governance & Ethics." },
      { title: "Module 2 — Advanced Finance", content: "Advanced Corporate Finance, Financial Statement Analysis, Mergers & Acquisitions." },
      { title: "Module 3 — Capstone & Research", content: "International Accounting Standards, Research Methods, Capstone Project." },
    ],
    resources: [
      { title: "Advanced Financial Reporting Guide (PDF)", type: "PDF", description: "IFRS standards, consolidated accounts, and complex reporting issues.", free: true },
      { title: "M&A Video Course", type: "VIDEO", description: "Mergers, acquisitions, valuation, and post-merger integration.", free: false },
      { title: "Corporate Governance Framework (PDF)", type: "PDF", description: "Board structures, risk management, and shareholder relations.", free: true },
      { title: "Accounting Research Podcast", type: "AUDIO", description: "Latest research in accounting, auditing, and corporate finance.", free: true },
    ],
  },
  {
    title: "MSc Economics",
    slug: "msc-economics",
    description: "A 12-month master's program in advanced economics covering advanced micro/macro theory, econometrics, and specialized economic fields.",
    shortDescription: "Advanced theory, econometrics & policy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Module 1 — Advanced Theory", content: "Advanced Microeconomics, Advanced Macroeconomics, Econometric Methods, Research Methods." },
      { title: "Module 2 — Specialization", content: "Behavioral Economics, Financial Economics, International Economics, Development Policy." },
      { title: "Module 3 — Thesis", content: "Advanced Econometrics, Master's Thesis, Economic Policy Seminar." },
    ],
    resources: [
      { title: "Advanced Microeconomic Theory (PDF)", type: "PDF", description: "Game theory, mechanism design, and general equilibrium theory.", free: true },
      { title: "Advanced Econometrics Video Course", type: "VIDEO", description: "Panel data, time series, GMM, and causal inference methods.", free: false },
      { title: "Behavioral Economics Guide (PDF)", type: "PDF", description: "Behavioral biases, nudges, and experimental economics methodologies.", free: true },
      { title: "Economic Research Podcast", type: "AUDIO", description: "Economic research discussions and policy implications.", free: true },
    ],
  },
  {
    title: "MSc Marketing",
    slug: "msc-marketing",
    description: "A 12-month master's program in advanced marketing covering strategic brand management, digital transformation, and marketing analytics.",
    shortDescription: "Brand strategy, digital & marketing analytics",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Module 1 — Core", content: "Strategic Brand Management, Digital Marketing Strategy, Marketing Analytics, Research Methods." },
      { title: "Module 2 — Advanced Topics", content: "Consumer Neuroscience, Global Marketing, CRM & Loyalty, Content Strategy." },
      { title: "Module 3 — Capstone", content: "Marketing in the Digital Age, Capstone Project, Industry Practicum." },
    ],
    resources: [
      { title: "Strategic Brand Management Guide (PDF)", type: "PDF", description: "Brand equity, brand positioning, and brand architecture strategies.", free: true },
      { title: "Marketing Analytics Video Course", type: "VIDEO", description: "Data-driven marketing, attribution modeling, and ROI measurement.", free: false },
      { title: "Digital Transformation Handbook (PDF)", type: "PDF", description: "Digital marketing technologies, automation, and omnichannel strategy.", free: true },
      { title: "Marketing Science Podcast", type: "AUDIO", description: "Research-based marketing insights and analytics best practices.", free: true },
    ],
  },

  // ─── SOCIAL SCIENCES ───
  {
    title: "BSc Psychology",
    slug: "bsc-psychology",
    description: "A 4-year bachelor's program in psychology covering cognitive, developmental, social, clinical, and organizational psychology with research methods.",
    shortDescription: "Cognitive, clinical, social & organizational",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 850000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Psychology, Biology, Sociology, Statistics, Communication Skills." },
      { title: "Year 2 — Core Psychology", content: "Cognitive Psychology, Developmental Psychology, Social Psychology, Research Methods I." },
      { title: "Year 3 — Advanced Topics", content: "Clinical Psychology, Organizational Psychology, Personality Psychology, Research Methods II, Psychometrics." },
      { title: "Year 4 — Specialization & Practicum", content: "Abnormal Psychology, Health Psychology, Research Project, Internship, Ethics in Psychology." },
    ],
    resources: [
      { title: "Psychology Textbook (PDF)", type: "PDF", description: "Comprehensive introduction to all major psychology fields.", free: true },
      { title: "Clinical Psychology Video Series", type: "VIDEO", description: "Therapeutic approaches, assessment methods, and case studies.", free: false },
      { title: "Research Methods in Psychology (PDF)", type: "PDF", description: "Experimental design, statistics, and qualitative research methods.", free: true },
      { title: "Psychology Podcast", type: "AUDIO", description: "Psychology research, mental health, and behavioral science insights.", free: true },
    ],
  },
  {
    title: "BSc Sociology",
    slug: "bsc-sociology",
    description: "A 4-year bachelor's program in sociology covering social theory, research methods, social stratification, and contemporary social issues.",
    shortDescription: "Social theory, research & contemporary issues",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 800000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Sociology, Anthropology, Psychology, Statistics, Communication Skills." },
      { title: "Year 2 — Core Sociology", content: "Sociological Theory, Social Research Methods, Social Stratification, Sociology of the Family." },
      { title: "Year 3 — Advanced Topics", content: "Political Sociology, Sociology of Education, Urban Sociology, Gender Studies, Criminology." },
      { title: "Year 4 — Specialization & Research", content: "Globalization & Development, Sociology of Health, Research Project, Internship, Social Policy." },
    ],
    resources: [
      { title: "Sociological Theory Guide (PDF)", type: "PDF", description: "Classical and contemporary sociological theories and thinkers.", free: true },
      { title: "Social Research Methods Video Course", type: "VIDEO", description: "Qualitative and quantitative research methods in sociology.", free: false },
      { title: "Social Stratification Handbook (PDF)", type: "PDF", description: "Class, race, gender inequality and social mobility analysis.", free: true },
      { title: "Sociology Podcast", type: "AUDIO", description: "Sociological perspectives on current events and social issues.", free: true },
    ],
  },
  {
    title: "BSc Political Science",
    slug: "bsc-political-science",
    description: "A 4-year bachelor's program in political science covering political theory, comparative politics, international relations, and public administration.",
    shortDescription: "Political theory, comparative & international relations",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 800000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Political Science, History, Economics, Philosophy, Communication Skills." },
      { title: "Year 2 — Core Political Science", content: "Political Theory, Comparative Politics, International Relations, Research Methods I." },
      { title: "Year 3 — Advanced Topics", content: "Public Administration, Political Economy, African Politics, Research Methods II, Public Policy." },
      { title: "Year 4 — Specialization & Research", content: "International Law, Conflict Resolution, Research Project, Internship, Governance & Leadership." },
    ],
    resources: [
      { title: "Political Theory Reader (PDF)", type: "PDF", description: "Classic texts in political philosophy from Plato to Rawls.", free: true },
      { title: "International Relations Video Course", type: "VIDEO", description: "IR theories, global governance, and contemporary world politics.", free: false },
      { title: "Comparative Politics Guide (PDF)", type: "PDF", description: "Political systems, institutions, and governance across countries.", free: true },
      { title: "Political Science Podcast", type: "AUDIO", description: "Political analysis, elections, and policy debates.", free: true },
    ],
  },
  {
    title: "BSc International Relations",
    slug: "bsc-international-relations",
    description: "A 4-year bachelor's program in international relations covering diplomacy, international law, global security, and international organizations.",
    shortDescription: "Diplomacy, global security & international law",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 850000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to IR, History, Political Science, Economics, Communication Skills." },
      { title: "Year 2 — Core IR", content: "IR Theories, International Law, Comparative Politics, Research Methods, Global History." },
      { title: "Year 3 — Advanced Topics", content: "Diplomacy & Foreign Policy, International Security, International Organizations, Human Rights." },
      { title: "Year 4 — Specialization & Research", content: "Conflict Resolution, Global Political Economy, Research Project, Model UN/Internship, Ethics in IR." },
    ],
    resources: [
      { title: "International Relations Theories (PDF)", type: "PDF", description: "Realism, liberalism, constructivism, and critical IR theories.", free: true },
      { title: "Diplomacy Video Course", type: "VIDEO", description: "Diplomatic protocol, negotiation, and foreign policy analysis.", free: false },
      { title: "International Law Handbook (PDF)", type: "PDF", description: "Public international law, treaties, and international courts.", free: true },
      { title: "Global Affairs Podcast", type: "AUDIO", description: "International relations analysis and global policy discussions.", free: true },
    ],
  },
  {
    title: "BSc Mass Communication",
    slug: "bsc-mass-communication",
    description: "A 4-year bachelor's program covering journalism, broadcasting, public relations, advertising, and digital media production.",
    shortDescription: "Journalism, PR, broadcasting & digital media",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 850000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Mass Communication, English, Sociology, Introduction to Media, Communication Skills." },
      { title: "Year 2 — Core Communication", content: "Journalism, Public Relations, Broadcasting, Advertising, Media Law & Ethics." },
      { title: "Year 3 — Advanced Topics", content: "Digital Media, Photojournalism, Media Research, Feature Writing, Broadcast Production." },
      { title: "Year 4 — Capstone & Industry", content: "Media Management, Multimedia Production, Capstone Project, Internship, Portfolio Development." },
    ],
    resources: [
      { title: "Mass Communication Theory (PDF)", type: "PDF", description: "Media theories, effects research, and communication models.", free: true },
      { title: "Broadcast Production Video Course", type: "VIDEO", description: "TV and radio production techniques, editing, and scripting.", free: false },
      { title: "Digital Media Strategy Guide (PDF)", type: "PDF", description: "Social media strategy, content marketing, and digital storytelling.", free: true },
      { title: "Media Podcast", type: "AUDIO", description: "Media industry trends, journalism ethics, and communication careers.", free: true },
    ],
  },
  {
    title: "MSc Psychology",
    slug: "msc-psychology",
    description: "A 12-month master's program in advanced psychology covering clinical assessment, therapeutic interventions, and psychological research.",
    shortDescription: "Clinical assessment, therapy & research",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Clinical Psychology, Psychopathology, Psychological Assessment, Research Methods." },
      { title: "Module 2 — Specialization", content: "Cognitive Behavioral Therapy, Neuropsychology, Child & Adolescent Psychology, Cross-Cultural Psychology." },
      { title: "Module 3 — Practicum & Thesis", content: "Clinical Practicum, Advanced Psychotherapy, Master's Thesis, Ethics & Professional Practice." },
    ],
    resources: [
      { title: "Clinical Psychology Handbook (PDF)", type: "PDF", description: "Evidence-based assessment and intervention techniques.", free: true },
      { title: "CBT Video Training Series", type: "VIDEO", description: "Cognitive behavioral therapy techniques with demonstration sessions.", free: false },
      { title: "Psychological Assessment Guide (PDF)", type: "PDF", description: "Standardized tests, diagnostic interviews, and report writing.", free: true },
      { title: "Clinical Psychology Podcast", type: "AUDIO", description: "Clinical psychology research, case discussions, and practitioner insights.", free: true },
    ],
  },
  {
    title: "MSc International Relations",
    slug: "msc-international-relations",
    description: "A 12-month master's program in advanced international relations covering global security, international political economy, and foreign policy analysis.",
    shortDescription: "Global security, IPE & foreign policy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced IR Theory, International Security, International Political Economy, Research Methods." },
      { title: "Module 2 — Specialization", content: "Foreign Policy Analysis, Global Governance, Human Security, Regional Studies (Africa/Asia/Middle East)." },
      { title: "Module 3 — Thesis & Practicum", content: "Conflict Analysis & Resolution, Master's Thesis, Model UN/Policy Practicum." },
    ],
    resources: [
      { title: "Advanced IR Theory Reader (PDF)", type: "PDF", description: "Contemporary IR theories and critical security studies.", free: true },
      { title: "Global Governance Video Course", type: "VIDEO", description: "UN system, international organizations, and global policy-making.", free: false },
      { title: "Foreign Policy Analysis Guide (PDF)", type: "PDF", description: "Decision-making theories, bureaucratic politics, and case studies.", free: true },
      { title: "Foreign Policy Podcast", type: "AUDIO", description: "Global affairs analysis and foreign policy decision-making.", free: true },
    ],
  },

  // ─── ARTS & HUMANITIES ───
  {
    title: "BSc English & Literary Studies",
    slug: "bsc-english-literary-studies",
    description: "A 4-year bachelor's program covering English literature, literary theory, creative writing, linguistics, and critical analysis.",
    shortDescription: "Literature, creative writing & linguistics",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 750000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Literature, English Language, General Studies, Communication Skills." },
      { title: "Year 2 — Core English", content: "English Poetry, Prose Fiction, Drama, Literary Theory I, Linguistics." },
      { title: "Year 3 — Advanced Studies", content: "African Literature, Shakespeare Studies, Literary Theory II, Creative Writing, Stylistics." },
      { title: "Year 4 — Specialization & Research", content: "Postcolonial Literature, World Literature, Research Project, Seminar, Internship." },
    ],
    resources: [
      { title: "Literary Theory Anthology (PDF)", type: "PDF", description: "Major literary theories from formalism to postcolonialism.", free: true },
      { title: "Creative Writing Workshop (Video)", type: "VIDEO", description: "Fiction, poetry, and creative non-fiction writing techniques.", free: false },
      { title: "African Literature Guide (PDF)", type: "PDF", description: "Key African literary works, authors, and critical perspectives.", free: true },
      { title: "Literary Discussion Podcast", type: "AUDIO", description: "Book discussions, author interviews, and literary criticism.", free: true },
    ],
  },
  {
    title: "BSc History",
    slug: "bsc-history",
    description: "A 4-year bachelor's program covering world history, African history, historiography, and historical research methods.",
    shortDescription: "World history, Africa & historiography",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 750000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to History, World Civilizations, English, Philosophy, Communication Skills." },
      { title: "Year 2 — Core History", content: "African History, European History, Historiography, Historical Methods, Economic History." },
      { title: "Year 3 — Advanced Topics", content: "Nigerian History, American History, African Diaspora, Oral History, History of Science." },
      { title: "Year 4 — Specialization & Research", content: "Contemporary History, Heritage Studies, Research Project, Museum Internship, Seminar." },
    ],
    resources: [
      { title: "World History Textbook (PDF)", type: "PDF", description: "Comprehensive world history from ancient to modern times.", free: true },
      { title: "Historiography Video Course", type: "VIDEO", description: "Historical writing traditions, methodologies, and debates.", free: false },
      { title: "Nigerian History Reader (PDF)", type: "PDF", description: "Key texts on Nigerian history from pre-colonial to present.", free: true },
      { title: "History Podcast", type: "AUDIO", description: "Historical narratives, analysis, and expert interviews.", free: true },
    ],
  },
  {
    title: "BSc Philosophy",
    slug: "bsc-philosophy",
    description: "A 4-year bachelor's program covering logic, ethics, metaphysics, epistemology, history of philosophy, and contemporary philosophical issues.",
    shortDescription: "Logic, ethics, metaphysics & epistemology",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 750000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Philosophy, Logic, English, History, Communication Skills." },
      { title: "Year 2 — Core Philosophy", content: "Ancient Philosophy, Ethics, Metaphysics, Epistemology, Critical Thinking." },
      { title: "Year 3 — Advanced Topics", content: "Modern Philosophy, Political Philosophy, Philosophy of Mind, African Philosophy, Philosophy of Science." },
      { title: "Year 4 — Specialization & Research", content: "Contemporary Philosophy, Applied Ethics, Research Project, Seminar, Internship." },
    ],
    resources: [
      { title: "Philosophy Reader (PDF)", type: "PDF", description: "Essential readings from Plato to contemporary philosophers.", free: true },
      { title: "Logic & Critical Thinking Video Course", type: "VIDEO", description: "Formal logic, fallacies, and analytical reasoning skills.", free: false },
      { title: "Ethics Handbook (PDF)", type: "PDF", description: "Normative ethics, metaethics, and applied ethical issues.", free: true },
      { title: "Philosophy Podcast", type: "AUDIO", description: "Philosophical discussions on contemporary issues and classic problems.", free: true },
    ],
  },
  {
    title: "BSc Linguistics",
    slug: "bsc-linguistics",
    description: "A 4-year bachelor's program covering phonetics, phonology, morphology, syntax, semantics, sociolinguistics, and language acquisition.",
    shortDescription: "Phonetics, syntax, semantics & sociolinguistics",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 750000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Linguistics, English, Phonetics, Language & Society, Communication Skills." },
      { title: "Year 2 — Core Linguistics", content: "Phonology, Morphology, Syntax, Semantics, African Languages." },
      { title: "Year 3 — Advanced Topics", content: "Historical Linguistics, Sociolinguistics, Psycholinguistics, Language Acquisition, Pragmatics." },
      { title: "Year 4 — Specialization & Research", content: "Applied Linguistics, Language Documentation, Research Project, Field Methods, Internship." },
    ],
    resources: [
      { title: "Linguistics Textbook (PDF)", type: "PDF", description: "Complete introduction to theoretical and applied linguistics.", free: true },
      { title: "Phonetics & Phonology Video Course", type: "VIDEO", description: "Speech production, IPA transcriptions, and phonological analysis.", free: false },
      { title: "Field Methods in Linguistics (PDF)", type: "PDF", description: "Language documentation, elicitation techniques, and data analysis.", free: true },
      { title: "Linguistics Podcast", type: "AUDIO", description: "Language science, endangered languages, and linguistic diversity.", free: true },
    ],
  },
  {
    title: "MSc English",
    slug: "msc-english",
    description: "A 12-month master's program in English studies covering advanced literary theory, critical analysis, and research in English literature.",
    shortDescription: "Advanced literary theory & research",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 900000,
    modules: [
      { title: "Module 1 — Advanced Theory", content: "Contemporary Literary Theory, Advanced Critical Analysis, Research Methods, Textual Studies." },
      { title: "Module 2 — Specialization", content: "Postcolonial Literature, Gender Studies, World Literature, Digital Humanities." },
      { title: "Module 3 — Thesis", content: "Advanced Topics in English Studies, Master's Thesis, Seminar Presentation." },
    ],
    resources: [
      { title: "Contemporary Literary Theory Guide (PDF)", type: "PDF", description: "Post-structuralism, postcolonialism, feminism, and eco-criticism.", free: true },
      { title: "Digital Humanities Video Course", type: "VIDEO", description: "Computational methods for literary and textual analysis.", free: false },
      { title: "Postcolonial Literature Reader (PDF)", type: "PDF", description: "Key postcolonial texts and critical approaches.", free: true },
      { title: "Literary Studies Podcast", type: "AUDIO", description: "Academic literary criticism and contemporary literary research.", free: true },
    ],
  },

  // ─── HEALTH & MEDICINE ───
  {
    title: "BSc Nursing",
    slug: "bsc-nursing",
    description: "A 4-year bachelor's program in nursing covering anatomy, physiology, pharmacology, medical-surgical nursing, and community health nursing.",
    shortDescription: "Clinical nursing, pharmacology & community health",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Year 1 — Foundations", content: "Anatomy & Physiology I, Biochemistry, Psychology, Sociology, Communication Skills." },
      { title: "Year 2 — Core Nursing", content: "Anatomy & Physiology II, Pharmacology, Fundamentals of Nursing, Health Assessment, Microbiology." },
      { title: "Year 3 — Clinical Nursing", content: "Medical-Surgical Nursing, Pediatric Nursing, Maternal & Child Health, Community Health Nursing." },
      { title: "Year 4 — Advanced & Practicum", content: "Psychiatric Nursing, Nursing Research, Leadership in Nursing, Clinical Practicum, Ethics." },
    ],
    resources: [
      { title: "Nursing Fundamentals Handbook (PDF)", type: "PDF", description: "Essential nursing skills, procedures, and patient care principles.", free: true },
      { title: "Clinical Skills Video Series", type: "VIDEO", description: "Demonstrations of nursing procedures and clinical assessments.", free: false },
      { title: "Pharmacology Guide for Nurses (PDF)", type: "PDF", description: "Drug classifications, dosages, and nursing considerations.", free: true },
      { title: "Nursing Podcast", type: "AUDIO", description: "Nursing practice insights, career advice, and healthcare trends.", free: true },
    ],
  },
  {
    title: "BSc Public Health",
    slug: "bsc-public-health",
    description: "A 4-year bachelor's program covering epidemiology, biostatistics, health promotion, environmental health, and health policy.",
    shortDescription: "Epidemiology, biostatistics & health promotion",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 1000000,
    modules: [
      { title: "Year 1 — Foundations", content: "Biology, Chemistry, Mathematics, Introduction to Public Health, Communication Skills." },
      { title: "Year 2 — Core Public Health", content: "Epidemiology, Biostatistics, Health Promotion, Environmental Health, Health Behavior." },
      { title: "Year 3 — Advanced Topics", content: "Disease Control & Prevention, Global Health, Nutrition, Health Policy, Research Methods." },
      { title: "Year 4 — Capstone & Practice", content: "Health Program Management, Health Systems, Capstone Project, Field Practicum, Public Health Law." },
    ],
    resources: [
      { title: "Epidemiology Textbook (PDF)", type: "PDF", description: "Disease distribution, study designs, and outbreak investigation.", free: true },
      { title: "Biostatistics Video Course", type: "VIDEO", description: "Statistical methods for public health research and analysis.", free: false },
      { title: "Global Health Guide (PDF)", type: "PDF", description: "Global disease burden, health systems, and international health organizations.", free: true },
      { title: "Public Health Podcast", type: "AUDIO", description: "Public health news, research, and community health initiatives.", free: true },
    ],
  },
  {
    title: "BSc Pharmacy",
    slug: "bsc-pharmacy",
    description: "A 4-year bachelor's program in pharmacy covering pharmaceutical chemistry, pharmacology, pharmacognosy, and clinical pharmacy.",
    shortDescription: "Drug development, pharmacology & clinical pharmacy",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Year 1 — Foundations", content: "General Chemistry, Organic Chemistry, Biology, Anatomy & Physiology, Communication Skills." },
      { title: "Year 2 — Core Pharmacy", content: "Pharmaceutical Chemistry I, Pharmacology I, Pharmacognosy, Pharmaceutics I, Biochemistry." },
      { title: "Year 3 — Advanced Pharmacy", content: "Pharmaceutical Chemistry II, Pharmacology II, Pharmaceutics II, Pharmaceutical Microbiology, Clinical Pharmacy I." },
      { title: "Year 4 — Clinical & Research", content: "Clinical Pharmacy II, Pharmacy Practice, Hospital Pharmacy, Research Project, Industrial Training." },
    ],
    resources: [
      { title: "Pharmaceutical Chemistry Guide (PDF)", type: "PDF", description: "Drug design, synthesis, and structure-activity relationships.", free: true },
      { title: "Pharmacology Video Course", type: "VIDEO", description: "Drug mechanisms, therapeutic uses, and adverse effects.", free: false },
      { title: "Clinical Pharmacy Handbook (PDF)", type: "PDF", description: "Patient care, drug interactions, and therapeutic drug monitoring.", free: true },
      { title: "Pharmacy Podcast", type: "AUDIO", description: "Pharmacy practice updates, drug discoveries, and career insights.", free: true },
    ],
  },
  {
    title: "BSc Medical Laboratory Science",
    slug: "bsc-medical-laboratory-science",
    description: "A 4-year bachelor's program covering clinical chemistry, hematology, microbiology, histopathology, and blood transfusion science.",
    shortDescription: "Clinical lab diagnostics & pathology",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Year 1 — Foundations", content: "Biology, Chemistry, Anatomy & Physiology, Mathematics, Communication Skills." },
      { title: "Year 2 — Core MLS", content: "Clinical Chemistry I, Hematology I, Medical Microbiology, Histopathology, Immunology." },
      { title: "Year 3 — Advanced MLS", content: "Clinical Chemistry II, Hematology II, Clinical Microbiology, Blood Transfusion Science, Parasitology." },
      { title: "Year 4 — Clinical & Research", content: "Molecular Diagnostics, Laboratory Management, Research Project, Clinical Internship, Quality Control." },
    ],
    resources: [
      { title: "Clinical Chemistry Handbook (PDF)", type: "PDF", description: "Laboratory tests, reference ranges, and clinical interpretation.", free: true },
      { title: "Hematology Video Lab Series", type: "VIDEO", description: "Blood cell morphology, coagulation studies, and lab techniques.", free: false },
      { title: "Medical Microbiology Guide (PDF)", type: "PDF", description: "Pathogenic microorganisms, culture techniques, and sensitivity testing.", free: true },
      { title: "Medical Lab Podcast", type: "AUDIO", description: "Laboratory science, diagnostics, and pathology case discussions.", free: true },
    ],
  },
  {
    title: "MSc Public Health",
    slug: "msc-public-health",
    description: "A 12-month master's program in public health covering advanced epidemiology, health systems, and global health policy.",
    shortDescription: "Advanced epidemiology, health systems & policy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Epidemiology, Advanced Biostatistics, Health Systems Management, Research Methods." },
      { title: "Module 2 — Specialization", content: "Global Health Policy, Disease Surveillance, Health Economics, Environmental & Occupational Health." },
      { title: "Module 3 — Capstone & Thesis", content: "Public Health Leadership, Program Evaluation, Master's Thesis, Field Practicum." },
    ],
    resources: [
      { title: "Advanced Epidemiology Methods (PDF)", type: "PDF", description: "Causal inference, longitudinal analysis, and advanced study designs.", free: true },
      { title: "Health Systems Video Course", type: "VIDEO", description: "Health system strengthening, financing, and performance assessment.", free: false },
      { title: "Global Health Policy Guide (PDF)", type: "PDF", description: "International health regulations, policy analysis, and advocacy.", free: true },
      { title: "Global Health Podcast", type: "AUDIO", description: "Global health challenges, interventions, and policy discussions.", free: true },
    ],
  },
  {
    title: "MSc Nursing",
    slug: "msc-nursing",
    description: "A 12-month master's program in advanced nursing covering advanced clinical practice, nursing leadership, and evidence-based practice.",
    shortDescription: "Advanced practice, leadership & evidence-based care",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1400000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Health Assessment, Advanced Pathophysiology, Advanced Pharmacology, Research Methods." },
      { title: "Module 2 — Specialization", content: "Nursing Leadership & Management, Evidence-Based Practice, Clinical Specialization (choose: Adult/Geriatric/Pediatric/Mental Health)." },
      { title: "Module 3 — Capstone", content: "Advanced Clinical Practicum, Healthcare Quality Improvement, Master's Capstone Project." },
    ],
    resources: [
      { title: "Advanced Health Assessment Guide (PDF)", type: "PDF", description: "Comprehensive physical assessment and clinical reasoning.", free: true },
      { title: "Evidence-Based Practice Video Course", type: "VIDEO", description: "Research utilization, systematic reviews, and clinical guidelines.", free: false },
      { title: "Nursing Leadership Handbook (PDF)", type: "PDF", description: "Leadership theories, change management, and healthcare administration.", free: true },
      { title: "Advanced Nursing Podcast", type: "AUDIO", description: "Advanced nursing practice, research, and clinical excellence.", free: true },
    ],
  },

  // ─── LAW ───
  {
    title: "Bachelor of Laws (LLB)",
    slug: "llb",
    description: "A 4-year bachelor's degree in law covering constitutional law, criminal law, contract law, property law, and legal research methods.",
    shortDescription: "Constitutional, criminal, contract & property law",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Law, Constitutional Law I, Criminal Law I, Legal Method, Nigerian Legal System." },
      { title: "Year 2 — Core Law", content: "Contract Law, Tort Law, Constitutional Law II, Criminal Law II, Land Law I." },
      { title: "Year 3 — Advanced Law", content: "Company Law, Equity & Trusts, Commercial Law, Human Rights Law, Law of Evidence." },
      { title: "Year 4 — Professional & Research", content: "Jurisprudence, International Law, Labor Law, Research Project, Law Clinic, Ethics & Legal Practice." },
    ],
    resources: [
      { title: "Constitutional Law Textbook (PDF)", type: "PDF", description: "Constitutional principles, structures, and fundamental rights.", free: true },
      { title: "Legal Research & Writing Video Course", type: "VIDEO", description: "Case analysis, legal writing, and advocacy skills.", free: false },
      { title: "Contract Law Casebook (PDF)", type: "PDF", description: "Essential contract law cases with analysis and commentary.", free: true },
      { title: "Law Podcast", type: "AUDIO", description: "Legal analysis, landmark cases, and law career insights.", free: true },
    ],
  },
  {
    title: "Master of Laws (LLM)",
    slug: "llm",
    description: "A 12-month master's degree in law covering advanced legal theory, specialized legal fields, and legal research methodology.",
    shortDescription: "Advanced legal theory & specialized law",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Jurisprudence & Legal Theory, Comparative Law, Legal Research Methodology, Advanced Constitutional Law." },
      { title: "Module 2 — Specialization (choose track)", content: "International Law Track / Corporate Law Track / Human Rights Track / Energy & Environmental Law Track." },
      { title: "Module 3 — Thesis", content: "Master's Thesis, Legal Writing Workshop, Seminar in Contemporary Legal Issues." },
    ],
    resources: [
      { title: "Jurisprudence & Legal Theory Reader (PDF)", type: "PDF", description: "Advanced legal philosophy and theoretical perspectives.", free: true },
      { title: "Comparative Law Video Series", type: "VIDEO", description: "Comparative legal systems, methodologies, and case studies.", free: false },
      { title: "International Law Guide (PDF)", type: "PDF", description: "Public international law, treaties, and international courts.", free: true },
      { title: "Legal Scholarship Podcast", type: "AUDIO", description: "Academic legal research, publications, and scholarly debates.", free: true },
    ],
  },

  // ─── EDUCATION ───
  {
    title: "BSc Education",
    slug: "bsc-education",
    description: "A 4-year bachelor's program in education covering educational psychology, curriculum development, instructional methods, and educational assessment.",
    shortDescription: "Teaching methods, curriculum & assessment",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 750000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Education, Psychology, Sociology, English, Communication Skills." },
      { title: "Year 2 — Core Education", content: "Educational Psychology, Philosophy of Education, Curriculum Development, Educational Technology." },
      { title: "Year 3 — Advanced Topics", content: "Instructional Methods, Educational Assessment, Special Education, Classroom Management, Research Methods." },
      { title: "Year 4 — Teaching Practice & Research", content: "Educational Administration, Guidance & Counseling, Teaching Practice, Research Project, Ethics in Education." },
    ],
    resources: [
      { title: "Educational Psychology Textbook (PDF)", type: "PDF", description: "Learning theories, motivation, and developmental psychology.", free: true },
      { title: "Teaching Methods Video Series", type: "VIDEO", description: "Effective instructional strategies and classroom techniques.", free: false },
      { title: "Curriculum Development Guide (PDF)", type: "PDF", description: "Curriculum design, implementation, and evaluation frameworks.", free: true },
      { title: "Education Podcast", type: "AUDIO", description: "Educational innovation, policy, and teaching best practices.", free: true },
    ],
  },
  {
    title: "BSc Educational Technology",
    slug: "bsc-educational-technology",
    description: "A 4-year bachelor's program covering instructional design, e-learning platforms, learning analytics, and digital pedagogy.",
    shortDescription: "Instructional design, e-learning & learning analytics",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 900000,
    modules: [
      { title: "Year 1 — Foundations", content: "Introduction to Educational Technology, Psychology, Programming Basics, Communication Skills." },
      { title: "Year 2 — Core EdTech", content: "Instructional Design, Multimedia in Education, Web Development for Education, Learning Theories." },
      { title: "Year 3 — Advanced EdTech", content: "E-Learning Platforms, Learning Analytics, Mobile Learning, Game-Based Learning, Research Methods." },
      { title: "Year 4 — Capstone & Practice", content: "AI in Education, Learning Management Systems, Capstone Project, Internship, Digital Pedagogy." },
    ],
    resources: [
      { title: "Instructional Design Handbook (PDF)", type: "PDF", description: "ADDIE, SAM, and agile instructional design methodologies.", free: true },
      { title: "E-Learning Development Video Course", type: "VIDEO", description: "Building interactive e-learning content with modern tools.", free: false },
      { title: "Learning Analytics Guide (PDF)", type: "PDF", description: "Educational data mining, dashboards, and learning interventions.", free: true },
      { title: "EdTech Podcast", type: "AUDIO", description: "Educational technology trends, tools, and classroom innovations.", free: true },
    ],
  },
  {
    title: "MSc Education",
    slug: "msc-education",
    description: "A 12-month master's program in advanced education covering educational leadership, policy analysis, and educational research.",
    shortDescription: "Educational leadership, policy & research",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1000000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Educational Leadership & Management, Education Policy Analysis, Research Methods in Education." },
      { title: "Module 2 — Specialization", content: "Comparative Education, Higher Education Administration, Curriculum & Instruction Leadership." },
      { title: "Module 3 — Thesis", content: "Advanced Educational Research, Master's Thesis, Educational Leadership Practicum." },
    ],
    resources: [
      { title: "Educational Leadership Guide (PDF)", type: "PDF", description: "Leadership theories, school improvement, and organizational change.", free: true },
      { title: "Education Policy Video Course", type: "VIDEO", description: "Policy formulation, implementation, and evaluation in education.", free: false },
      { title: "Comparative Education Reader (PDF)", type: "PDF", description: "Education systems across countries and global education trends.", free: true },
      { title: "Education Research Podcast", type: "AUDIO", description: "Educational research findings and implications for practice.", free: true },
    ],
  },

  // ─── AGRICULTURE ───
  {
    title: "BSc Agriculture",
    slug: "bsc-agriculture",
    description: "A 4-year bachelor's program in agriculture covering crop science, animal science, soil science, agricultural economics, and farm management.",
    shortDescription: "Crop science, animal science & farm management",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 800000,
    modules: [
      { title: "Year 1 — Foundations", content: "General Biology, General Chemistry, Introduction to Agriculture, Mathematics, Communication Skills." },
      { title: "Year 2 — Core Agriculture", content: "Crop Science, Animal Science, Soil Science, Agricultural Economics, Agricultural Engineering." },
      { title: "Year 3 — Advanced Topics", content: "Plant Breeding, Animal Production, Soil Fertility, Farm Management, Agricultural Extension." },
      { title: "Year 4 — Capstone & Practice", content: "Crop Protection, Animal Health, Capstone Farm Project, Internship, Agribusiness & Marketing." },
    ],
    resources: [
      { title: "Crop Science Handbook (PDF)", type: "PDF", description: "Crop production, physiology, and pest management principles.", free: true },
      { title: "Animal Science Video Series", type: "VIDEO", description: "Animal nutrition, breeding, and husbandry practices.", free: false },
      { title: "Soil Science Guide (PDF)", type: "PDF", description: "Soil classification, fertility, and conservation methods.", free: true },
      { title: "Agriculture Podcast", type: "AUDIO", description: "Modern agriculture, agribusiness, and farming innovations.", free: true },
    ],
  },
  {
    title: "BSc Agricultural Economics",
    slug: "bsc-agricultural-economics",
    description: "A 4-year bachelor's program covering agricultural policy, farm management, agribusiness, and rural development economics.",
    shortDescription: "Farm management, agribusiness & policy",
    tier: "UNIVERSITY", category: "DEGREE_BACHELORS", difficulty: "INTERMEDIATE", priceInKobo: 800000,
    modules: [
      { title: "Year 1 — Foundations", content: "Principles of Economics, Mathematics, Statistics, Introduction to Agriculture, Communication Skills." },
      { title: "Year 2 — Core", content: "Microeconomics, Macroeconomics, Farm Management, Agricultural Marketing, Accounting." },
      { title: "Year 3 — Advanced", content: "Agricultural Policy, Agribusiness Management, Production Economics, Research Methods, Rural Development." },
      { title: "Year 4 — Capstone & Research", content: "Agricultural Finance, International Agricultural Trade, Capstone Project, Internship, Econometrics." },
    ],
    resources: [
      { title: "Agricultural Economics Textbook (PDF)", type: "PDF", description: "Economic principles applied to agriculture and food systems.", free: true },
      { title: "Farm Management Video Course", type: "VIDEO", description: "Farm business planning, budgeting, and decision analysis.", free: false },
      { title: "Agribusiness Management Guide (PDF)", type: "PDF", description: "Agribusiness value chains, marketing, and strategic management.", free: true },
      { title: "Agri-Economics Podcast", type: "AUDIO", description: "Agricultural policy, markets, and rural development discussions.", free: true },
    ],
  },
  {
    title: "MSc Agriculture",
    slug: "msc-agriculture",
    description: "A 12-month master's program in advanced agriculture covering sustainable agriculture, crop improvement, and agricultural research methods.",
    shortDescription: "Sustainable agriculture, crop improvement & research",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1000000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Crop Production, Sustainable Agriculture, Agricultural Research Methods, Biometrics." },
      { title: "Module 2 — Specialization", content: "Plant Breeding & Genomics, Soil & Water Conservation, Agricultural Extension Systems, Food Security." },
      { title: "Module 3 — Thesis", content: "Advanced Topics in Agriculture, Master's Thesis, Field Research Project." },
    ],
    resources: [
      { title: "Sustainable Agriculture Guide (PDF)", type: "PDF", description: "Agroecology, conservation agriculture, and sustainable intensification.", free: true },
      { title: "Plant Breeding Video Course", type: "VIDEO", description: "Classical and molecular breeding techniques for crop improvement.", free: false },
      { title: "Agricultural Research Methods (PDF)", type: "PDF", description: "Experimental design, field trials, and data analysis in agriculture.", free: true },
      { title: "Agri-Research Podcast", type: "AUDIO", description: "Agricultural research innovations and food systems transformation.", free: true },
    ],
  },

  // ─── ADDITIONAL MASTER'S PROGRAMS ───
  {
    title: "MSc Biotechnology",
    slug: "msc-biotechnology",
    description: "A 12-month master's program in advanced biotechnology covering genetic engineering, bioprocessing, and industrial biotechnology applications.",
    shortDescription: "Genetic engineering, bioprocessing & industrial biotech",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1400000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Molecular Biology, Genetic Engineering & CRISPR, Bioprocess Engineering, Research Methods." },
      { title: "Module 2 — Specialization", content: "Industrial Biotechnology, Environmental Biotechnology, BioPharmaceuticals, Regulatory Affairs." },
      { title: "Module 3 — Thesis", content: "Advanced Topics in Biotechnology, Master's Thesis, Industry Internship." },
    ],
    resources: [
      { title: "Advanced Biotechnology Handbook (PDF)", type: "PDF", description: "Industrial biotech, bioreactors, and downstream processing.", free: true },
      { title: "CRISPR Gene Editing Video Course", type: "VIDEO", description: "CRISPR-Cas9 principles, design, and applications.", free: false },
      { title: "Bioprocess Engineering Guide (PDF)", type: "PDF", description: "Fermentation, cell culture, and bioprocess optimization.", free: true },
      { title: "Biotech Industry Podcast", type: "AUDIO", description: "Biotechnology industry news, innovation, and career insights.", free: true },
    ],
  },
  {
    title: "MSc Environmental Science",
    slug: "msc-environmental-science",
    description: "A 12-month master's program in environmental science covering climate change science, environmental modeling, and sustainability management.",
    shortDescription: "Climate science, environmental modeling & sustainability",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1100000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Environmental Chemistry, Climate Change Science, Environmental Modeling, Research Methods." },
      { title: "Module 2 — Specialization", content: "Sustainability Management, Environmental Policy, Renewable Energy Systems, Ecological Restoration." },
      { title: "Module 3 — Thesis", content: "Advanced Topics in Environmental Science, Master's Thesis, Field Research." },
    ],
    resources: [
      { title: "Climate Change Science Handbook (PDF)", type: "PDF", description: "Climate modeling, impacts, adaptation, and mitigation.", free: true },
      { title: "Environmental Modeling Video Course", type: "VIDEO", description: "GIS, remote sensing, and environmental simulation models.", free: false },
      { title: "Sustainability Management Guide (PDF)", type: "PDF", description: "Corporate sustainability, ESG, and circular economy principles.", free: true },
      { title: "Environment Podcast", type: "AUDIO", description: "Environmental issues, conservation, and sustainability solutions.", free: true },
    ],
  },
  {
    title: "MSc Finance",
    slug: "msc-finance",
    description: "A 12-month master's program in advanced finance covering quantitative finance, financial risk management, and investment management.",
    shortDescription: "Quantitative finance, risk & investment management",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1600000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Corporate Finance, Financial Econometrics, Fixed Income Analysis, Research Methods." },
      { title: "Module 2 — Specialization", content: "Derivatives & Risk Management, Portfolio Management, Behavioral Finance, Private Equity & Venture Capital." },
      { title: "Module 3 — Capstone", content: "Advanced Financial Modeling, Master's Thesis/Capstone, Financial Regulation & Ethics." },
    ],
    resources: [
      { title: "Quantitative Finance Textbook (PDF)", type: "PDF", description: "Stochastic calculus, option pricing, and financial engineering.", free: true },
      { title: "Advanced Financial Modeling Video Course", type: "VIDEO", description: "LBO models, DCF, M&A models, and Monte Carlo simulations.", free: false },
      { title: "Risk Management Framework (PDF)", type: "PDF", description: "Market, credit, and operational risk measurement and management.", free: true },
      { title: "Finance Research Podcast", type: "AUDIO", description: "Finance research, market analysis, and investment strategies.", free: true },
    ],
  },
  {
    title: "MSc Data Science & Analytics",
    slug: "msc-data-science-analytics",
    description: "A 12-month intensive master's program in data science covering statistical learning, big data engineering, and business analytics.",
    shortDescription: "Statistical learning, big data & business analytics",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1500000,
    modules: [
      { title: "Module 1 — Foundations", content: "Advanced Statistics, Machine Learning, Python for Data Science, SQL & Data Warehousing." },
      { title: "Module 2 — Specialization", content: "Big Data Engineering (Spark, Airflow), Business Analytics & Visualization, NLP, MLOps." },
      { title: "Module 3 — Capstone", content: "Data Science Capstone Project, Industry Practicum, Ethics & Data Governance." },
    ],
    resources: [
      { title: "Statistical Learning with Python (PDF)", type: "PDF", description: "ISLR concepts with Python implementations and case studies.", free: true },
      { title: "Big Data Engineering Video Series", type: "VIDEO", description: "Spark, Kafka, Airflow, and data pipeline orchestration.", free: false },
      { title: "Business Analytics Guide (PDF)", type: "PDF", description: "Data-driven decision making, dashboards, and KPI frameworks.", free: true },
      { title: "Data & Analytics Podcast", type: "AUDIO", description: "Data science industry trends, tools, and career insights.", free: true },
    ],
  },
  {
    title: "MSc Human Resource Management",
    slug: "msc-human-resource-management",
    description: "A 12-month master's program in HRM covering strategic HR, talent management, organizational development, and employment law.",
    shortDescription: "Strategic HR, talent management & organizational development",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Strategic Human Resource Management, Organizational Behavior, Employment Law, Research Methods." },
      { title: "Module 2 — Specialization", content: "Talent Acquisition & Management, Performance Management, Compensation & Benefits, Change Management." },
      { title: "Module 3 — Capstone", content: "HR Analytics, Global HRM, Master's Capstone Project, HR Leadership." },
    ],
    resources: [
      { title: "Strategic HRM Handbook (PDF)", type: "PDF", description: "Strategic HR frameworks, workforce planning, and HR metrics.", free: true },
      { title: "Talent Management Video Course", type: "VIDEO", description: "Recruitment, selection, onboarding, and talent development.", free: false },
      { title: "Employment Law Guide (PDF)", type: "PDF", description: "Labor laws, employee relations, and workplace compliance.", free: true },
      { title: "HR Leadership Podcast", type: "AUDIO", description: "HR trends, leadership insights, and workplace innovation.", free: true },
    ],
  },
  {
    title: "MSc Project Management",
    slug: "msc-project-management",
    description: "A 12-month master's program in project management covering project governance, risk management, agile methodologies, and program management.",
    shortDescription: "Project governance, risk, agile & program management",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1200000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Project Governance, Advanced Project Planning, Risk Management, Research Methods." },
      { title: "Module 2 — Specialization", content: "Agile & Scrum Methodologies, Program Management, Portfolio Management, Contract Management." },
      { title: "Module 3 — Capstone", content: "PMO Design & Implementation, Master's Capstone Project, PMP Preparation." },
    ],
    resources: [
      { title: "PMBOK Guide Companion (PDF)", type: "PDF", description: "PMBOK concepts, processes, and knowledge areas explained.", free: true },
      { title: "Agile & Scrum Masterclass (Video)", type: "VIDEO", description: "Scrum, Kanban, SAFe, and agile project management practices.", free: false },
      { title: "Project Risk Management Guide (PDF)", type: "PDF", description: "Risk identification, analysis, response, and monitoring.", free: true },
      { title: "Project Management Podcast", type: "AUDIO", description: "Project management best practices, case studies, and career tips.", free: true },
    ],
  },
  {
    title: "MSc Supply Chain Management",
    slug: "msc-supply-chain-management",
    description: "A 12-month master's program in supply chain management covering logistics, procurement, supply chain analytics, and global supply chain strategy.",
    shortDescription: "Logistics, procurement, analytics & strategy",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1300000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Supply Chain Strategy, Logistics & Transportation, Procurement Management, Research Methods." },
      { title: "Module 2 — Specialization", content: "Supply Chain Analytics, Global Supply Chain, Inventory Management, Sustainability in Supply Chain." },
      { title: "Module 3 — Capstone", content: "Supply Chain Digital Transformation, Master's Capstone, Industry Practicum." },
    ],
    resources: [
      { title: "Supply Chain Management Handbook (PDF)", type: "PDF", description: "End-to-end supply chain principles and best practices.", free: true },
      { title: "Logistics & Transportation Video Course", type: "VIDEO", description: "Warehousing, distribution, and transportation management.", free: false },
      { title: "Supply Chain Analytics Guide (PDF)", type: "PDF", description: "Demand forecasting, network optimization, and performance metrics.", free: true },
      { title: "Supply Chain Podcast", type: "AUDIO", description: "Supply chain news, technology, and industry insights.", free: true },
    ],
  },
  {
    title: "MSc Architecture",
    slug: "msc-architecture",
    description: "A 12-month master's program in architecture covering advanced design theory, sustainable architecture, urban design, and digital fabrication.",
    shortDescription: "Design theory, sustainable design & urbanism",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1400000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Architectural Design, History & Theory of Architecture, Research Methods, Digital Design." },
      { title: "Module 2 — Specialization", content: "Sustainable Architecture, Urban Design & Planning, Digital Fabrication, Building Information Modeling." },
      { title: "Module 3 — Thesis", content: "Design Thesis Project, Professional Practice, Architectural Criticism." },
    ],
    resources: [
      { title: "Architectural Design Theory (PDF)", type: "PDF", description: "Design principles, precedents, and contemporary architectural theory.", free: true },
      { title: "BIM Video Course", type: "VIDEO", description: "Revit, ArchiCAD, and Building Information Modeling workflows.", free: false },
      { title: "Sustainable Architecture Guide (PDF)", type: "PDF", description: "Green building, passive design, and sustainable materials.", free: true },
      { title: "Architecture Podcast", type: "AUDIO", description: "Architecture, urbanism, and design culture discussions.", free: true },
    ],
  },
  {
    title: "MSc Petroleum Engineering",
    slug: "msc-petroleum-engineering",
    description: "A 12-month master's program in advanced petroleum engineering covering reservoir simulation, enhanced oil recovery, and petroleum economics.",
    shortDescription: "Reservoir simulation, EOR & petroleum economics",
    tier: "UNIVERSITY", category: "DEGREE_MASTERS", difficulty: "ADVANCED", priceInKobo: 1800000,
    modules: [
      { title: "Module 1 — Advanced Core", content: "Advanced Reservoir Engineering, Reservoir Simulation, Well Test Analysis, Research Methods." },
      { title: "Module 2 — Specialization", content: "Enhanced Oil Recovery, Drilling Engineering, Petroleum Economics & Risk, Natural Gas Engineering." },
      { title: "Module 3 — Thesis", content: "Advanced Topics in Petroleum Engineering, Master's Thesis, Industry Research Project." },
    ],
    resources: [
      { title: "Reservoir Simulation Handbook (PDF)", type: "PDF", description: "Numerical reservoir simulation, history matching, and prediction.", free: true },
      { title: "Enhanced Oil Recovery Video Course", type: "VIDEO", description: "Thermal, gas injection, and chemical EOR methods.", free: false },
      { title: "Petroleum Economics Guide (PDF)", type: "PDF", description: "Project evaluation, risk analysis, and fiscal regimes.", free: true },
      { title: "Energy & Petroleum Podcast", type: "AUDIO", description: "Oil and gas industry analysis, technology, and energy transition.", free: true },
    ],
  },
]

async function main() {
  console.log("🌱 Seeding all degree programs...\n")

  let created = 0
  let skipped = 0

  for (const prog of programs) {
    const { modules, resources, ...fields } = prog

    const existing = await prisma.course.findUnique({ where: { slug: prog.slug } })
    if (existing) {
      // Add resources if missing
      const existingResourceCount = await prisma.studyResource.count({ where: { courseId: existing.id } })
      if (existingResourceCount === 0) {
        for (const r of resources) {
          await prisma.studyResource.create({
            data: {
              courseId: existing.id,
              title: r.title,
              type: r.type,
              description: r.description,
              free: r.free,
              downloads: Math.floor(Math.random() * 500) + 50,
              duration: r.type === "VIDEO" ? Math.floor(Math.random() * 120) + 15 : r.type === "AUDIO" ? Math.floor(Math.random() * 30) + 5 : null,
              fileSize: r.type === "PDF" ? Math.floor(Math.random() * 5000) + 500 : null,
            },
          })
        }
        console.log(`  ✅ Added resources to existing: ${prog.title}`)
      } else {
        console.log(`  ⏭️  Skipped (exists): ${prog.title}`)
        skipped++
      }
      continue
    }

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

    // Add resources to newly created course
    const course = await prisma.course.findUnique({ where: { slug: prog.slug } })!
    if (course) {
      for (const r of resources) {
        await prisma.studyResource.create({
          data: {
            courseId: course.id,
            title: r.title,
            type: r.type,
            description: r.description,
            free: r.free,
            downloads: Math.floor(Math.random() * 500) + 50,
            duration: r.type === "VIDEO" ? Math.floor(Math.random() * 120) + 15 : r.type === "AUDIO" ? Math.floor(Math.random() * 30) + 5 : null,
            fileSize: r.type === "PDF" ? Math.floor(Math.random() * 5000) + 500 : null,
          },
        })
      }
    }

    console.log(`  ✅ Created: ${prog.title}`)
    created++
  }

  console.log(`\n🎉 Done! Created: ${created}, Skipped: ${skipped}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
