const mongoose = require("mongoose");
const Experience = require("./Experience"); // adjust path if needed

// ✅ MongoDB connection URL
const MONGO_URI = "mongodb://127.0.0.1:27017/placify"; // change if needed

// ✅ Sample Data
const sampleExperiences = [
  // 1 — Internship (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "ABC Institute of Technology",
    branch: "CSE",
    batchYear: 2025,
    isAnonymous: true,
    companyName: "Google",
    jobRole: "STEP Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Remote",
    ctc: "₹2,10,000/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "The overall experience was intense but very fair. The interviewers were friendly, asked deep questions about my thought process, and encouraged me to talk aloud while solving problems. It felt more like a technical discussion than a strict evaluation.",
    rounds: [
      {
        name: "Online Coding Test",
        description:
          "Included three algorithmic questions on arrays, strings, and graphs with strict time limits."
      },
      {
        name: "Technical Interview",
        description:
          "Involved detailed questions on data structures, complexity analysis, and my personal projects."
      },
      {
        name: "HR and Culture Fit",
        description:
          "Focused on my motivations, teamwork experiences, and how I handle feedback and ambiguity."
      }
    ],
    codingQuestions:
      "Implement LRU Cache; find number of islands in a grid; longest substring without repeating characters.",
    technicalQuestions:
      "Explain time and space complexity of your solutions; how a hash map works internally; difference between process and thread.",
    hrQuestions:
      "Why do you want to work at Google; talk about a time you failed; how do you handle conflicting opinions in a team.",
    resourcesUsed:
      "LeetCode daily practice, NeetCode YouTube playlist, Google interview blogs, CS fundamentals revision from university notes.",
    tipsForCandidates:
      "Do regular timed contests, practice explaining your logic out loud, and prepare at least two solid projects you can confidently discuss in depth.",
    mistakesToAvoid:
      "Do not jump into coding without clarifying the problem and edge cases, and avoid staying silent when stuck—share your thought process.",
    date: "2025-11-03",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 2 — Internship
  {
    fullName: "Rohit Kumar",
    email: "rohit.kumar@example.com",
    collegeName: "XYZ University of Engineering",
    branch: "IT",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/rohith-kumar/",
    isAnonymous: false,
    companyName: "Amazon",
    jobRole: "SDE Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Bangalore",
    ctc: "₹95,000/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Medium",
    overallExperience:
      "The interview process at Amazon was structured and transparent. Each round had a clear objective and the interviewers were more interested in how I approached problems rather than just the final answer. Overall it was challenging but very rewarding as a first big tech interview.",
    rounds: [
      {
        name: "Online Assessment",
        description:
          "Consisted of two medium-level coding problems and several MCQs on logical reasoning and basic CS concepts."
      },
      {
        name: "Technical Round",
        description:
          "Focused on data structures, problem solving patterns, and a deep dive into my internship project."
      },
      {
        name: "HR Discussion",
        description:
          "Covered leadership principles, ownership experiences, and situational questions based on past behavior."
      }
    ],
    codingQuestions:
      "Two Sum variant with constraints; find first unique character in a string; design a simple rate limiter.",
    technicalQuestions:
      "Explain differences between array and linked list; how would you design a logging system; what are indexes in databases.",
    hrQuestions:
      "Describe a time you took ownership; when did you disagree with a teammate and how did you handle it; why Amazon.",
    resourcesUsed:
      "Striver SDE Sheet for DSA topics, LeetCode interview section, discussion with seniors who interned at Amazon.",
    tipsForCandidates:
      "Understand Amazon leadership principles and relate them to your experiences; focus on writing clean code and always discuss complexity clearly.",
    mistakesToAvoid:
      "Avoid giving very generic HR answers; do not ignore corner cases in coding problems and avoid writing code without structuring your thoughts.",
    date: "2025-10-18",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 3 — Internship
  {
    fullName: "Aditi Mehra",
    email: "aditi.mehra@example.com",
    collegeName: "PQR Institute of Technology",
    branch: "ECE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/aditi-mehra/",
    isAnonymous: false,
    companyName: "Microsoft",
    jobRole: "Software Engineering Intern",
    positionType: "Internship",
    interviewType: "Referral",
    jobLocation: "Hyderabad",
    ctc: "₹1,20,000/month",
    numberOfRounds: 2,
    roundTypes: ["Coding", "Technical"],
    difficultyLevel: "Hard",
    overallExperience:
      "Microsoft’s process was short but very intense. The interviewers expected clear reasoning and high-quality solutions, and they often asked follow-up variations on the same problem to test depth. It felt like they really evaluated problem solving fundamentals rather than memorized patterns.",
    rounds: [
      {
        name: "Coding Interview",
        description:
          "Two complex algorithmic questions on graphs and recursion, with emphasis on complexity and trade-offs."
      },
      {
        name: "Technical Deep Dive",
        description:
          "Discussion on projects, system design basics, and detailed questions on data structures and debugging approaches."
      }
    ],
    codingQuestions:
      "Detect cycle in a directed graph; generate all valid parenthesis combinations for a given number of pairs.",
    technicalQuestions:
      "Explain how a hash table handles collisions; difference between stack and queue in practical scenarios; how would you debug a memory leak.",
    hrQuestions:
      "How do you learn new technologies; talk about a time you took initiative; what motivates you to work in large-scale systems.",
    resourcesUsed:
      "LeetCode hard-level problems, GFG articles on graphs and recursion, YouTube mock interview recordings focused on Microsoft.",
    tipsForCandidates:
      "Focus on clarity of explanation; do not be afraid to ask for hints when stuck; rehearse your project explanations so they sound structured and confident.",
    mistakesToAvoid:
      "Do not jump directly to coding without offering at least one brute-force and one optimized approach; avoid being vague about trade-offs.",
    date: "2025-11-12",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 4 — Internship (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "LMN College of Engineering",
    branch: "EEE",
    batchYear: 2024,
    isAnonymous: true,
    companyName: "TCS Digital",
    jobRole: "Software Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Chennai",
    ctc: "₹55,000/month",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "HR"],
    difficultyLevel: "Easy",
    overallExperience:
      "The TCS Digital interview experience was beginner-friendly and well organized. The aptitude round was standard and not too tricky, and the HR round felt more like a conversation about fit and aspirations than a stress test. It is a good opportunity for students appearing for their first interviews.",
    rounds: [
      {
        name: "Online Aptitude Test",
        description:
          "Covered quantitative aptitude, logical reasoning, and basic verbal ability questions within a timed environment."
      },
      {
        name: "HR Interaction",
        description:
          "Included questions on career goals, relocation flexibility, and basic understanding of company expectations."
      }
    ],
    codingQuestions: "",
    technicalQuestions: "",
    hrQuestions:
      "Why do you want to join TCS; are you comfortable relocating; what are your strengths and weaknesses.",
    resourcesUsed:
      "Indiabix aptitude practice, PrepInsta topic-wise tests, college placement preparation sessions.",
    tipsForCandidates:
      "Revise basic aptitude formulas and practice a few timed tests; be honest and positive in HR responses and show readiness to learn.",
    mistakesToAvoid:
      "Do not ignore verbal ability sections in aptitude; avoid giving memorized or fake-sounding answers to HR questions.",
    date: "2025-10-09",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 5 — Internship
  {
    fullName: "Manish Gupta",
    email: "manish.gupta@example.com",
    collegeName: "ABC College of Engineering",
    branch: "IT",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/manish-gupta-it/",
    isAnonymous: false,
    companyName: "Infosys",
    jobRole: "System Engineer Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Pune",
    ctc: "₹35,000/month",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "Technical"],
    difficultyLevel: "Easy",
    overallExperience:
      "Infosys had a very smooth and beginner-friendly process. The aptitude test was moderate and the technical round focused more on conceptual understanding than advanced coding. For many students this turned out to be a confidence-boosting first interview experience.",
    rounds: [
      {
        name: "Aptitude Assessment",
        description:
          "Tested quantitative aptitude, logical reasoning, and basic verbal skills relevant for service-based roles."
      },
      {
        name: "Technical Interview",
        description:
          "Covered fundamentals of OOP, DBMS, and simple coding logic along with questions about academic projects."
      }
    ],
    codingQuestions:
      "Write a program to reverse a string; check if a number is a palindrome using iteration.",
    technicalQuestions:
      "What is normalization in DBMS; explain different types of inheritance in OOP; difference between primary key and unique key.",
    hrQuestions:
      "Are you open to working in different technologies; how do you handle deadlines; tell me about a time you worked in a team.",
    resourcesUsed:
      "GeeksforGeeks for core CS topics, company-specific interview experiences from seniors, YouTube playlists on Infosys recruitment.",
    tipsForCandidates:
      "Focus on strengthening core subjects like OOP and DBMS; practice 10–15 basic coding problems before the interview.",
    mistakesToAvoid:
      "Avoid saying you know a technology if you cannot explain the basics clearly; do not ignore aptitude preparation thinking it is easy.",
    date: "2025-11-05",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 6 — Internship
  {
    fullName: "Kiran Shetty",
    email: "kiran.shetty@example.com",
    collegeName: "NIT Warangal",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/kiran-shetty/",
    isAnonymous: false,
    companyName: "Flipkart",
    jobRole: "SDE Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Remote",
    ctc: "₹1,00,000/month",
    numberOfRounds: 2,
    roundTypes: ["Coding", "Technical"],
    difficultyLevel: "Medium",
    overallExperience:
      "The Flipkart internship process was fast-paced with a strong emphasis on problem solving. Both rounds felt like pair-programming sessions where I was encouraged to share my thought process. Overall it was a positive experience that tested both fundamentals and clarity.",
    rounds: [
      {
        name: "Coding Round",
        description:
          "Two medium to hard problems on dynamic programming and sliding window patterns with follow-up constraints."
      },
      {
        name: "Technical Discussion",
        description:
          "Included questions on projects, database design choices, and trade-offs between different solutions."
      }
    ],
    codingQuestions:
      "Implement Kadane’s algorithm for maximum subarray sum; smallest window containing all characters of another string.",
    technicalQuestions:
      "Explain ACID properties in databases; how would you design a simple inventory system; what is the difference between REST and RPC.",
    hrQuestions:
      "How do you handle time pressure when debugging; tell me about a challenging bug you fixed; why Flipkart.",
    resourcesUsed:
      "LeetCode medium and hard tags, GFG articles on DP and sliding window, system design basics from YouTube.",
    tipsForCandidates:
      "Practice writing code on a whiteboard or plain editor; be ready to explain why you chose a particular data structure.",
    mistakesToAvoid:
      "Do not ignore complexity analysis; avoid coding silently—interviewers want to hear your reasoning.",
    date: "2025-10-25",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 7 — Internship (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "SRM University",
    branch: "IT",
    batchYear: 2025,
    isAnonymous: true,
    companyName: "Accenture",
    jobRole: "Associate Software Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Hyderabad",
    ctc: "₹42,000/month",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "HR"],
    difficultyLevel: "Easy",
    overallExperience:
      "Accenture’s process was relaxed and focused on communication skills along with basic aptitude. There was no heavy technical grilling, so it worked well for students from different branches. Overall it felt more like an evaluation of attitude and trainability than hardcore coding ability.",
    rounds: [
      {
        name: "Aptitude and Communication Test",
        description:
          "Included questions on logical reasoning, verbal ability, and basic numerical problems with moderate difficulty."
      },
      {
        name: "HR Interview",
        description:
          "Centered on behavioral questions, academic background, and willingness to adapt to different roles and locations."
      }
    ],
    codingQuestions: "",
    technicalQuestions: "",
    hrQuestions:
      "Tell me about yourself; describe a time you worked in a team; how do you handle criticism or feedback.",
    resourcesUsed:
      "Indiabix for aptitude practice, YouTube videos on HR interview preparation, mock interviews with friends.",
    tipsForCandidates:
      "Maintain good body language, listen carefully before answering, and always support your statements with real examples.",
    mistakesToAvoid:
      "Avoid giving one-word answers; don’t exaggerate your skills; do not memorize answers as they sound unnatural.",
    date: "2025-11-07",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 8 — Internship
  {
    fullName: "Shreya Singh",
    email: "shreya.singh@example.com",
    collegeName: "VIT Vellore",
    branch: "CSE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/shreya-singh-vit/",
    isAnonymous: false,
    companyName: "Adobe",
    jobRole: "Software Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Bangalore",
    ctc: "₹1,30,000/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "The Adobe interview experience was highly technical with a strong focus on data structures and problem solving. The interviewers were very experienced and often asked multiple follow-up questions on the same topic to test depth. It was demanding but also one of the best learning experiences I had.",
    rounds: [
      {
        name: "Online Coding Challenge",
        description:
          "Three DSA problems involving trees, heaps, and string manipulation with tight time constraints."
      },
      {
        name: "Technical Interview",
        description:
          "Focused on problem solving, debugging, and detailed project discussion including design decisions and trade-offs."
      },
      {
        name: "HR and Culture Fit Round",
        description:
          "Explored my motivations, long-term career goals, and how I prefer to work in teams and handle conflicts."
      }
    ],
    codingQuestions:
      "Top K frequent elements using heaps; serialize and deserialize a binary tree; longest palindromic substring.",
    technicalQuestions:
      "Explain how garbage collection works in managed languages; how do you optimize a slow SQL query; discuss big-O of your approaches.",
    hrQuestions:
      "Why do you want to work at Adobe; tell me about a time you handled conflict; describe a project you are most proud of.",
    resourcesUsed:
      "LeetCode hard problems, GFG advanced topics, Adobe-specific interview experiences from online blogs and seniors.",
    tipsForCandidates:
      "Spend time revising tree and graph problems; always talk through your approach clearly; prepare detailed stories for HR questions.",
    mistakesToAvoid:
      "Don’t ignore corner cases; avoid writing overly complex code when a simpler approach exists; do not neglect HR preparation.",
    date: "2025-10-30",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 9 — Internship
  {
    fullName: "Vishal Rao",
    email: "vishal.rao@example.com",
    collegeName: "PSG College of Technology",
    branch: "CSE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/vishal-rao-psg/",
    isAnonymous: false,
    companyName: "Walmart Global Tech",
    jobRole: "Software Intern",
    positionType: "Internship",
    interviewType: "Referral",
    jobLocation: "Chennai",
    ctc: "₹1,10,000/month",
    numberOfRounds: 2,
    roundTypes: ["Coding", "Technical"],
    difficultyLevel: "Hard",
    overallExperience:
      "Walmart Global Tech focused heavily on deep understanding of algorithms and trade-offs between different solutions. The number of rounds was fewer, but each round went into significant detail. Overall it was a very technical yet encouraging interview process.",
    rounds: [
      {
        name: "Coding Round",
        description:
          "Two high-difficulty questions on sliding window and graph traversal patterns with edge-case heavy inputs."
      },
      {
        name: "Technical Interview",
        description:
          "Discussion around problem solving, object-oriented design, and how to scale simple features into robust systems."
      }
    ],
    codingQuestions:
      "Longest substring without repeating characters; number of connected components in an undirected graph.",
    technicalQuestions:
      "Explain how caching improves performance; what is the difference between SQL and NoSQL; how would you design a leaderboard system.",
    hrQuestions:
      "How do you deal with time pressure; describe a project where you collaborated with others; why Walmart Global Tech.",
    resourcesUsed:
      "InterviewBit practice sets, LeetCode contest problems, YouTube system design primers for beginners.",
    tipsForCandidates:
      "Do not just memorize patterns; understand why a pattern works; always mention complexity and possible optimizations.",
    mistakesToAvoid:
      "Avoid ignoring edge cases such as empty arrays or large input sizes; don’t stay silent when thinking—share your reasoning.",
    date: "2025-11-15",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 10 — Internship
  {
    fullName: "Meena Joseph",
    email: "meena.joseph@example.com",
    collegeName: "Christ University",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/meena-joseph/",
    isAnonymous: false,
    companyName: "Oracle",
    jobRole: "Technical Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Bangalore",
    ctc: "₹75,000/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Medium",
    overallExperience:
      "Oracle’s internship interview process balanced theory and practice quite well. They tested SQL, database concepts, and basic algorithms but were also very interested in how I reasoned about real-world scenarios. It was structured, not rushed, and the interviewers were approachable.",
    rounds: [
      {
        name: "Coding and SQL Test",
        description:
          "Included one DSA question and several SQL queries requiring joins, groupings, and aggregations."
      },
      {
        name: "Technical Interview",
        description:
          "Focused on DBMS concepts, operating systems basics, and detailed discussion of academic projects."
      },
      {
        name: "HR Interview",
        description:
          "Covered cultural fit, long-term goals, and willingness to relocate or switch technology stacks."
      }
    ],
    codingQuestions:
      "Find the first non-repeating character in a string; write SQL to find top N customers by revenue.",
    technicalQuestions:
      "Explain ACID properties; what are different types of joins; difference between process and thread.",
    hrQuestions:
      "Why Oracle; are you comfortable working from office; how do you handle disagreements in a team.",
    resourcesUsed:
      "SQLBolt for SQL practice, GFG for DBMS and OS theory, mock interviews with friends focusing on SQL query writing.",
    tipsForCandidates:
      "Practice writing SQL by hand; focus on understanding indexes and query optimization basics; revise definitions of core OS concepts.",
    mistakesToAvoid:
      "Do not try to guess SQL syntax without understanding; avoid giving textbook answers without examples from your experience.",
    date: "2025-10-21",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // ===========================
  //        PLACEMENTS
  // ===========================

  // 11 — Placement
  {
    fullName: "Aman Patel",
    email: "aman.patel@example.com",
    collegeName: "NIT Trichy",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/aman-patel-nit/",
    isAnonymous: false,
    companyName: "Goldman Sachs",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "On-Campus",
    jobLocation: "Bangalore",
    ctc: "32 LPA",
    numberOfRounds: 4,
    roundTypes: ["Aptitude", "Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "The Goldman Sachs process was rigorous and multi-staged, with strong emphasis on problem solving, probability, and system design for finance-related use cases. Each round felt very professional and well structured. It was definitely one of the toughest but also most insightful interview journeys.",
    rounds: [
      {
        name: "Online Assessment",
        description:
          "Contained three challenging coding problems and multiple finance-flavored logical reasoning questions."
      },
      {
        name: "Technical Round One",
        description:
          "Focused on data structures, algorithms, and complexity, especially dynamic programming and graph questions."
      },
      {
        name: "Technical Round Two",
        description:
          "Discussed system design for real-time trade processing and stability under heavy load."
      },
      {
        name: "HR and Behavioral",
        description:
          "Centered on cultural fit, work ethic, and interest in the finance domain rather than just technology."
      }
    ],
    codingQuestions:
      "Design LRU Cache; maximum subarray sum with constraints; shortest path in a weighted graph.",
    technicalQuestions:
      "Explain database indexing; how would you design a high-frequency trading system; what are race conditions and how to prevent them.",
    hrQuestions:
      "Why Goldman Sachs; how do you handle stress; tell me about a time you failed and what you learned.",
    resourcesUsed:
      "LeetCode hard problems, competitive programming archives, system design videos tailored around finance systems.",
    tipsForCandidates:
      "Spend time on DP and graph problems; prepare at least one detailed system design; show genuine interest in the finance domain.",
    mistakesToAvoid:
      "Do not ignore probability and puzzles; avoid giving generic answers when asked about risk and responsibility.",
    date: "2025-11-01",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 12 — Placement (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "IIT Madras",
    branch: "CSE",
    batchYear: 2024,
    isAnonymous: true,
    companyName: "Atlassian",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "Off-Campus",
    jobLocation: "Remote",
    ctc: "43 LPA",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "Atlassian’s interview process was technically strong but also very humane. The interviewers were kind, gave hints when needed, and focused deeply on collaborative problem solving. They cared as much about communication and teamwork as about algorithmic skills, which made the whole process enjoyable.",
    rounds: [
      {
        name: "Coding Round",
        description:
          "Involved three coding questions emphasizing clean code, modularity, and test case discussion."
      },
      {
        name: "Technical System Design",
        description:
          "Focused on designing a scalable collaboration feature similar to comments or notifications in Jira."
      },
      {
        name: "Behavioral and Culture",
        description:
          "Discussed work style, collaboration, conflict resolution, and real examples of working on team projects."
      }
    ],
    codingQuestions:
      "Implement a Trie for autocomplete; design a simple rate limiter; group anagrams efficiently.",
    technicalQuestions:
      "How would you design a notification system; discuss eventual consistency; difference between monolith and microservices.",
    hrQuestions:
      "Describe a time you received critical feedback; why Atlassian; how do you approach working with remote teams.",
    resourcesUsed:
      "Atlassian engineering blog, LeetCode, mock system design interviews, and discussions with seniors working at product companies.",
    tipsForCandidates:
      "Focus on clarity and collaboration during interviews; break down problems into smaller steps and discuss trade-offs openly.",
    mistakesToAvoid:
      "Do not dominate the conversation; avoid hand-wavy answers in system design—back up your choices logically.",
    date: "2025-10-14",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 13 — Placement
  {
    fullName: "Harsh Jain",
    email: "harsh.jain@example.com",
    collegeName: "BITS Pilani",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/harsh-jain-bits/",
    isAnonymous: false,
    companyName: "Uber",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "Referral",
    jobLocation: "Hyderabad",
    ctc: "38 LPA",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "Uber’s interview rounds were focused on solving real-world problems at scale. The technical discussions were deep and often tied back to platform performance and reliability. It required good preparation but the interviewers were supportive and gave time to think.",
    rounds: [
      {
        name: "Coding Round",
        description:
          "Included algorithmic problems on graphs, heaps, and handling large datasets efficiently."
      },
      {
        name: "System Design Round",
        description:
          "Centered on designing components of a ride-sharing platform, including matching and surge pricing."
      },
      {
        name: "Behavioral Interview",
        description:
          "Discussed ownership, handling failures, and experiences working on complex long-term projects."
      }
    ],
    codingQuestions:
      "Merge k sorted lists; detect cycles in a directed graph; implement Dijkstra’s algorithm.",
    technicalQuestions:
      "Explain CAP theorem; how would you design trip-matching; how do you ensure idempotency in APIs.",
    hrQuestions:
      "Describe a time you made a mistake in a project; what motivates you; how do you handle conflicting priorities.",
    resourcesUsed:
      "LeetCode hard questions, Grokking the System Design Interview, blogs about Uber architecture.",
    tipsForCandidates:
      "Practice graph and heap problems; be ready to break down big systems into smaller components; use diagrams when explaining designs.",
    mistakesToAvoid:
      "Do not rush into a design without clarifying requirements; avoid ignoring failure scenarios and retries in system design.",
    date: "2025-11-09",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 14 — Placement
  {
    fullName: "Divya Sharma",
    email: "divya.sharma@example.com",
    collegeName: "PES University",
    branch: "IT",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/divya-sharma-pes/",
    isAnonymous: false,
    companyName: "Zoho",
    jobRole: "Software Developer",
    positionType: "Placement",
    interviewType: "On-Campus",
    jobLocation: "Chennai",
    ctc: "8 LPA",
    numberOfRounds: 3,
    roundTypes: ["Aptitude", "Coding", "Technical"],
    difficultyLevel: "Medium",
    overallExperience:
      "The Zoho selection process was more focused on logical reasoning and practical coding than on advanced algorithms. Rounds were long but the interviewers were patient and allowed us to think. It was a good opportunity for students comfortable with core programming rather than CP-heavy questions.",
    rounds: [
      {
        name: "Aptitude and Logic Test",
        description:
          "Contained logical puzzles, basic quantitative questions, and comprehension-based problems."
      },
      {
        name: "Coding and Debugging",
        description:
          "Involved writing small programs and debugging longer existing code snippets with logical errors."
      },
      {
        name: "Technical Interview",
        description:
          "Focused on C, Java basics, data structures, and detailed discussion on one main academic project."
      }
    ],
    codingQuestions:
      "Remove duplicates from a sorted array; implement a simple text editor with undo using stacks.",
    technicalQuestions:
      "Difference between array and linked list; explain how a stack works; how would you design a small notes application.",
    hrQuestions:
      "How do you normally debug issues; what type of work environment do you prefer; why Zoho.",
    resourcesUsed:
      "Company-specific preparation material shared by seniors, Zoho previous year questions, GFG for core data structures.",
    tipsForCandidates:
      "Practice writing code without relying on autocomplete; focus on clean and readable logic rather than fancy syntax.",
    mistakesToAvoid:
      "Do not underestimate the time required for long tests; avoid writing overly complex solutions for simple problems.",
    date: "2025-10-04",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 15 — Placement
  {
    fullName: "Snehal Desai",
    email: "snehal.desai@example.com",
    collegeName: "MIT Pune",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/snehal-desai-mit/",
    isAnonymous: false,
    companyName: "Oracle",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "Off-Campus",
    jobLocation: "Bangalore",
    ctc: "17 LPA",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Medium",
    overallExperience:
      "The Oracle FTE process extended the internship style by going deeper into databases and system concepts. The coding questions were moderate, but the interviewers expected strong clarity in DBMS, SQL, and operating systems. Overall, it felt fair and academic friendly.",
    rounds: [
      {
        name: "Coding Online Test",
        description:
          "Contained two moderate coding questions and a few MCQs on CS fundamentals like DBMS and OS."
      },
      {
        name: "Technical Interview",
        description:
          "Focused heavily on SQL queries, transaction isolation levels, and questions from operating systems."
      },
      {
        name: "HR Round",
        description:
          "Discussed long-term goals, interest in database technologies, and general culture-fit questions."
      }
    ],
    codingQuestions:
      "Find the longest common prefix in an array of strings; rotate an array by K positions.",
    technicalQuestions:
      "Explain different types of joins; what is a deadlock; how do indexes speed up queries and when can they hurt performance.",
    hrQuestions:
      "Why are you interested in Oracle; how do you handle tight deadlines; describe a time you resolved a conflict in a team.",
    resourcesUsed:
      "GFG for DBMS and OS, SQL practice on HackerRank, Oracle-specific interview experiences from online forums.",
    tipsForCandidates:
      "Focus on writing correct and efficient SQL; understand transaction concepts properly; revise OS basics like scheduling and deadlocks.",
    mistakesToAvoid:
      "Do not claim strong SQL skills without proper practice; avoid confusing normalization forms and giving vague answers.",
    date: "2025-11-11",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 16 — Placement (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "NIT Calicut",
    branch: "ECE",
    batchYear: 2024,
    isAnonymous: true,
    companyName: "Accolite Digital",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "On-Campus",
    jobLocation: "Bangalore",
    ctc: "11 LPA",
    numberOfRounds: 2,
    roundTypes: ["Coding", "Technical"],
    difficultyLevel: "Medium",
    overallExperience:
      "Accolite’s process was compact with only two rounds but each round went fairly deep. They emphasized clean coding, debugging skills, and the ability to explain design choices. It felt like a good fit for students who enjoy both coding and discussing architecture.",
    rounds: [
      {
        name: "Coding and Debugging Round",
        description:
          "Required writing code for two problems and debugging a partially written implementation to fix logical issues."
      },
      {
        name: "Technical Interview",
        description:
          "Included questions on design patterns, basic system design, and detailed follow-ups on one key project."
      }
    ],
    codingQuestions:
      "Sort elements by frequency; check if two strings are anagrams ignoring spaces.",
    technicalQuestions:
      "Explain normalization; what are common design patterns you know; how would you design a URL shortener.",
    hrQuestions:
      "How do you stay updated with new technologies; describe a time you refactored messy code; what kind of team do you thrive in.",
    resourcesUsed:
      "Striver’s A2Z DSA list, system design introductory videos, notes on common design patterns like Singleton and Factory.",
    tipsForCandidates:
      "Brush up on at least a few design patterns; practice code debugging and refactoring on existing codebases.",
    mistakesToAvoid:
      "Do not say you know design patterns without being able to give concrete examples; avoid over-engineering simple solutions.",
    date: "2025-10-27",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 17 — Placement
  {
    fullName: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    collegeName: "VIT Vellore",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/rahul-sharma-vit/",
    isAnonymous: false,
    companyName: "Paytm",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "Referral",
    jobLocation: "Noida",
    ctc: "19 LPA",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Medium",
    overallExperience:
      "The Paytm interview process focused on real-world problem solving rather than highly theoretical topics. There was a lot of emphasis on understanding product behavior, application performance, and handling user-facing issues. It felt like a very practical interview loop.",
    rounds: [
      {
        name: "Coding Round",
        description:
          "Two DSA questions mostly around arrays, hashing, and sliding window patterns."
      },
      {
        name: "Technical Interview",
        description:
          "Covered API design, error handling, logging strategies, and how to handle high traffic situations."
      },
      {
        name: "HR and Product Fit",
        description:
          "Discussed alignment with Paytm’s vision, past experiences in building products, and adaptability to fast-paced work."
      }
    ],
    codingQuestions:
      "Longest substring with at most K distinct characters; find the first missing positive integer.",
    technicalQuestions:
      "Explain how you would design a payment API; how do you handle retries; what is idempotency and why is it important.",
    hrQuestions:
      "Why Paytm; how do you react when something you built fails in production; describe a time you went out of your comfort zone.",
    resourcesUsed:
      "GFG for DSA, Paytm tech blogs, mock interviews with friends focusing on product design scenarios.",
    tipsForCandidates:
      "Think from a user perspective when answering questions; highlight times you handled production-like issues or debugging.",
    mistakesToAvoid:
      "Do not stay purely theoretical; avoid giving answers that ignore user experience or real-world constraints.",
    date: "2025-11-14",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 18 — Placement
  {
    fullName: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    collegeName: "SRM University",
    branch: "IT",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/kavya-iyer-srm/",
    isAnonymous: false,
    companyName: "HCL Technologies",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "On-Campus",
    jobLocation: "Chennai",
    ctc: "5 LPA",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "Technical"],
    difficultyLevel: "Easy",
    overallExperience:
      "HCL’s placement process was straightforward and beginner-friendly, ideal for students aiming for a service-based company. The focus was on basic aptitude and core CS fundamentals instead of advanced algorithms, which made the experience less intimidating for many.",
    rounds: [
      {
        name: "Aptitude Test",
        description:
          "Included straightforward questions from quantitative aptitude, logical reasoning, and basic English grammar."
      },
      {
        name: "Technical Interview",
        description:
          "Involved questions around OOP concepts, database basics, and a few simple programming logic questions."
      }
    ],
    codingQuestions:
      "Check whether a string is a palindrome; print Fibonacci series up to N.",
    technicalQuestions:
      "Explain the concept of a class and object; what are primary keys; difference between while and for loops.",
    hrQuestions:
      "Are you comfortable working in shifts; how do you handle repetitive tasks; why did you choose IT as your branch.",
    resourcesUsed:
      "Campus placement training material, GFG basics for OOP and DBMS, aptitude books like RS Aggarwal.",
    tipsForCandidates:
      "Revise your first and second-year subjects well; practice a few mock aptitude tests to build speed and confidence.",
    mistakesToAvoid:
      "Do not ignore simple programming questions; avoid saying you are not comfortable relocating if you really are flexible.",
    date: "2025-10-16",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 19 — Placement
  {
    fullName: "Tanmay Joshi",
    email: "tanmay.joshi@example.com",
    collegeName: "IIIT Bangalore",
    branch: "CSE",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/tanmay-joshi-iiit/",
    isAnonymous: false,
    companyName: "PhonePe",
    jobRole: "Software Engineer",
    positionType: "Placement",
    interviewType: "Referral",
    jobLocation: "Bangalore",
    ctc: "29 LPA",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "PhonePe’s interview process was intense but extremely insightful, especially around distributed systems and performance. The interviewers encouraged me to think aloud and were patient even when I took time to arrive at solutions. Overall it felt like a deep dive into real engineering challenges.",
    rounds: [
      {
        name: "Coding Interview",
        description:
          "Consisted of medium to hard problems focusing on arrays, binary search patterns, and map-based solutions."
      },
      {
        name: "System Design Interview",
        description:
          "Discussed designing a UPI-like payment system with focus on consistency, fault tolerance, and scalability."
      },
      {
        name: "HR Interview",
        description:
          "Explored my motivations, past experiences in team projects, and interest in fintech products and challenges."
      }
    ],
    codingQuestions:
      "Binary search on answer approach for capacity to ship packages; design a data structure that supports O(1) insert, delete, and getRandom.",
    technicalQuestions:
      "Explain eventual consistency; what is the difference between synchronous and asynchronous communication; how would you handle duplicate transactions.",
    hrQuestions:
      "Why do you want to work in fintech; talk about a time you debugged a difficult production issue; how do you prioritize work.",
    resourcesUsed:
      "Grokking the Coding Interview, system design primers, PhonePe engineering blogs, and mock interviews with seniors.",
    tipsForCandidates:
      "Learn binary search patterns thoroughly; focus on distributed systems basics; be prepared with strong examples for behavioral questions.",
    mistakesToAvoid:
      "Do not jump into system design without clarifying scale and constraints; avoid ignoring failure and retry scenarios.",
    date: "2025-11-06",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  },

  // 20 — Placement (Anonymous)
  {
    fullName: "Anonymous Student",
    collegeName: "Jain University",
    branch: "CSE",
    batchYear: 2024,
    isAnonymous: true,
    companyName: "Deloitte",
    jobRole: "Analyst",
    positionType: "Placement",
    interviewType: "On-Campus",
    jobLocation: "Hyderabad",
    ctc: "7 LPA",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "HR"],
    difficultyLevel: "Easy",
    overallExperience:
      "The Deloitte analyst role interview was simple and primarily evaluated communication, analytical thinking, and general business awareness. There was no heavy technical content, which made it approachable for students from both CS and non-CS backgrounds. The overall atmosphere was friendly.",
    rounds: [
      {
        name: "Aptitude and Business Awareness Test",
        description:
          "Contained questions on logical reasoning, basic quantitative ability, and a few scenario-based business questions."
      },
      {
        name: "HR and Fitment Round",
        description:
          "Focused on personality, long-term plans, and how well the candidate fits into a client-facing consulting environment."
      }
    ],
    codingQuestions: "",
    technicalQuestions: "",
    hrQuestions:
      "Tell me about yourself; where do you see yourself in five years; how would you handle a difficult client situation.",
    resourcesUsed:
      "YouTube videos on consulting interviews, aptitude preparation websites, college placement training sessions.",
    tipsForCandidates:
      "Work on articulating your thoughts clearly; practice a few common HR questions and support answers with concrete examples.",
    mistakesToAvoid:
      "Do not speak negatively about previous experiences; avoid giving extremely generic responses with no personal touch.",
    date: "2025-10-23",
    status: "pending",
    verificationBadge: false,
    approvedAt: null,
    rejectedAt: null
  }
];


// ✅ Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Clear existing experiences (optional)
    console.log("🗑️ Clearing existing experiences...");
    await Experience.deleteMany({});
    console.log("✅ Existing experiences cleared!");

    // Insert new sample data
    console.log("📝 Inserting sample experiences...");
    const result = await Experience.insertMany(sampleExperiences);
    console.log(`✅ Successfully inserted ${result.length} experiences!`);

    // Display summary
    const total = await Experience.countDocuments();
    const pending = await Experience.countDocuments({ status: 'pending' });
    const placements = await Experience.countDocuments({ positionType: 'Placement' });
    const internships = await Experience.countDocuments({ positionType: 'Internship' });
    const anonymous = await Experience.countDocuments({ isAnonymous: true });

    console.log("\n📊 Database Summary:");
    console.log(`   Total Experiences: ${total}`);
    console.log(`   Pending Approval: ${pending}`);
    console.log(`   Placements: ${placements}`);
    console.log(`   Internships: ${internships}`);
    console.log(`   Anonymous: ${anonymous}`);

    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Disconnected from MongoDB");
    console.log("🎉 Seeding completed successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

// ✅ Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleExperiences };
