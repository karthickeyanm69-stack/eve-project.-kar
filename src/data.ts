import { Course, DailyChallenge, AptitudeQuestion, MiniProject, Achievement, Guild, UserState } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'python-basics',
    title: 'Python Fundamentals',
    category: 'Programming Fundamentals',
    instructor: 'EVE AI Mentor',
    progress: 75,
    difficulty: 'Beginner',
    tags: ['Python', 'Fundamentals', 'Syntax'],
    lessons: [
      {
        id: 'py-01',
        title: 'Introduction to Python & Variables',
        type: 'reading',
        duration: '5m',
        xpValue: 40,
        completed: true,
        content: `### Welcome to Python!

Python is a high-level, interpreted programming language known for its readability and simplicity. Created by Guido van Rossum and released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant whitespace.

#### Basic Variables
In Python, you don't need to declare variable types explicitly. Typing is dynamic!

\`\`\`python
# Declaring variables
name = "Ananya"
xp = 1250
is_pro = True

print(f"User {name} has {xp} XP.")
\`\`\`
`
      },
      {
        id: 'py-02',
        title: 'Control Flow: If/Else & Loops',
        type: 'reading',
        duration: '7m',
        xpValue: 50,
        completed: true,
        content: `### Python Control Flow

Control flow dictates the order in which statements are executed. Python uses classic constructs like \`if\`, \`elif\`, \`else\`, as well as \`for\` and \`while\` loops.

#### Loop Example:
\`\`\`python
# Create a greeting loop
for i in range(5):
    print("Hello, World!", i + 1)

print("Loop complete!")
\`\`\`
`
      },
      {
        id: 'py-03',
        title: 'Understanding Functions & Returns',
        type: 'reading',
        duration: '10m',
        xpValue: 60,
        completed: true,
        content: `### Python Functions

A function is a block of organized, reusable code that is used to perform a single, related action. Functions provide better modularity for your application and a high degree of code reusing.

#### Defining Functions:
\`\`\`python
def greet_user(username, badge_count):
    sentence = f"Hello {username}! You have unlocked {badge_count} badges."
    return sentence

# Invoking function
message = greet_user("Ananya", 12)
print(message)
\`\`\`
`
      },
      {
        id: 'py-04',
        title: 'Interactive Quiz: Functions & Logic',
        type: 'quiz',
        duration: '10m',
        xpValue: 80,
        completed: true,
        content: 'Solve quiz related to variables and return statements.'
      },
      {
        id: 'py-05',
        title: 'Mini Project: Interactive Todo List CLI',
        type: 'assessment',
        duration: '15m',
        xpValue: 150,
        completed: false,
        content: 'Create a CLI system that lets users append and view tasks.'
      }
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures Masterclass',
    category: 'Algorithms',
    instructor: 'EVE Coach',
    progress: 20,
    difficulty: 'Intermediate',
    tags: ['DS', 'Linked Lists', 'Trees', 'Arrays'],
    lessons: [
      {
        id: 'ds-01',
        title: 'Arrays & Dynamic Tables',
        type: 'reading',
        duration: '12m',
        xpValue: 50,
        completed: true,
        content: 'Master dynamic arrays and index operations.'
      },
      {
        id: 'ds-02',
        title: 'Linked Lists (Singly & Doubly)',
        type: 'reading',
        duration: '15m',
        xpValue: 80,
        completed: false,
        content: 'Work across dynamic node configurations and circular references.'
      },
      {
        id: 'ds-03',
        title: 'Practice Trivia: Linked Nodes',
        type: 'quiz',
        duration: '5m',
        xpValue: 60,
        completed: false,
        content: 'Node pointer optimization test.'
      }
    ]
  },
  {
    id: 'system-design',
    title: 'System Design at Scale',
    category: 'System Design',
    instructor: 'Eve Career Coach',
    progress: 40,
    difficulty: 'Advanced',
    tags: ['Kafka', 'Microservices', 'Load Balancing'],
    lessons: [
      {
        id: 'sd-01',
        title: 'Decoupling with Message Queues',
        type: 'reading',
        duration: '15m',
        xpValue: 100,
        completed: true,
        content: 'Understanding how RabbitMQ and Kafka decouple high-throughput systems.'
      },
      {
        id: 'sd-02',
        title: 'Consistent Hashing and Load Balancers',
        type: 'reading',
        duration: '20m',
        xpValue: 120,
        completed: false,
        content: 'Distributing traffic gracefully across stateless microservices.'
      }
    ]
  }
];

