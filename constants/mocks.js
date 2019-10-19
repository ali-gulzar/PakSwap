import React from 'react';
import { Foundation } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Colors from './Colors';

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    tags: ['products', 'inspirations'],
    count: 147,
    description:"Accessories",
    image: <Foundation name="laptop" color={Colors.primary} size={25}/>
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
    id: 'services',
    name: 'Services',
    tags: ['products', 'shop'],
    count: 17,
    description:"Apple - Other",
    image: <FontAwesome name="paint-brush" color={Colors.gray} size={25}/>
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