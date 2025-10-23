const mongoose = require("mongoose");
const Experience = require("./Experience"); // adjust path if needed

// ✅ MongoDB connection URL
const MONGO_URI = "mongodb://127.0.0.1:27017/placify"; // change if needed

// ✅ Sample Data
const sampleExperiences = [
  {
    fullName: "Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    collegeName: "XYZ Institute of Technology",
    branch: "CSE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/ananyasharma/",
    isAnonymous: false,
    companyName: "Amazon",
    jobRole: "Software Development Engineer Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Bangalore, India",
    ctc: "₹1,00,000/month",
    numberOfRounds: 3,
    roundTypes: ["Aptitude", "Coding", "Technical"],
    difficultyLevel: "Medium",
    overallExperience:
      "The process was smooth, and the interviewers were friendly. The focus was on coding and analytical thinking rather than syntax perfection.",
    rounds: [
      {
        name: "Online Assessment",
        description:
          "2 DSA questions on arrays and strings, plus 20 MCQs on aptitude and reasoning.",
      },
      {
        name: "Technical Round",
        description:
          "Focused on data structures and OOP concepts. Asked to explain my final-year project.",
      },
      {
        name: "HR Round",
        description:
          "Basic behavioral questions and discussion about internship duration and expectations.",
      },
    ],
    codingQuestions: "Find longest palindromic substring, implement LRU Cache.",
    technicalQuestions: "Explain inheritance in OOP, ACID properties in DBMS.",
    hrQuestions: "Tell me about yourself, What are your strengths and weaknesses?",
    resourcesUsed: "Striver’s SDE Sheet, LeetCode, InterviewBit",
    tipsForCandidates:
      "Revise key DSA patterns and communicate your approach clearly.",
    mistakesToAvoid: "Avoid writing unoptimized brute-force solutions.",
    date: "2025-09-10",
  },
  {
    fullName: "Rahul Verma",
    email: "rahulverma23@gmail.com",
    collegeName: "ABC College of Engineering",
    branch: "IT",
    batchYear: 2024,
    linkedinUrl: "https://www.linkedin.com/in/rahulverma/",
    isAnonymous: true,
    companyName: "TCS Digital",
    jobRole: "Software Engineer Intern",
    positionType: "Internship",
    interviewType: "On-Campus",
    jobLocation: "Hyderabad",
    ctc: "₹50,000/month",
    numberOfRounds: 2,
    roundTypes: ["Aptitude", "HR"],
    difficultyLevel: "Easy",
    overallExperience:
      "It was my first interview experience. The panel was encouraging and the questions were mostly conceptual.",
    rounds: [
      {
        name: "Online Test",
        description:
          "Included aptitude and logical reasoning followed by one coding question on arrays.",
      },
      {
        name: "HR Interview",
        description:
          "Asked about hobbies, academic performance, and teamwork.",
      },
    ],
    codingQuestions: "Rotate an array by K positions.",
    technicalQuestions: "Explain normalization, What is a primary key?",
    hrQuestions: "Why TCS? Tell me about a challenge you faced in college.",
    resourcesUsed: "GeeksforGeeks Aptitude, Indiabix, YouTube tutorials",
    tipsForCandidates: "Focus on fundamentals and keep calm during HR rounds.",
    mistakesToAvoid: "Over-explaining small questions.",
    date: "2025-08-22",
  },
  {
    fullName: "Sneha Patel",
    email: "sneha.patel21@gmail.com",
    collegeName: "PQR Institute of Technology",
    branch: "ECE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/snehapatel/",
    isAnonymous: false,
    companyName: "Google",
    jobRole: "STEP Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Remote",
    ctc: "$6,000/month",
    numberOfRounds: 2,
    roundTypes: ["Coding", "Technical"],
    difficultyLevel: "Hard",
    overallExperience:
      "A very professional and interactive experience. The interviewers emphasized logical thinking and teamwork.",
    rounds: [
      {
        name: "Coding Interview",
        description: "2 medium-level problems on strings and arrays.",
      },
      {
        name: "Behavioral Interview",
        description: "Focused on my project and how I work in teams.",
      },
    ],
    codingQuestions: "Group anagrams, find subarray with given sum.",
    technicalQuestions: "Explain time complexity, What are hashmaps used for?",
    hrQuestions: "Why Google? Describe a project you are proud of.",
    resourcesUsed: "LeetCode, Codeforces, YouTube - Kunal Kushwaha",
    tipsForCandidates:
      "Explain your thought process clearly. They value clarity over syntax.",
    mistakesToAvoid: "Not clarifying the question before solving.",
    date: "2025-07-18",
  },
  {
    fullName: "Vikram Nair",
    email: "vikram.nair99@gmail.com",
    collegeName: "Tech University Chennai",
    branch: "EEE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/vikramnair/",
    isAnonymous: false,
    companyName: "Microsoft",
    jobRole: "Software Engineering Intern",
    positionType: "Internship",
    interviewType: "Referral",
    jobLocation: "Hyderabad",
    ctc: "₹1,10,000/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "Challenging but rewarding experience. Questions were practical and deep in logic.",
    rounds: [
      {
        name: "Online Assessment",
        description: "3 coding questions on graphs, recursion, and strings.",
      },
      {
        name: "Technical Interview",
        description:
          "Asked to design a parking lot system and code an algorithm live.",
      },
      {
        name: "HR Interview",
        description:
          "Behavioral questions and discussion about long-term goals.",
      },
    ],
    codingQuestions: "Diameter of a binary tree, reverse linked list.",
    technicalQuestions: "Explain virtual memory, What is normalization?",
    hrQuestions: "Where do you see yourself in 5 years?",
    resourcesUsed: "Striver’s A2Z Sheet, GFG, InterviewBit",
    tipsForCandidates:
      "Be consistent in problem-solving and mock interviews.",
    mistakesToAvoid: "Neglecting communication skills.",
    date: "2025-06-29",
  },
  {
    fullName: "Karthik Reddy",
    email: "karthikreddy@gmail.com",
    collegeName: "National Institute of Technology, Trichy",
    branch: "CSE",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/karthikreddy/",
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
      "Very beginner-friendly process, focusing more on conceptual clarity and communication.",
    rounds: [
      {
        name: "Aptitude Test",
        description:
          "Logical reasoning, verbal ability, and one easy coding question.",
      },
      {
        name: "Technical Round",
        description:
          "Basics of OOP, DBMS, and some project-related questions.",
      },
    ],
    codingQuestions: "Reverse a string, find factorial using recursion.",
    technicalQuestions: "Explain join in SQL, What is inheritance?",
    hrQuestions: "Describe your college project briefly.",
    resourcesUsed: "GeeksforGeeks, PrepInsta",
    tipsForCandidates: "Keep answers short and confident.",
    mistakesToAvoid: "Ignoring aptitude preparation.",
    date: "2025-08-15",
  },
  {
    fullName: "Megha Gupta",
    email: "megha.gupta@gmail.com",
    collegeName: "SRM University",
    branch: "IT",
    batchYear: 2025,
    linkedinUrl: "https://www.linkedin.com/in/meghagupta/",
    isAnonymous: false,
    companyName: "Atlassian",
    jobRole: "Software Engineering Intern",
    positionType: "Internship",
    interviewType: "Off-Campus",
    jobLocation: "Remote",
    ctc: "$5,500/month",
    numberOfRounds: 3,
    roundTypes: ["Coding", "Technical", "HR"],
    difficultyLevel: "Hard",
    overallExperience:
      "Highly technical interview focused on problem-solving, system design, and communication.",
    rounds: [
      {
        name: "Coding Round",
        description: "3 DSA questions on linked lists and graphs.",
      },
      {
        name: "Technical Interview",
        description:
          "Asked to design a URL shortener and discuss optimization.",
      },
      {
        name: "HR Round",
        description:
          "Teamwork, leadership, and personal motivation questions.",
      },
    ],
    codingQuestions: "Detect cycle in a linked list, implement LRU cache.",
    technicalQuestions: "Explain RESTful APIs, What is caching?",
    hrQuestions: "Describe a conflict in a team and how you resolved it.",
    resourcesUsed: "LeetCode, YouTube mock interviews, System Design Primer",
    tipsForCandidates: "Focus on clarity and system thinking.",
    mistakesToAvoid: "Skipping mock interviews.",
    date: "2025-09-02",
  },
];

// ✅ Seed Function
async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Experience.deleteMany({});
    console.log("🗑️ Old data cleared");

    await Experience.insertMany(sampleExperiences);
    console.log("🌱 Sample experiences added successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
