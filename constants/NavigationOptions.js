import React from 'react';
import {Image} from 'react-native';

export default {
    headerStyle: {
    height: 16 * 4,
    backgroundColor: 'black', // or 'white
    borderBottomColor: "transparent",
    elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../assets/icons/back.png')} />,
    headerBackTitle: null,
    headerLeftContainerStyle: {
    alignItems: 'center',
    marginLeft: 16 * 2,
    paddingRight: 16,
    },
    headerRightContainerStyle: {
    alignItems: 'center',
    paddingRight: 16,
    },
}