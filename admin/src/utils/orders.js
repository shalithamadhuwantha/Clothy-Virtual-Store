const orders = [
  {
    _id: '612abc3695aeaf0016ab4ff3',
    cart: [
      {
        price: 7,
        discount: 30,
        tag: ['Vegetable', 'Corn'],
        title: 'Corn',
        slug: 'corn',
        parent: 'Fruits & Vegetable',
        children: 'Vegetable',
        image: 'https://i.postimg.cc/2S74hbKw/Corn.jpg',
        originalPrice: 10,
        unit: '1/5kg',
        quantity: 1,
        type: 'Grocery',
        description:
          'Vegetable, in the broadest sense, any kind of plant life or plant product, namely “vegetable matter”; in common, narrow usage, the term vegetable usually refers to the fresh edible portions of certain herbaceous plants—roots, stems, leaves, flowers, fruit, or seeds.',
        __v: 0,
        createdAt: '2021-08-26T13:25:39.064Z',
        updatedAt: '2021-08-26T13:25:39.064Z',
        id: '6127965254781e22f8ae593d',
        itemTotal: 7,
      },

    ],
    shippingCost: 10,
    discount: 0,
    name: 'James J. Allen',
    address: '705 Pine Barren Rd, Pooler, GA, 31322  ',
    contact: '818-356-8600',
    email: 'james@gmail.com',
    city: 'GA',
    country: 'US',
    zipCode: '31322  ',
    shippingOption: 'FedEx',
    paymentMethod: 'COD',
    status: 'Pending',
    subTotal: 104,
    total: 114,
    user: '61531a4f1c38473378ab0828',
    createdAt: '2021-08-28T22:44:06.591Z',
    updatedAt: '2021-11-19T12:16:17.307Z',
  },
  
];

const orderData = orders.sort((a, b) => -1);

export default orderData;
