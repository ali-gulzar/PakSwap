import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from './Login';
import Welcome from './Welcome';
import SignUp from './SignUp';
import Forgot from './Forgot';
import Verify from './Verify';
import AppNavigator from '../../navigation/AppNavigator';

const screens = createStackNavigator({
    SignUp,
    Welcome,
    Login,
    SignUp,
    Forgot,
    Verify,
    AppNavigator: {
      screen: AppNavigator,
      navigationOptions: {
        header: null,
        gesturesEnabled: false,
      }
    }
});

export default createAppContainer(screens);