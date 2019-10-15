import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';
import * as firebase from 'firebase';
const VALID_PHONENUMBER = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/


export default class SignUp extends Component {

  static navigationOptions = {
      headerStyle: {
      height: 16 * 4,
      backgroundColor: theme.colors.white, // or 'white
      borderBottomColor: "transparent",
      elevation: 0, // for android
      },
      headerBackImage: <Image source={require('../../assets/icons/back.png')} />,
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
  };

  constructor(props) {
    super(props)

    this.state = {
      phonenumber: null,
      name: "",
      password: null,
      errors: [],
      loading: false
    }
  }

  handleSignUp() {
    const { navigation } = this.props;
    const { phonenumber, name, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    // if (!VALID_PHONENUMBER.test(phonenumber)) errors.push('phonenumber');
    // if (!(name.match(/[a-z]/i) && name.length < 15)) errors.push('name');
    // if (!password) errors.push('password');

    this.setState({ errors, loading: false });

    if (!errors.length) {
        this.sendSMSVerification(phonenumber);
        navigation.navigate('Verify');
    }
  }

  sendSMSVerification(phonenumber) {

  }

  render() {
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Sign Up</Text>
          <Block middle>
            <Input
              label="Name"
              error={hasErrors('name')}
              style={[styles.input, hasErrors('name')]}
              defaultValue={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
            <Input
                phonenumber
                label="Phone Number"
                error={hasErrors('phonenumber')}
                style={[styles.input, hasErrors('phonenumber')]}
                defaultValue={this.state.phonenumber}
                onChangeText={text => this.setState({ phonenumber: text })}
            />
            <Button gradient onPress={() => this.handleSignUp()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Sign Up</Text>
              }
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})