export const INITIAL_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc-01',
    title: 'Two Sum Variant',
    difficulty: 'Beginner',
    description: 'Write a function that takes an array of numbers and a target value, returning the indices of the two numbers that add up to the target.',
    starterCode: `def two_sum(nums, target):
    # Write your elegant code here
    pass`,
    solutionTemplate: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    testCases: [
      { input: '[2, 7, 11, 15], 9', expected: '[0, 1]' },
      { input: '[3, 2, 4], 6', expected: '[1, 2]' }
    ],
    xpReward: 150,
    coinsReward: 30
  },
  {
    id: 'dc-02',
    title: 'FizzBuzz Extreme',
    difficulty: 'Beginner',
    description: 'Print numbers 1 to N, but print "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both.',
    starterCode: `def fizzbuzz(n):
    # Return array of list representation
    pass`,
    solutionTemplate: `def fizzbuzz(n):
    res = []
    for i in range(1, n + 1):
        if i % 3 == 0 and i % 5 == 0:
            res.append("FizzBuzz")
        elif i % 3 == 0:
            res.append("Fizz")
        elif i % 5 == 0:
            res.append("Buzz")
        else:
            res.append(str(i))
    return res`,
    testCases: [
      { input: '5', expected: `["1", "2", "Fizz", "4", "Buzz"]` }
    ],
    xpReward: 100,
    coinsReward: 20
  }
];

export const INITIAL_APTITUDE: AptitudeQuestion[] = [
  {
    id: 'apt-01',
    category: 'Logical Reasoning',
    question: 'If all program errors are failures, and some compilation reports are program errors, which of the following MUST be true?',
    options: [
      'All compilation reports are failures.',
      'Some compilation reports are failures.',
      'No compilation reports are failures.',
      'All failures are program errors.'
    ],
    correctIndex: 1,
    explanation: 'Since some compilation reports are program errors, and all program errors are failures, those compilation reports that are program errors must also be failures. Hence, some compilation reports are failures.'
  },
  {
    id: 'apt-02',
    category: 'Quantitative Aptitude',
    question: 'A computer program executes 100 loops of an algorithm in 0.25 seconds. At this rate, how many loops will the algorithm execute in 5 seconds?',
    options: [
      '1,200 loops',
      '2,000 loops',
      '2,500 loops',
      '3,000 loops'
    ],
    correctIndex: 1,
    explanation: 'Rate = 100 loops / 0.25 seconds = 400 loops per second. In 5 seconds, it will execute 400 * 5 = 2,000 loops.'
  },
  {
    id: 'apt-03',
    category: 'Programming Basics',
    question: 'What is the time complexity of searching in a perfectly balanced binary search tree containing N elements?',
    options: [
      'O(1)',
      'O(N)',
      'O(log N)',
      'O(N log N)'
    ],
    correctIndex: 2,
    explanation: 'With a balanced binary search tree, half of the elements are ignored in each decision step, which results in a logarithmic O(log N) operations.'
  }
];

