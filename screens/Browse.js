import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator} from 'react-native'
import * as firebase from 'firebase';
import { Card, Badge, Button, Block, Text } from '../components';
import { theme, mocks } from '../constants';
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import AddItem from './AddItem';
import RemoveItem from './RemoveItem';
import Feedback from './Feedback';

const avatar = require('../assets/images/avatar_1.jpg')

const { width } = Dimensions.get('window');

const actions = [
  {
    text: "Add Items",
    icon: <MaterialCommunityIcons name="plus" color={Colors.white} size={20}/>,
    name: "Add",
    position: 1
  },
  // {
  //   text: "Delete items",
  //   icon: <Ionicons name="md-trash" color={Colors.white} size={20}/>,
  //   name: "Delete",
  //   position: 2,
  //   color: "red"
  // },
  {
    text: "Report bugs",
    icon: <MaterialIcons name="keyboard-voice" color={Colors.white} size={20}/>,
    name: "Report",
    position: 2,
    color: "red"
  }
];

class Browse extends Component {

  constructor(props) {
    super(props)
    this.state = {
      active: 'Products',
      categories: [],
      profile: {},
      showAddItem: false,
      showDeleteItem: false,
      showFeedback: false,
      userID: null,
      items: null,
      loggedIn: false,
      profileLoaded: false
    }

    this.getUserData = this.getUserData.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderAddItem = this.renderAddItem.bind(this);
    this.renderRemoveItem = this.renderRemoveItem.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  componentWillMount() {
    this.setState({ categories: this.props.categories });
    this.getUserData();
  }

  getUserData = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref('users/' + user.uid).on("value", snapshot => {
          const profileData = snapshot.val()
          profileData["id"] = user.uid
          this.setState({profile: profileData, userID: user.uid, loggedIn: true, profileLoaded: true})
        })
      } else {
        this.setState({loggedIn: false, profileLoaded: true})
      }
    });
  }

  closeModal = () => {
    this.setState({showAddItem: false, showDeleteItem: false, showFeedback: false})
  }

  renderAddItem = () => {
    return(
        <Modal animationType="slide" visible={this.state.showAddItem} onRequestClose={() => this.setState({ showAddItem: false })}>
          <AddItem close={this.closeModal} user={this.state.userID} items={this.state.items} />
        </Modal>
    )
  }

  renderRemoveItem = () => {
    return(
      <Modal animationType="slide" visible={this.state.showDeleteItem} onRequestClose={() => this.setState({ showDeleteItem: false })}>
          <RemoveItem close={this.closeModal} user={this.state.userID}/>
      </Modal>
    )
  }

  renderFeedback = () => {
    return(
        <Modal animationType="slide" visible={this.state.showFeedback} onRequestClose={() => this.setState({ showFeedback: false })}>
          <Feedback close={this.closeModal} user={this.state.userID} />
        </Modal>
    )
  }
  
  handlePress = (name) => {
    const {loggedIn} = this.state;
    const {navigation} = this.props;
    if (name === "Add" && loggedIn ) {
      this.setState({showAddItem: true})
    } else if (name === "Report" && loggedIn) {
      this.setState({showFeedback: true})
    } else {
      navigation.navigate("LoginNavigation");
    }
  }

  logicSettings = () => {
    const {loggedIn, profile} = this.state;
    const {navigation} = this.props;
    if (loggedIn) {
      navigation.navigate("Settings", {profile});
    } else {
      navigation.navigate("LoginNavigation");
    }
  }

  render() {
    const { navigation } = this.props;
    const { categories, profileLoaded } = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h1 bold>Browse</Text>
          <Button onPress={() => this.logicSettings()}>
            {profileLoaded ? <Image
              source={avatar}
              style={styles.avatar}
            /> : <ActivityIndicator/>}
          </Button>
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base * 2}}
        >
          <Block flex={false} row space="between" style={styles.categories}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.name}
                onPress={() => navigation.navigate('Explore', {category: category.name})}
              >
                <Card center middle shadow style={styles.category}>
                  <Badge margin={[0, 0, 15]} size={50} color="rgba(41,216,143,0.20)">
                      {category.image}
                  </Badge>
                  <Text medium height={20}>{category.name}</Text>
                  <Text gray caption>{category.description}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
        <FloatingAction
          actions={actions}
          color={Colors.primary}
          showBackground={false}
          floatingIcon={<Ionicons name="md-options" size={22} color={Colors.white}/>}
          onPressItem={name => this.handlePress(name)}
        />
        {this.renderAddItem()}
        {this.renderRemoveItem()}
        {this.renderFeedback()}
      </Block>
    )
  }
}

Browse.defaultProps = {
  profile: mocks.profile,
  categories: mocks.categories,
}

export default Browse;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 5.2,
    width: theme.sizes.base * 5.2,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  }
})
