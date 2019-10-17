import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, ScrollView, Image, View} from 'react-native';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import Colors from '../constants/Colors';

export default class AddItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            itemName: "",
            location: "",
            price: "",
            itemCondition: "",
            errors: [],
            loading: false,
            image: "",
            gotImage: false,
            userID: null
          }

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    componentWillMount() {
        this.getUserData();
      }
    
    getUserData = () => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
              this.setState({userID: user.uid})
          } else {
            return;
          }
        });
      }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            this.props.close();
        }
        }
    }

    closeModal = () => {
        console.warn("not working")
    }

    handleAddItem = async () => {
        const { itemName, location, price, itemCondition, image } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        if (!itemName) errors.push('itemName');
        if (!location) errors.push('location');
        if (!price) errors.push('price');
        if (!itemCondition) errors.push('itemCondition');
        if (!image) {
            errors.push('image')
            Alert.alert(
                'Error',
                'Please fill in the form and upload one image for the item to be exchanged.',
                [
                  { text: 'Okay', }
                ],
                { cancelable: false }
              )
        };

        this.setState({ errors, loading: false });

        if (!errors.length) {
        this.setState({loading: true})
        await this.uploadData();
        await this.setState({loading: false});
        this.props.close();
        }
    }

    _pickImage = async () => {
        this.setState({loading: true})
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        });
        if (!result.cancelled) {
        this.setState({ image: result.uri, gotImage: true });
        }
        this.setState({loading: false})
    };

    renderImage = (image) => {
        return(
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 20}} />
            </View>
        )
    }

    uploadData = async () => {
        const {itemName, location, price, itemCondition, image, userID} = this.state;
        imageURL = await this.uploadImage(image, userID);
        const ref = firebase.database().ref('users/' + userID)
        const key = ref.push().key;
        ref.child(key).set({
            itemName,
            location,
            price, 
            itemCondition,
            imageURL
        })
        ref.update({items: this.props.items + 1})
    }

    uploadImage = async (uri, userID) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const key = firebase.database().ref('users/' + userID).push().key;
        var ref = firebase.storage().ref(userID).child(key);
        const snapshot = await ref.put(blob);
        blob.close();
        return await snapshot.ref.getDownloadURL();
    }

    render() {
        const { loading, errors, image, gotImage } = this.state;
        const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding, 0, theme.sizes.padding ]} space="between">
          <Text h1 bold>Add item for exchange</Text>
          <KeyboardAvoidingView style={styles.signup} behavior="padding">
          <ScrollView keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false} style={{ marginVertical: theme.sizes.padding }}>
           
                <Input
                email
                label="Item Name"
                error={hasErrors('itemName')}
                style={[styles.input, hasErrors('itemName')]}
                defaultValue={this.state.itemName}
                onChangeText={text => this.setState({ itemName: text })}
                />
                <Input
                label="Location"
                error={hasErrors('location')}
                style={[styles.input, hasErrors('location')]}
                defaultValue={this.state.location}
                onChangeText={text => this.setState({ location: text })}
                />
                <Input
                label="Price"
                error={hasErrors('price')}
                style={[styles.input, hasErrors('price')]}
                defaultValue={this.state.price}
                onChangeText={text => this.setState({ price: text })}
                keyboardType="number-pad"
                />
                <Input
                label="Item condition"
                error={hasErrors('itemCondition')}
                style={[styles.input, hasErrors('itemCondition')]}
                defaultValue={this.state.itemCondition}
                onChangeText={text => this.setState({ itemCondition: text })}
                keyboardType="number-pad"
                />
            {gotImage && this.renderImage(image)}
            <Block middle padding={[theme.sizes.base / 2, 0]}>
                <Button color="#1253bc" small onPress={() => this._pickImage()}>
                    {loading ?
                        <ActivityIndicator size="small" color="white" /> : 
                        <Text bold white center>Upload a picture</Text>
                    }
                </Button>
                <Button gradient onPress={() => this.handleAddItem()}>
                    {loading ?
                        <ActivityIndicator size="small" color="white" /> : 
                        <Text bold white center>Add Item</Text>
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
  },
  closeButton: {
    position: 'absolute',
    right: theme.sizes.base * 1.5,
    top: theme.sizes.base * 3.5,
    width: 30,
    height: 40,
    backgroundColor: 'red'
  },
  closeImageText:{
      width: 30,
      height: 40
  }
})