import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';

import AppNavigator from '../../navigation/AppNavigator';

const VALID_PHONENUMBER = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/

export default class Verify extends Component {
  state = {
    phonenumber: "",
    errors: [],
    loading: false,
  }

  handleForgot() {
    const { navigation } = this.props;
    const { phonenumber } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (phonenumber !== VALID_PHONENUMBER) {
      // errors.push('phonenumber');
    }

    this.setState({ errors, loading: false });

    if (!errors.length) {
        navigation.navigate('AppNavigator')
    } else {
      Alert.alert(
        'Error',
        'Wrong verification code.',
        [
          { text: 'Try again', }
        ],
        { cancelable: false }
      )
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.forgot} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Verify Phone Number</Text>
          <Block middle>
            <Input
              label="Verification code"
              error={hasErrors('phonenumber')}
              style={[styles.input, hasErrors('phonenumber')]}
              defaultValue={this.state.phonenumber}
              onChangeText={text => this.setState({ phonenumber: text })}
            />
            <Button gradient onPress={() => this.handleForgot()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Login</Text>
              }
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  forgot: {
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