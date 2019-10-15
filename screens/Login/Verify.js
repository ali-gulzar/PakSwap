import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';

import { Button, Block, Input, Text } from '../../components';
import { theme } from '../../constants';

const VALID_CODE = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/

export default class Verify extends Component {

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
      code: "",
      errors: [],
      loading: false,
    }

    this.handleVerify = this.handleVerify.bind(this);
    this._confirmCode = this._confirmCode.bind(this);
  }

  handleVerify() {
    const { navigation } = this.props;
    const { code } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (code === '') {
      errors.push('code');
      this.setState({ errors, loading: false });
    }

    if (!errors.length) {
      this._confirmCode(code);
    } else {
      this.setState({loading: false})
    }
  }

  _confirmCode = (code) => {
    const {navigation} = this.props;
    const confirmation = navigation.getParam('confirmation', '');
    confirmation.confirm(code)
    .then((result) => {
      this.setState({loading: false})
      navigation.navigate('AppNavigator')
    })
    .catch((err) => {
      Alert.alert(
        'Error',
        'Please enter a valid code.',
        [
          { text: 'Try again', }
        ],
        { cancelable: false }
      )
    });
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
              error={hasErrors('code')}
              style={[styles.input, hasErrors('code')]}
              defaultValue={this.state.code}
              onChangeText={text => this.setState({ code: text })}
            />
            <Button gradient onPress={() => this.handleVerify()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Login</Text>
              }
            </Button>
            <Button onPress={() => navigation.navigate('Forgot')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Resend verification code
              </Text>
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