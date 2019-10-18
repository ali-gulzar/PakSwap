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

export {
  categories,
}