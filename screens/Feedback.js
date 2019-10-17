import React, { Component } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, ScrollView} from 'react-native';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import Colors from '../constants/Colors';
import * as firebase from 'firebase';
import Toast from 'react-native-root-toast';

export default class AddItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            feedback:"",
            errors: [],
            loading: false,
          }

        this.handlePress = this.handlePress.bind(this);
    }


    handlePress = async () => {
        const { feedback } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        if (!feedback) errors.push('feedback');

        this.setState({ errors, loading: false });

        if (!errors.length) {
            this.setState({loading: true})
            const ref = firebase.database().ref('feedback/' + this.props.user)
            const key = ref.push().key;
            await ref.child(key).set({
                feedback,
            })
            this.setState({loading: false})
            this.props.close();
            Toast.show('Thank you for your feedback.', {
                duration: 1000,
                position: 50,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: theme.colors.primary,
                paddingTop: 20,
            });
        }
    }

    render() {
        const { loading, errors } = this.state;
        const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding, 0, theme.sizes.padding ]} space="between">
          <Text h1 bold>Feedback to improve your experience</Text>
          <KeyboardAvoidingView style={styles.signup} behavior="padding">
          <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} style={{ marginVertical: theme.sizes.padding }}>
                <Input
                    label="Feedback"
                    error={hasErrors('feedback')}
                    style={[styles.input, hasErrors('feedback')]}
                    defaultValue={this.state.feedback}
                    onChangeText={text => this.setState({ feedback: text })}
                />
            <Block middle padding={[theme.sizes.base / 2, 0]}>
                <Button gradient onPress={() => this.handlePress()}>
                    {loading ?
                        <ActivityIndicator size="small" color="white" /> : 
                        <Text bold white center>Report</Text>
                    }
                </Button>
                <Button color={Colors.accent} onPress={() => this.props.close()}>
                    {loading ?
                        <ActivityIndicator size="small" color="white" /> : 
                        <Text bold white center>Cancel</Text>
                    }
                </Button>
            </Block>
          </ScrollView>
          </KeyboardAvoidingView>
        </Block>
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