export const INITIAL_PROJECTS: MiniProject[] = [
  {
    id: 'proj-01',
    title: 'Personalized Budget Calculator',
    level: 'Beginner',
    description: 'Build a system that reads incomes and expenses, calculates standard tax deductions, and prints a formatted financial health summary.',
    objective: 'Practice basic conditional arithmetic, string manipulation, and arrays.',
    steps: [
      'Accept multiple expense inputs',
      'Deduct savings goals first (15%)',
      'Categorize expenses into High/Medium priorities',
      'Print beautiful dashboard format with percentages'
    ],
    starterCode: `def plan_budget(income, expenses):
    # income: float, expenses: dict of category -> amount
    # return remaining and prioritizations
    pass`,
    checker: `def plan_budget(income, expenses):
    savings = income * 0.15
    total_exp = sum(expenses.values())
    remaining = income - savings - total_exp
    return {"savings": savings, "remaining": remaining}`
  },
  {
    id: 'proj-02',
    title: 'Distributed Analytics Cache Manager',
    level: 'Advanced',
    description: 'Implement a double-linked Least-Recently-Used (LRU) Cache policy that handles fast key lookup and invalidates expired tokens.',
    objective: 'Analyze dynamic object references, state storage, and custom dictionaries.',
    steps: [
      'Write DLL nodes representing metadata cache',
      'Implement get(key) with O(1) performance raising current node to priority',
      'Write set(key, value) maintaining strict size constraint capacity'
    ],
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        pass
    def get(self, key: int) -> int:
        return -1
    def put(self, key: int, value: int) -> None:
        pass`,
    checker: ''
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-01',
    title: 'Quick Learner',
    description: 'Finish any first reading lesson',
    progress: 1,
    maxProgress: 1,
    icon: 'emoji_events',
    type: 'course',
    unlockedAt: '2026-06-05T10:00:00Z'
  },
  {
    id: 'ach-02',
    title: 'Top Performer',
    description: 'Maintain over 90% score across 3 Practice Quizzes',
    progress: 2,
    maxProgress: 3,
    icon: 'verified',
    type: 'xp'
  },
  {
    id: 'ach-03',
    title: 'Consistent Learner',
    description: 'Achieve a 15-day learning streak',
    progress: 12,
    maxProgress: 15,
    icon: 'trending_up',
    type: 'streak'
  },
  {
    id: 'ach-04',
    title: 'Interview Master',
    description: 'Complete 5 AI career preparation session rounds with passing score (>70)',
    progress: 3,
    maxProgress: 5,
    icon: 'work',
    type: 'interview'
  },
  {
    id: 'ach-05',
    title: 'Problem Solver',
    description: 'Solve 10 compilation-validated coding challenges successfully',
    progress: 6,
    maxProgress: 10,
    icon: 'terminal',
    type: 'code'
  }
];

export const INITIAL_GUILDS: Guild[] = [
  {
    id: 'g-01',
    name: 'Hackers of EVE',
    tag: 'HOE',
    membersCount: 28,
    maxMembers: 30,
    totalXp: 45700,
    description: 'A community of hardcore algorithms enthusiasts preparing for top-tier competitive software matches and MAANG interviews.',
    joined: true,
    messages: [
      { sender: 'Raj Patel', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', text: 'Hey guys! EVE AI Mentor just published a super hard challenge on Dynamic Programming. Who is up for a pair programming session tonight?', timestamp: '08:15 AM' },
      { sender: 'Ananya Sharma', avatar: 'https://lh3.googleusercontent.com/aida/AP1WRLsaI4OAoQbQAxEYCS9faRJWp-5oE-KDaurFn6UQJhd_OLr3L2AUESaJ2CQcp03XWaDB-IJHY5LD5X-F4fy0XbU34bLo-4ng9yUDmbaljXLqLXhw7J-BtMEZRuU58LgclfrjNcpzv8qcSeZVXFnQanH66BYxfKTw_wjytwVQq2jKUndgjwOa0vFK6IX1XVE77c4IJPErmikgAYibo2c7zjwE2yf2OLjXheJn4yLHwEbhB5o2LNIUtUMY_AwA', text: 'I am in! Also solved the Logical reasoning aptitude. The consistent hashing lesson is amazing.', timestamp: '08:30 AM' }
    ]
  },
  {
    id: 'g-02',
    name: 'Byte Builders',
    tag: 'BYB',
    membersCount: 12,
    maxMembers: 50,
    totalXp: 18200,
    description: 'Full-stack software engineers and career switchers working on React, Express and Node.js mini portfolios.',
    joined: false,
    messages: []
  },
  {
    id: 'g-03',
    name: 'Prompt Alchemists',
    tag: 'PRA',
    membersCount: 45,
    maxMembers: 45,
    totalXp: 92800,
    description: 'Curious builders experimenting with generative LLM prompts, function calls, and machine learning architectures.',
    joined: false,
    messages: []
  }
];

export const INITIAL_USER: UserState = {
  displayName: 'Ananya Sharma',
  email: 'ananya@eve.com',
  isLoggedIn: true,
  level: 5,
  xp: 3200,
  nextLevelXp: 4500,
  streak: 45,
  coins: 480,
  careerReadinessScore: 84,
  activeCourseId: 'python-basics',
  activeLessonId: 'py-02',
  completedLessonIds: ['py-01', 'py-02', 'py-03', 'ds-01', 'sd-01'],
  badgesCount: 12,
  weeklyProgress: [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 200 },
    { day: 'Wed', xp: 150 },
    { day: 'Thu', xp: 320 },
    { day: 'Fri', xp: 180 },
    { day: 'Sat', xp: 250 },
    { day: 'Sun', xp: 100 }
  ]
};
