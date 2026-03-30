import type { PortfolioContent } from '@/types/portfolio'

export const PORTFOLIO_VERSION = '1.0.0'

// Mock mode: no real images yet; render plain grey blocks via ProjectMedia fallback.
const IMG = ''

export const portfolioData: PortfolioContent = {
  about: {
    title: "HELLO! I'M XIRCONS",
    description:
      'Sawaddeekub, I am Wuttikan, a web developer and DII student at Chiang Mai University in Chiang Mai, Thailand, focusing on full-stack web development and design. Explore my repositories to see what I’ve been working on.',
  },
  works: [
    {
      id: 2,
      slug: 'ninjalingo',
      title: 'NinjaLingo',
      subtitle: 'by Xircons',
      category: 'production',
      role: 'Full-stack developer',
      completedAt: '2024',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG, IMG],
      description:
        'A flashcard web app I built so people can study and track their progress. I also wrote a custom script to convert vocabulary CSV files into JSON to easily import data. Users sign in to review cards, and admins manage the sets.',
      stack: ['Astro', 'React', 'TypeScript', 'Node.js', 'Firebase', 'PostgreSQL'],
    },
    {
      id: 1,
      slug: 'icas-cmu-hub',
      title: 'iCAS-CMU HUB',
      subtitle: 'by Xircons',
      category: 'competition',
      role: 'Full-stack developer',
      completedAt: '2023',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG, IMG],
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
      id: 5,
      slug: 'react-farm-life-cycle',
      title: 'React Farm Life Cycle',
      subtitle: 'by Xircons',
      category: 'academic',
      role: 'Frontend developer',
      completedAt: '2023',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG],
      description:
        'A relaxing farm game I made in the browser. You grow crops, sell at a changing market, do small contracts, craft items, and save your farm in the browser.',
      stack: ['React', 'Redux', 'Tailwind', 'Axios'],
    },
    {
      id: 3,
      slug: 'store-atelien',
      title: 'store.atelien',
      subtitle: 'by Xircons',
      category: 'academic',
      role: 'Full-stack developer',
      completedAt: '2022',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG, IMG],
      description:
        'An e-commerce website I made for a school project. People can sign up, browse products, use a cart and checkout, and there is an admin area to manage orders, products, and coupons.',
      stack: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express', 'SQLite', 'JWT'],
    },
    {
      id: 4,
      slug: 'tic-tac-toe-with-ai',
      title: 'Tic-Tac-Toe with AI',
      subtitle: 'by Xircons',
      category: 'personal',
      role: 'Full-stack developer',
      completedAt: '2023',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG],
      description:
        'A tic-tac-toe game I built where you can play against the computer or with a friend. The computer has different levels, and on the hardest level it plays very strong so it is almost impossible to beat.',
      stack: ['React', 'Vite', 'Redux', 'Python', 'Flask'],
    },
    {
      id: 6,
      slug: 'good-night-hostel',
      title: 'Good Night Hostel',
      subtitle: 'by Xircons',
      category: 'personal',
      role: 'Full-stack developer',
      completedAt: '2022',
      githubUrl: 'https://github.com/xircons',
      heroImage: IMG,
      body: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,'
      ],
      gallery: [IMG, IMG, IMG],
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
