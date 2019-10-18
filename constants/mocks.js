import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Colors from './Colors';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    tags: ['products', 'inspirations'],
    count: 147,
    description:"Accessories",
    image: <MaterialCommunityIcons name="washing-machine" color={Colors.primary} size={25}/>
  },
  {
    id: 'games',
    name: 'Games',
    tags: ['products', 'shop'],
    count: 16,
    description:"Consoles games",
    image: <Entypo name="game-controller" color={Colors.tertiary} size={25}/>
  },
  {
    id: 'books',
    name: 'Books',
    tags: ['products', 'inspirations'],
    count: 68,
    description:"For Geeks",
    image: <Entypo name="book" color="#1253bc" size={25}/>
  },
  {
    id: 'mobilePhones',
    name: 'Mobile Phones',
    tags: ['products', 'shop'],
    count: 17,
    description:"Apple - Other",
    image: <Entypo name="mobile" color={Colors.gray} size={25}/>
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tags: ['products', 'shop'],
    count: 47,
    description:"Everyday items",
    image: <AntDesign name="database" color={Colors.accent} size={25}/>
  },
  {
    id: 'other',
    name: 'Other',
    tags: ['products', 'shop'],
    count: 47,
    description:"Others",
    image: <Entypo name="star" color={Colors.black} size={25}/>
  },
];

const products = [
  {
    id: 1, 
    name: '16 Best Plants That Thrive In Your Bedroom',
    description: 'Bedrooms deserve to be decorated with lush greenery just like every other room in the house – but it can be tricky to find a plant that thrives here. Low light, high humidity and warm temperatures mean only certain houseplants will flourish.',
    tags: ['Interior', '27 m²', 'Ideas'],
    images: [
      require('../assets/images/plants_1.png'),
      require('../assets/images/plants_2.png'),
      require('../assets/images/plants_3.png'),
      // showing only 3 images, show +6 for the rest
      require('../assets/images/plants_1.png'),
      require('../assets/images/plants_2.png'),
      require('../assets/images/plants_3.png'),
      require('../assets/images/plants_1.png'),
      require('../assets/images/plants_2.png'),
      require('../assets/images/plants_3.png'),
    ]
  }
];

const explore = [
  // images
  require('../assets/images/explore_1.png'),
  require('../assets/images/explore_2.png'),
  require('../assets/images/explore_3.png'),
  require('../assets/images/explore_4.png'),
  require('../assets/images/explore_5.png'),
  require('../assets/images/explore_6.png'),
];

const profile = {
  username: 'react-ui-kit',
  location: 'Europe',
  email: 'contact@react-ui-kit.com',
  avatar: require('../assets/images/avatar.png'),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false,
};

export {
  categories,
  explore,
  products,
  profile,
}