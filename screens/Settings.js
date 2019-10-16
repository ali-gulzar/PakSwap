import React, { Component } from 'react'
import { Image, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import * as firebase from 'firebase';

import { Divider, Button, Block, Text, Switch } from '../components';
import { theme, mocks } from '../constants';
import Colors from '../constants/Colors';

const avatar = require('../assets/images/avatar_1.jpg')

class Settings extends Component {
  state = {
    notifications: true,
    editing: null,
    profile: {},
    loading: false,
  }

  componentWillMount() {
    const {navigation} = this.props;
    this.setState({profile: navigation.getParam('profile')})
  }

  handleEdit(name, text) {
    const { profile } = this.state;
    profile[name] = text;

    this.setState({ profile });
  }

  toggleEdit(name) {
    const { editing } = this.state;
    this.setState({ editing: !editing ? name : null });
  }

  renderEdit(name) {
    const { profile, editing } = this.state;

    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      )
    }

    return <Text bold>{profile[name]}</Text>
  }

  deleteAccount = () => {
    this.setState({loading: true})
    const user = firebase.auth().currentUser;
    user.delete().then(function() {
      firebase.database().ref('users/'+ user.uid).remove();
      firebase.auth().signOut();
      this.setState({loading: false})
    }, function(error) {
      // An error happened.
    });
  }

  handleLogOut = () => {
    this.setState({loading: true})
    firebase.auth().signOut().then(() => {
      this.setState({loading: false})
    });
  }

  render() {
    const { profile, editing, loading } = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Settings</Text>
          <Button>
            <Image
              source={avatar}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Name</Text>
                {this.renderEdit('name')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('name')}>
                {editing === 'name' ? 'Save' : 'Edit'}
              </Text>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Phone Number</Text>
                <Text bold>{profile.phoneNumber}</Text>
              </Block>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Items on the market</Text>
                <Text bold>{profile.items}</Text>
              </Block>
            </Block>
          </Block>

          <Block style={styles.toggles}>
            <Block row center space="between" style={{ marginBottom: theme.sizes.base * 2 }}>
              <Text gray2>Notifications</Text>
              <Switch
                value={this.state.notifications}
                onValueChange={value => this.setState({ notifications: value })}
              />
            </Block>
          </Block>

          <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

          <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2, 20, theme.sizes.padding * 2 ]}>
            <Button gradient onPress={() => this.handleLogOut()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Log out</Text>
              }
            </Button>
            <Button color={Colors.accent} onPress={() => this.deleteAccount()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Delete my account</Text>
              }
            </Button>
          </Block>

        </ScrollView>
      </Block>
    )
  }
}

Settings.defaultProps = {
  profile: mocks.profile,
}

export default Settings;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 4,
    width: theme.sizes.base * 4,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: 'flex-end'
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: theme.colors.secondary,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  }
})
