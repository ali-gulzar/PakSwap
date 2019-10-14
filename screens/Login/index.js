import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from './Login';
import Welcome from './Welcome';
import SignUp from './SignUp';
import Forgot from './Forgot';
import Verify from './Verify';
import AppNavigator from '../../navigation/AppNavigator';

import { theme } from '../../constants';

navigationOptionss = {
  defaultNavigationOptions: {
    headerStyle: {
      height: theme.sizes.base * 4,
      backgroundColor: 'black', // or 'white
      borderBottomColor: "transparent",
      elevation: 0, // for android
    },
    headerBackImage: <Image source={require('../../assets/icons/back.png')} />,
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
}

const screens = createStackNavigator({
    SignUp: {
      screen: SignUp
    },
    Welcome,
    Login,
    SignUp,
    Forgot,
    Verify,
    AppNavigator
});

export default createAppContainer(screens);