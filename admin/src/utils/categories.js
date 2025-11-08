const categories = [
  {
    _id: '61b0d3975741dd2e949d53f9',
    children: ['Sports', 'Fitness'],
    parent: 'Mens Polo T Shirts',
    type: 'Sports & Fitness',
    // icon: 'https://i.ibb.co/qNCvxT0/dumbbell.png',
    status: 'Show',
  },
  {
    _id: '61b0d3975741dd2e949d5407',
    children: ['Oil'],
    parent: 'Mens Office Shirts',
    type: 'Grocery',
    // icon: 'https://i.ibb.co/hBv30Rt/frying-pan.png',
    status: 'Show',
  },
  {
    _id: '61b0d3975741dd2e949d5408',
    children: ['Sea Cloth'],
    parent: 'Mens check Shirts',
    type: 'Grocery',
    // icon: 'https://i.ibb.co/pfscwF4/shrimp.png',
    status: 'Show',
  },
  {
    _id: '61b0d3975741dd2e949d5409',
    children: ['Dry'],
    parent: 'Mens T Shirts',
    type: 'Grocery',
    // icon: 'https://i.postimg.cc/RZ275n3f/cabbage.png',
    status: 'Show',
  },

];

const categoryData = categories.sort((a, b) => -1);

export default categoryData;
