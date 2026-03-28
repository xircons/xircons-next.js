import type { PortfolioContent } from '@/types/portfolio'

export const PORTFOLIO_VERSION = '1.0.0'

export const portfolioData: PortfolioContent = {
  about: {
    title: "HELLO! I'M XIRCONS",
    description:
      'Sawaddeekub, I am Wuttikan, a DII student at Chiang Mai University with a passion for web design and development. Explore my repositories to see what I’ve been working on.',
  },
  works: [
    {
      id: 1,
      title: 'iCAS-CMU HUB',
      description:
        'A web app I built for our university clubs so admins, leaders, and members can work in one place. You can join clubs, see events on a calendar, hand in assignments, chat in real time, and leaders can also manage documents and budgets.',
      stack: [
        'React',
        'TypeScript',
        'Tailwind',
        'Node.js',
        'Express',
        'MySQL',
        'Socket.io',
        'Docker',
      ],
    },
    {
      id: 2,
      title: 'NinjaLingo',
      description:
        'A flashcard web app I built so people can study and track their progress. I also wrote a custom script to convert vocabulary CSV files into JSON to easily import data. Users sign in to review cards, and admins manage the sets.',
      stack: ['Astro', 'React', 'TypeScript', 'Node.js', 'Firebase', 'PostgreSQL'],
    },
    {
      id: 3,
      title: 'store.atelien',
      description:
        'An e-commerce website I made for a school project. People can sign up, browse products, use a cart and checkout, and there is an admin area to manage orders, products, and coupons.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'SQLite', 'JWT'],
    },
    {
      id: 4,
      title: 'Tic-Tac-Toe with AI',
      description:
        'A tic-tac-toe game I built where you can play against the computer or with a friend. The computer has different levels, and on the hardest level it plays very strong so it is almost impossible to beat.',
      stack: ['React', 'Vite', 'Redux', 'Python', 'Flask'],
    },
    {
      id: 5,
      title: 'React Farm Life Cycle',
      description:
        'A relaxing farm game I made in the browser. You grow crops, sell at a changing market, do small contracts, craft items, and save your farm in the browser.',
      stack: ['React', 'Redux', 'Tailwind', 'Axios'],
    },
    {
      id: 6,
      title: 'Good Night Hostel',
      description:
        'A booking website and staff dashboard I built for a hostel. Guests can look at rooms and switch languages, while staff can manage bookings, housekeeping, and view charts in their own admin area.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
    },
  ],
  skills: [
    {
      id: '00-1',
      title: 'FRONTEND ENGINEERING',
      details: ['REACT & NEXT.JS', 'TAILWIND CSS', 'RESPONSIVE UI', 'COMPONENT DESIGN'],
    },
    {
      id: '00-2',
      title: 'MOTION & INTERACTION',
      details: ['FRAMER MOTION', 'SCROLL ANIMATIONS', 'MICRO-INTERACTIONS', 'CSS TRANSITIONS'],
    },
    {
      id: '00-3',
      title: 'BACKEND & APIS',
      details: ['NODE.JS & EXPRESS', 'PYTHON FLASK', 'RESTFUL ROUTING', 'USER AUTHENTICATION'],
    },
    {
      id: '00-4',
      title: 'DATABASES & DATA',
      details: ['MYSQL & POSTGRESQL', 'SQLITE', 'FIREBASE', 'DATA STRUCTURING'],
    },
    {
      id: '00-5',
      title: 'END-TO-END DEVELOPMENT',
      details: [
        'FULL-STACK FLOW',
        'FRONTEND + BACKEND WIRING',
        'DEPLOYMENT & HOSTING',
        'DEBUGGING & ITERATION',
      ],
    },
  ],
} as const satisfies PortfolioContent
