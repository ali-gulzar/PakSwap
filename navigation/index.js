import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Browse from '../screens/Browse';
import Settings from '../screens/Settings';

import { theme } from '../constants';

const screens = createStackNavigator({
  Browse,
  Settings: {
    screen: Settings,
    navigationOptions: {
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
        paddingRight: theme.sizes.base,
        marginTop: theme.sizes.base * 2,
      }
    }
  },
}, {
  initialRouteName: 'Browse',
  defaultNavigationOptions: {
    headerStyle: {
      height: theme.sizes.base * 2.5,
      backgroundColor: theme.colors.white, // or 'white
      borderBottomColor: "transparent",
      elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../assets/icons/back.png')} />,
    headerBackTitle: null,
    headerLeftContainerStyle: {
      alignItems: 'center',
      marginLeft: theme.sizes.base * 2,
      paddingRight: theme.sizes.base,
    },
    headerRightContainerStyle: {
      alignItems: 'center',
      paddingRight: theme.sizes.base,
    },
  }
});

export default createAppContainer(screens);