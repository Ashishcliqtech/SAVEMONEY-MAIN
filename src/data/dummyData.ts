export const dummyOffers = [
  {
    id: 'dummy-1',
    title: 'Flat 15% Cashback on All Laptops',
    description: 'Upgrade your work-from-home setup with a new laptop and enjoy a flat 15% cashback. Offer valid on all major brands!',
    store: {
      name: 'TechZone',
    },
  },
  {
    id: 'dummy-2',
    title: '60% Off on Running Shoes',
    description: 'Get ready for your fitness journey with a massive 60% discount on a wide range of running shoes from top brands.',
    store: {
      name: 'SportyFeet',
    },
  },
  {
    id: 'dummy-3',
    title: 'Buy One Get One Free on Pizzas',
    description: 'Mid-week cravings? Order any medium or large pizza and get another one absolutely free. T&C apply.',
    store: {
      name: 'CheesyBites',
    },
  },
  {
    id: 'dummy-4',
    title: '20% Off on International Flights',
    description: 'Plan your dream vacation with a 20% discount on international flight bookings. Explore the world for less!',
    store: {
      name: 'FlyHigh',
    },
  },
  {
    id: 'dummy-5',
    title: 'Upto 70% Off on Home Decor',
    description: 'Give your home a fresh new look with our stunning collection of home decor items, now available at up to 70% off.',
    store: {
      name: 'Modern Homes',
    },
  },
];

export const dummyTransactions = [
  {
    id: 'dummy-tx-1',
    store: {
      name: 'TechZone',
      logo: 'https://via.placeholder.com/48x48.png/000000/FFFFFF?text=T',
    },
    orderId: 'DUMMY001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 65000,
    cashbackEarned: 9750,
    status: 'confirmed',
  },
  {
    id: 'dummy-tx-2',
    store: {
      name: 'SportyFeet',
      logo: 'https://via.placeholder.com/48x48.png/2874F0/FFFFFF?text=S',
    },
    orderId: 'DUMMY002',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 3500,
    cashbackEarned: 2100,
    status: 'pending',
  },
  {
    id: 'dummy-tx-3',
    store: {
      name: 'CheesyBites',
      logo: 'https://via.placeholder.com/48x48.png/E3336F/FFFFFF?text=C',
    },
    orderId: 'DUMMY003',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 950,
    cashbackEarned: 0,
    status: 'confirmed',
  },
  {
    id: 'dummy-tx-4',
    store: {
      name: 'FlyHigh',
      logo: 'https://via.placeholder.com/48x48.png/4B8A08/FFFFFF?text=F',
    },
    orderId: 'DUMMY004',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 45000,
    cashbackEarned: 9000,
    status: 'confirmed',
  },
  {
    id: 'dummy-tx-5',
    store: {
      name: 'Modern Homes',
      logo: 'https://via.placeholder.com/48x48.png/FC8019/FFFFFF?text=M',
    },
    orderId: 'DUMMY005',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 8000,
    cashbackEarned: 5600,
    status: 'pending',
  },
];

export const dummyCategories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'food', name: 'Food & Dining' },
    { id: 'travel', name: 'Travel' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'beauty', name: 'Beauty & Health' },
];
