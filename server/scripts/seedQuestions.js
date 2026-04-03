// scripts/seedQuestions.js
// Run with: node scripts/seedQuestions.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question.js";

dotenv.config();

const questions = [
  // ==================== APTITUDE ====================
  // Level 1 - Basic
  { topic: "Aptitude", level: 1, question: "If a train travels 60 km in 1 hour, how far will it go in 3.5 hours?", options: ["180 km", "200 km", "210 km", "240 km"], answer: "210 km" },
  { topic: "Aptitude", level: 1, question: "What is 25% of 200?", options: ["25", "50", "75", "100"], answer: "50" },
  { topic: "Aptitude", level: 1, question: "A is twice as old as B. If B is 15, how old is A?", options: ["20", "25", "30", "35"], answer: "30" },
  { topic: "Aptitude", level: 1, question: "Find the next number: 2, 4, 8, 16, __", options: ["24", "32", "28", "36"], answer: "32" },
  { topic: "Aptitude", level: 1, question: "If 5 pens cost ₹50, what is the cost of 8 pens?", options: ["₹60", "₹70", "₹80", "₹90"], answer: "₹80" },
  // Level 2 - Intermediate
  { topic: "Aptitude", level: 2, question: "A man walks 1 km north, then 1 km east. How far is he from the start?", options: ["1 km", "√2 km", "2 km", "1.5 km"], answer: "√2 km" },
  { topic: "Aptitude", level: 2, question: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls?", options: ["15", "20", "25", "10"], answer: "20" },
  { topic: "Aptitude", level: 2, question: "A shopkeeper sells an article at 20% profit. If cost price is ₹500, what is selling price?", options: ["₹550", "₹600", "₹650", "₹700"], answer: "₹600" },
  { topic: "Aptitude", level: 2, question: "Two pipes fill a tank in 3 and 6 hours. How long together?", options: ["2 hours", "3 hours", "4 hours", "1.5 hours"], answer: "2 hours" },
  { topic: "Aptitude", level: 2, question: "The average of 5 numbers is 20. If one number is removed, the average becomes 15. What was the removed number?", options: ["30", "35", "40", "25"], answer: "40" },
  // Level 3 - Advanced
  { topic: "Aptitude", level: 3, question: "A sum doubles in 5 years at simple interest. What is the rate?", options: ["15%", "20%", "25%", "10%"], answer: "20%" },
  { topic: "Aptitude", level: 3, question: "In how many ways can 5 people be arranged in a row?", options: ["25", "60", "120", "720"], answer: "120" },
  { topic: "Aptitude", level: 3, question: "A boat goes 20 km upstream in 4 hours and downstream in 2 hours. Find speed of current.", options: ["2 km/h", "2.5 km/h", "3 km/h", "3.5 km/h"], answer: "2.5 km/h" },
  { topic: "Aptitude", level: 3, question: "If compound interest on ₹1000 for 2 years at 10% is?", options: ["₹200", "₹210", "₹220", "₹250"], answer: "₹210" },
  { topic: "Aptitude", level: 3, question: "A clock shows 3:15. What is the angle between the hands?", options: ["0°", "7.5°", "15°", "22.5°"], answer: "7.5°" },
  // Level 4 - Expert
  { topic: "Aptitude", level: 4, question: "Probability of getting at least one head in 3 coin tosses?", options: ["1/8", "3/8", "7/8", "1/2"], answer: "7/8" },
  { topic: "Aptitude", level: 4, question: "A works twice as fast as B. Together they finish in 6 days. How long for B alone?", options: ["9 days", "12 days", "15 days", "18 days"], answer: "18 days" },
  { topic: "Aptitude", level: 4, question: "LCM of 12, 15, and 20 is?", options: ["30", "60", "120", "180"], answer: "60" },
  { topic: "Aptitude", level: 4, question: "In a race of 200m, A beats B by 20m. If A's time is 25s, what is B's time?", options: ["25s", "27.78s", "28s", "30s"], answer: "27.78s" },
  { topic: "Aptitude", level: 4, question: "A cistern can be filled in 12 hours and leaked out in 20 hours. If both work, how long to fill?", options: ["20 hours", "25 hours", "30 hours", "35 hours"], answer: "30 hours" },
  // Level 5 - Master
  { topic: "Aptitude", level: 5, question: "Train A (120m) at 54 km/h crosses Train B (80m) at 36 km/h (opposite direction). Time?", options: ["6s", "8s", "10s", "12s"], answer: "8s" },
  { topic: "Aptitude", level: 5, question: "Number of ways to choose 3 from 7?", options: ["21", "35", "42", "210"], answer: "35" },
  { topic: "Aptitude", level: 5, question: "A mixture of 40L has milk and water in 3:1. How much water to add for 2:1 ratio?", options: ["5L", "10L", "15L", "20L"], answer: "10L" },
  { topic: "Aptitude", level: 5, question: "Population grows at 10% annually. If current is 10000, what after 2 years?", options: ["11000", "12000", "12100", "11100"], answer: "12100" },
  { topic: "Aptitude", level: 5, question: "A man invests ₹5000 at 8% CI compounded quarterly for 1 year. Amount?", options: ["₹5400", "₹5412.16", "₹5406", "₹5420"], answer: "₹5412.16" },

  // ==================== TECHNICAL ====================
  // Level 1 - Basic
  { topic: "Technical", level: 1, question: "What does HTML stand for?", options: ["Hyper Trainer Markup Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Text Markup Leveler"], answer: "Hyper Text Markup Language" },
  { topic: "Technical", level: 1, question: "Which language is used for styling web pages?", options: ["HTML", "JQuery", "CSS", "XML"], answer: "CSS" },
  { topic: "Technical", level: 1, question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor Unified"], answer: "Central Processing Unit" },
  { topic: "Technical", level: 1, question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Array", "Tree"], answer: "Queue" },
  { topic: "Technical", level: 1, question: "What is the default port for HTTP?", options: ["21", "22", "80", "443"], answer: "80" },
  // Level 2
  { topic: "Technical", level: 2, question: "Which protocol is used for secure communication over a network?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: "HTTPS" },
  { topic: "Technical", level: 2, question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: "O(log n)" },
  { topic: "Technical", level: 2, question: "Which of the following is not a programming paradigm?", options: ["OOP", "Functional", "Procedural", "Networking"], answer: "Networking" },
  { topic: "Technical", level: 2, question: "What is a foreign key in a database?", options: ["Primary key in another table", "A key used for encryption", "Index of the table", "A unique identifier"], answer: "Primary key in another table" },
  { topic: "Technical", level: 2, question: "REST API stands for?", options: ["Representational State Transfer", "Real-time Event Server Technology", "Remote Execution Standard Transfer", "React State Transfer"], answer: "Representational State Transfer" },
  // Level 3
  { topic: "Technical", level: 3, question: "What is the difference between TCP and UDP?", options: ["TCP is connectionless", "UDP guarantees delivery", "TCP is connection-oriented and reliable", "There is no difference"], answer: "TCP is connection-oriented and reliable" },
  { topic: "Technical", level: 3, question: "What is a deadlock in operating systems?", options: ["When memory overflows", "When two processes wait for each other indefinitely", "When CPU utilization is 100%", "When disk is full"], answer: "When two processes wait for each other indefinitely" },
  { topic: "Technical", level: 3, question: "Which sorting algorithm has worst case O(n log n)?", options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Selection Sort"], answer: "Merge Sort" },
  { topic: "Technical", level: 3, question: "What is normalization in databases?", options: ["Increasing data redundancy", "Reducing data redundancy", "Adding more tables", "Encrypting data"], answer: "Reducing data redundancy" },
  { topic: "Technical", level: 3, question: "What is polymorphism in OOP?", options: ["Hiding data", "Same interface, different implementations", "Creating objects", "Inheriting classes"], answer: "Same interface, different implementations" },
  // Level 4
  { topic: "Technical", level: 4, question: "What is the CAP theorem?", options: ["Consistency, Availability, Partition Tolerance", "Cache, API, Protocol", "Compute, Allocate, Process", "Control, Access, Permission"], answer: "Consistency, Availability, Partition Tolerance" },
  { topic: "Technical", level: 4, question: "Which design pattern ensures only one instance of a class?", options: ["Factory", "Observer", "Singleton", "Strategy"], answer: "Singleton" },
  { topic: "Technical", level: 4, question: "What is the purpose of an index in a database?", options: ["Encrypt data", "Speed up queries", "Normalize tables", "Create backups"], answer: "Speed up queries" },
  { topic: "Technical", level: 4, question: "What is a microservice architecture?", options: ["Monolithic app with modules", "Small, independent services communicating via APIs", "A type of database", "A frontend framework"], answer: "Small, independent services communicating via APIs" },
  { topic: "Technical", level: 4, question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Data", "Automated, Computed, Indexed, Distributed", "None of the above"], answer: "Atomicity, Consistency, Isolation, Durability" },
  // Level 5
  { topic: "Technical", level: 5, question: "What is eventual consistency?", options: ["Data is always consistent", "All nodes agree after some time", "Data is never consistent", "Only master has latest data"], answer: "All nodes agree after some time" },
  { topic: "Technical", level: 5, question: "What is the difference between horizontal and vertical scaling?", options: ["Horizontal adds more machines, vertical adds more power", "They are the same", "Vertical adds machines", "Horizontal adds more CPU"], answer: "Horizontal adds more machines, vertical adds more power" },
  { topic: "Technical", level: 5, question: "What is a load balancer?", options: ["Distributes traffic across servers", "Stores session data", "Compresses responses", "Encrypts requests"], answer: "Distributes traffic across servers" },
  { topic: "Technical", level: 5, question: "What is sharding in databases?", options: ["Splitting data across multiple databases", "Encrypting data", "Creating backups", "Indexing tables"], answer: "Splitting data across multiple databases" },
  { topic: "Technical", level: 5, question: "What is the time complexity of Dijkstra's algorithm with adjacency matrix?", options: ["O(V)", "O(V²)", "O(V log V)", "O(E log V)"], answer: "O(V²)" },

  // ==================== CODING ====================
  // Level 1
  { topic: "Coding", level: 1, question: "What is the output of: console.log(typeof null)?", options: ["null", "undefined", "object", "boolean"], answer: "object" },
  { topic: "Coding", level: 1, question: "Which keyword declares a constant in JavaScript?", options: ["var", "let", "const", "static"], answer: "const" },
  { topic: "Coding", level: 1, question: "What is the output of: print(2 ** 3) in Python?", options: ["6", "8", "9", "5"], answer: "8" },
  { topic: "Coding", level: 1, question: "Which method adds an element at the end of an array in JavaScript?", options: ["pop()", "push()", "shift()", "unshift()"], answer: "push()" },
  { topic: "Coding", level: 1, question: "What does === check in JavaScript?", options: ["Only value", "Only type", "Value and type", "Neither"], answer: "Value and type" },
  // Level 2
  { topic: "Coding", level: 2, question: "What is a closure in JavaScript?", options: ["A function within a function that retains access to outer scope", "A loop structure", "A type of array", "An error handler"], answer: "A function within a function that retains access to outer scope" },
  { topic: "Coding", level: 2, question: "What is the output: [1,2,3].map(x => x*2)?", options: ["[2,4,6]", "[1,2,3]", "[1,4,9]", "Error"], answer: "[2,4,6]" },
  { topic: "Coding", level: 2, question: "What does 'hoisting' mean in JavaScript?", options: ["Moving declarations to top of scope", "Importing modules", "Creating closures", "Error handling"], answer: "Moving declarations to top of scope" },
  { topic: "Coding", level: 2, question: "Which Python built-in function returns length of a list?", options: ["count()", "size()", "len()", "length()"], answer: "len()" },
  { topic: "Coding", level: 2, question: "What is the difference between == and === in JavaScript?", options: ["No difference", "== checks type, === doesn't", "=== checks type AND value, == only value", "=== is deprecated"], answer: "=== checks type AND value, == only value" },
  // Level 3
  { topic: "Coding", level: 3, question: "What is the output: '5' + 3 in JavaScript?", options: ["8", "53", "Error", "undefined"], answer: "53" },
  { topic: "Coding", level: 3, question: "What is a Promise in JavaScript?", options: ["A synchronous operation", "An object representing eventual completion of async operation", "A loop", "A data type"], answer: "An object representing eventual completion of async operation" },
  { topic: "Coding", level: 3, question: "What is the time complexity of Array.sort() in JavaScript?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: "O(n log n)" },
  { topic: "Coding", level: 3, question: "What does the 'this' keyword refer to in an arrow function?", options: ["The function itself", "The calling object", "The enclosing lexical context", "undefined"], answer: "The enclosing lexical context" },
  { topic: "Coding", level: 3, question: "Which data structure uses key-value pairs?", options: ["Array", "Stack", "HashMap/Dictionary", "Queue"], answer: "HashMap/Dictionary" },
  // Level 4
  { topic: "Coding", level: 4, question: "What is memoization?", options: ["Storing results of expensive function calls", "Memorizing code syntax", "A design pattern", "A type of loop"], answer: "Storing results of expensive function calls" },
  { topic: "Coding", level: 4, question: "What is the event loop in Node.js?", options: ["A for loop", "Mechanism that handles async callbacks", "A database query tool", "A package manager"], answer: "Mechanism that handles async callbacks" },
  { topic: "Coding", level: 4, question: "Difference between deep copy and shallow copy?", options: ["No difference", "Deep copy copies nested objects, shallow doesn't", "Shallow copy copies nested objects", "Both copy everything"], answer: "Deep copy copies nested objects, shallow doesn't" },
  { topic: "Coding", level: 4, question: "What is currying in functional programming?", options: ["Transforming a function with multiple args into sequence of single-arg functions", "Cooking technique", "Error handling pattern", "A debugging tool"], answer: "Transforming a function with multiple args into sequence of single-arg functions" },
  { topic: "Coding", level: 4, question: "What is the output: console.log(0.1 + 0.2 === 0.3)?", options: ["true", "false", "undefined", "Error"], answer: "false" },
  // Level 5
  { topic: "Coding", level: 5, question: "What is a generator function in JavaScript?", options: ["A function that generates HTML", "A function that can pause and resume execution using yield", "A constructor function", "A recursive function"], answer: "A function that can pause and resume execution using yield" },
  { topic: "Coding", level: 5, question: "What is the Proxy object used for in JavaScript?", options: ["Network requests", "Intercepting and customizing operations on objects", "Creating databases", "Styling elements"], answer: "Intercepting and customizing operations on objects" },
  { topic: "Coding", level: 5, question: "What pattern does React use for state management?", options: ["MVC", "Unidirectional data flow", "MVVM", "Observer only"], answer: "Unidirectional data flow" },
  { topic: "Coding", level: 5, question: "What is tail call optimization?", options: ["Optimizing the first call", "Reusing the current stack frame for recursive tail calls", "Caching function results", "Removing unused functions"], answer: "Reusing the current stack frame for recursive tail calls" },
  { topic: "Coding", level: 5, question: "What is the purpose of WeakMap in JavaScript?", options: ["Map with weak references allowing garbage collection of keys", "A smaller Map", "A Map that only stores strings", "An immutable Map"], answer: "Map with weak references allowing garbage collection of keys" },

  // ==================== HR ====================
  // Level 1
  { topic: "HR", level: 1, question: "Tell me about yourself — what is the best approach?", options: ["Recite your resume", "Give a concise professional summary relevant to the role", "Talk about hobbies", "Start with your childhood"], answer: "Give a concise professional summary relevant to the role" },
  { topic: "HR", level: 1, question: "Why do you want this job?", options: ["For the salary", "Because my friend works here", "The role aligns with my skills and career goals", "I need any job"], answer: "The role aligns with my skills and career goals" },
  { topic: "HR", level: 1, question: "What is your greatest strength?", options: ["I have no weaknesses", "A specific skill backed with example", "Everything", "I am perfect"], answer: "A specific skill backed with example" },
  { topic: "HR", level: 1, question: "Where do you see yourself in 5 years?", options: ["In your chair", "Growing within the company in a leadership role", "I don't plan ahead", "Running my own company"], answer: "Growing within the company in a leadership role" },
  { topic: "HR", level: 1, question: "Why should we hire you?", options: ["Because I need money", "I bring unique skills, experience, and cultural fit", "I am the only applicant", "Because I said so"], answer: "I bring unique skills, experience, and cultural fit" },
  // Level 2
  { topic: "HR", level: 2, question: "Describe a time you worked in a team.", options: ["I prefer solo work", "Use STAR method to describe a collaborative experience", "I did all the work myself", "Teams are inefficient"], answer: "Use STAR method to describe a collaborative experience" },
  { topic: "HR", level: 2, question: "How do you handle stress?", options: ["I never get stressed", "I prioritize, take breaks, and stay organized", "I panic", "I ignore it"], answer: "I prioritize, take breaks, and stay organized" },
  { topic: "HR", level: 2, question: "What does STAR method stand for?", options: ["Situation, Task, Action, Result", "Start, Think, Act, Review", "Strategy, Team, Approach, Report", "None of the above"], answer: "Situation, Task, Action, Result" },
  { topic: "HR", level: 2, question: "What is your expected salary?", options: ["As much as possible", "Research market rate and give a reasonable range", "I don't care", "Double the market rate"], answer: "Research market rate and give a reasonable range" },
  { topic: "HR", level: 2, question: "How do you handle criticism?", options: ["I get defensive", "I listen, reflect, and use it to improve", "I ignore it", "I criticize back"], answer: "I listen, reflect, and use it to improve" },
  // Level 3
  { topic: "HR", level: 3, question: "Tell me about a time you failed.", options: ["I never fail", "Describe a real failure and what you learned from it", "Change the subject", "Blame someone else"], answer: "Describe a real failure and what you learned from it" },
  { topic: "HR", level: 3, question: "How would you handle a disagreement with your manager?", options: ["Argue loudly", "Discuss professionally and find common ground", "Complain to HR", "Ignore the manager"], answer: "Discuss professionally and find common ground" },
  { topic: "HR", level: 3, question: "What motivates you?", options: ["Only money", "Meaningful work, learning, and impact", "Nothing specific", "Avoiding work"], answer: "Meaningful work, learning, and impact" },
  { topic: "HR", level: 3, question: "Describe your leadership style.", options: ["Dictatorial", "Adaptive — depending on team and situation", "I'm not a leader", "Laissez-faire only"], answer: "Adaptive — depending on team and situation" },
  { topic: "HR", level: 3, question: "How do you prioritize tasks?", options: ["Random order", "Urgency and importance matrix", "Easiest first always", "I don't prioritize"], answer: "Urgency and importance matrix" },
  // Level 4
  { topic: "HR", level: 4, question: "How do you handle working with someone you don't like?", options: ["Avoid them", "Stay professional and focus on work goals", "Report them", "Quit the team"], answer: "Stay professional and focus on work goals" },
  { topic: "HR", level: 4, question: "What is emotional intelligence?", options: ["Being emotional", "Understanding and managing your own and others' emotions", "Having high IQ", "Being nice"], answer: "Understanding and managing your own and others' emotions" },
  { topic: "HR", level: 4, question: "How would you handle an ethical dilemma at work?", options: ["Ignore it", "Report through proper channels and follow company policy", "Side with the majority", "Quit immediately"], answer: "Report through proper channels and follow company policy" },
  { topic: "HR", level: 4, question: "Describe a time you went above and beyond.", options: ["I only do what's required", "Specific example showing initiative and impact", "I always go above and beyond", "I can't remember"], answer: "Specific example showing initiative and impact" },
  { topic: "HR", level: 4, question: "How do you stay updated with industry trends?", options: ["I don't", "Reading articles, courses, conferences, and networking", "Social media only", "My friends tell me"], answer: "Reading articles, courses, conferences, and networking" },
  // Level 5
  { topic: "HR", level: 5, question: "If you were CEO for a day, what would you change?", options: ["Fire everyone", "Identify a strategic improvement backed by reasoning", "Give myself a raise", "Nothing"], answer: "Identify a strategic improvement backed by reasoning" },
  { topic: "HR", level: 5, question: "How do you deal with ambiguity in a project?", options: ["Wait for instructions", "Ask clarifying questions, make assumptions, validate, iterate", "Guess and hope", "Refuse to work on it"], answer: "Ask clarifying questions, make assumptions, validate, iterate" },
  { topic: "HR", level: 5, question: "Describe a complex problem you solved.", options: ["I don't solve complex problems", "Use STAR to explain problem, analysis, and innovative solution", "I let others solve problems", "Complex problems don't exist"], answer: "Use STAR to explain problem, analysis, and innovative solution" },
  { topic: "HR", level: 5, question: "What makes a great company culture?", options: ["Free food", "Trust, transparency, growth, and purpose alignment", "No rules", "High salaries only"], answer: "Trust, transparency, growth, and purpose alignment" },
  { topic: "HR", level: 5, question: "How would you build a team from scratch?", options: ["Hire the cheapest people", "Define roles, assess skills/culture fit, foster collaboration", "Hire only friends", "Let HR handle it"], answer: "Define roles, assess skills/culture fit, foster collaboration" },

  // ==================== DSA ====================
  // Level 1
  { topic: "DSA", level: 1, question: "What is the time complexity of accessing an element in an array by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], answer: "O(1)" },
  { topic: "DSA", level: 1, question: "Which data structure follows LIFO principle?", options: ["Queue", "Stack", "Array", "LinkedList"], answer: "Stack" },
  { topic: "DSA", level: 1, question: "What is the space complexity of an array of size n?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: "O(n)" },
  { topic: "DSA", level: 1, question: "What is a linked list?", options: ["Array with extra memory", "Linear data structure where elements are linked using pointers", "A type of tree", "A graph algorithm"], answer: "Linear data structure where elements are linked using pointers" },
  { topic: "DSA", level: 1, question: "What is the worst-case time complexity of linear search?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: "O(n)" },
  // Level 2
  { topic: "DSA", level: 2, question: "What is the best-case time complexity of quicksort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: "O(n log n)" },
  { topic: "DSA", level: 2, question: "Which data structure is used for BFS traversal?", options: ["Stack", "Queue", "Heap", "Array"], answer: "Queue" },
  { topic: "DSA", level: 2, question: "What is a hash collision?", options: ["When hash function fails", "When two keys map to same index", "When hash table is full", "When key is null"], answer: "When two keys map to same index" },
  { topic: "DSA", level: 2, question: "In a binary search tree, where is the smallest element?", options: ["Root", "Rightmost node", "Leftmost node", "Any leaf node"], answer: "Leftmost node" },
  { topic: "DSA", level: 2, question: "What is the maximum number of nodes at level k of a binary tree?", options: ["k", "2k", "2^k", "k²"], answer: "2^k" },
  // Level 3
  { topic: "DSA", level: 3, question: "What is the time complexity of inserting into a balanced BST?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], answer: "O(log n)" },
  { topic: "DSA", level: 3, question: "Which algorithm finds the shortest path in a weighted graph?", options: ["BFS", "DFS", "Dijkstra's", "Prim's"], answer: "Dijkstra's" },
  { topic: "DSA", level: 3, question: "What is a min-heap?", options: ["Root is maximum", "Root is minimum and every parent ≤ children", "A sorted array", "A balanced BST"], answer: "Root is minimum and every parent ≤ children" },
  { topic: "DSA", level: 3, question: "What is topological sorting used for?", options: ["Sorting arrays", "Ordering tasks with dependencies (DAGs)", "Finding shortest path", "Balancing trees"], answer: "Ordering tasks with dependencies (DAGs)" },
  { topic: "DSA", level: 3, question: "What is the amortized time complexity of dynamic array insertion?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], answer: "O(1)" },
  // Level 4
  { topic: "DSA", level: 4, question: "What is dynamic programming?", options: ["Writing code dynamically", "Solving problems by breaking into overlapping subproblems", "A type of sorting", "Object-oriented design"], answer: "Solving problems by breaking into overlapping subproblems" },
  { topic: "DSA", level: 4, question: "What is the time complexity of building a heap from n elements?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], answer: "O(n)" },
  { topic: "DSA", level: 4, question: "What is a trie used for?", options: ["Sorting numbers", "Efficient string searching and prefix matching", "Graph traversal", "Matrix operations"], answer: "Efficient string searching and prefix matching" },
  { topic: "DSA", level: 4, question: "What is the difference between BFS and DFS?", options: ["BFS uses stack, DFS uses queue", "BFS explores level by level (queue), DFS goes deep (stack)", "They are identical", "BFS only works on trees"], answer: "BFS explores level by level (queue), DFS goes deep (stack)" },
  { topic: "DSA", level: 4, question: "What is backtracking?", options: ["Going back to previous page", "Trying all possibilities and undoing choices that don't work", "A sorting technique", "Database rollback"], answer: "Trying all possibilities and undoing choices that don't work" },
  // Level 5
  { topic: "DSA", level: 5, question: "What is the time complexity of the Knuth-Morris-Pratt (KMP) string matching algorithm?", options: ["O(n*m)", "O(n+m)", "O(n²)", "O(n log m)"], answer: "O(n+m)" },
  { topic: "DSA", level: 5, question: "What is a segment tree used for?", options: ["Sorting segments", "Efficient range queries and updates", "Drawing line segments", "Network routing"], answer: "Efficient range queries and updates" },
  { topic: "DSA", level: 5, question: "What is the Master Theorem used for?", options: ["Proving algorithms correct", "Solving divide-and-conquer recurrences", "Building master data", "None of the above"], answer: "Solving divide-and-conquer recurrences" },
  { topic: "DSA", level: 5, question: "What is the space complexity of merge sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: "O(n)" },
  { topic: "DSA", level: 5, question: "What is A* search algorithm?", options: ["A basic search", "Informed search using heuristics and cost to find optimal path", "A sorting algorithm", "A encryption method"], answer: "Informed search using heuristics and cost to find optimal path" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear old questions
    await Question.deleteMany({});
    console.log("Cleared old questions");

    // Insert new questions
    const result = await Question.insertMany(questions);
    console.log(`Seeded ${result.length} questions across 5 topics × 5 levels`);

    // Summary
    const topics = ["Aptitude", "Technical", "Coding", "HR", "DSA"];
    for (const topic of topics) {
      for (let level = 1; level <= 5; level++) {
        const count = result.filter(
          (q) => q.topic === topic && q.level === level
        ).length;
        console.log(`  ${topic} Level ${level}: ${count} questions`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
