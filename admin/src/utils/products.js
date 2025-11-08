const products = [
  {
    _id: '61c355337f19aa31349af4fe',
    price: 14,
    discount: 0,
    tag: ['["lettuce","fresh vegetable"]'],
    flashSale: false,
    status: 'Show',
    children: 'Fresh Vegetable',
    createdAt: '2021-12-22T16:41:23.216Z',
    description:
      'Most fresh vegetables are low in calories and have a water content in excess of 70 percent, with only about 3.5 percent protein and less than 1 percent fat. ... The root vegetables include beets, carrots, radishes, sweet potatoes, and turnips. Stem vegetables include asparagus and kohlrabi.',
    image: 'https://i.postimg.cc/ZRynchJY/Green-Leaf-Lettuce-each.jpg',
    originalPrice: 14,
    parent: 'Fruits & Vegetable',
    quantity: 15,
    slug: 'green-leaf-lettuce',
    title: 'Green Leaf Lettuce',
    type: 'Grocery',
    unit: 'each',
    updatedAt: '2022-01-19T04:22:32.047Z',
    sku: 'F001',
  },
  {
    _id: '61c355337f19aa31349af4fd',
    price: 12,
    discount: 0,
    tag: ['["rainbow-chard","fresh vegetable"]'],
    flashSale: false,
    status: 'Hide',
    children: 'Fresh Vegetable',
    createdAt: '2021-12-22T16:41:23.216Z',
    description:
      'Most fresh vegetables are low in calories and have a water content in excess of 70 percent, with only about 3.5 percent protein and less than 1 percent fat. ... The root vegetables include beets, carrots, radishes, sweet potatoes, and turnips. Stem vegetables include asparagus and kohlrabi.',
    image: 'https://i.postimg.cc/Z5yQ47YB/Rainbow-Chard-Package-per-lb.jpg',
    originalPrice: 12,
    parent: 'Fruits & Vegetable',
    quantity: 5,
    slug: 'rainbow-chard',
    title: 'Rainbow Chard',
    type: 'Grocery',
    unit: '1lb',
    updatedAt: '2021-12-22T17:16:25.548Z',
    sku: '',
  },
  
];

const productData = products.sort((a, b) => -1);
export default productData;
