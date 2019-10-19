import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants';
import * as firebase from 'firebase';

import { Button, Block, Input, Text as RNText } from '../components';
import { FloatingAction } from 'react-native-floating-action';

import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

class RemoveItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listType: 'FlatList',
      listViewData: Array(20)
        .fill('')
        .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
      sectionListData: Array(5)
        .fill('')
        .map((_, i) => ({
          title: `title${i + 1}`,
          data: [
            ...Array(5)
              .fill('')
              .map((_, j) => ({
                key: `${i}.${j}`,
                text: `item #${j}`,
              })),
          ],
        })),
    };

    this.rowSwipeAnimatedValues = {};
    Array(20)
      .fill('')
      .forEach((_, i) => {
        this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
      });
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    firebase
      .database()
      .ref('users/' + this.props.user)
      .once('value')
      .then(snapshot => {
        let data = snapshot.val();
        delete data['name'];
        delete data['phoneNumber'];
        delete data['items'];
        console.warn(data);
        // this.setState({listViewData: [data]})
      });
  };

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  deleteRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const newData = [...this.state.listViewData];
    const prevIndex = this.state.listViewData.findIndex(
      item => item.key === rowKey
    );
    newData.splice(prevIndex, 1);
    this.setState({ listViewData: newData });
  }

  deleteSectionRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const [section] = rowKey.split('.');
    const newData = [...this.state.sectionListData];
    const prevIndex = this.state.sectionListData[section].data.findIndex(
      item => item.key === rowKey
    );
    newData[section].data.splice(prevIndex, 1);
    this.setState({ sectionListData: newData });
  }

  onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.standalone}>
          <View style={styles.standaloneRowFront}>
            <RNText h2 bold>
              Remove item
            </RNText>
            <View style={{ marginTop: 30, marginRight: 30 }}>
              <FloatingAction
                actions={[]}
                showBackground={false}
                floatingIcon={
                  <Ionicons name="ios-close" size={20} color="white" />
                }
                onPressMain={() => this.props.close()}
                position="right"
                buttonSize={30}
                color={theme.colors.accent}
              />
            </View>
          </View>
        </View>
        <SwipeListView
          data={this.state.listViewData}
          renderItem={data => (
            <TouchableHighlight
              onPress={() => console.log('You touched me')}
              style={styles.rowFront}
              underlayColor={'#AAA'}
            >
              <View>
                <Text>I am {data.item.text} in a SwipeListView</Text>
              </View>
            </TouchableHighlight>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => this.closeRow(rowMap, data.item.key)}
              >
                <Text style={styles.backTextWhite}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => this.deleteRow(rowMap, data.item.key)}
              >
                <Animated.View
                  style={[
                    styles.trash,
                    {
                      transform: [
                        {
                          scale: this.rowSwipeAnimatedValues[
                            data.item.key
                          ].interpolate({
                            inputRange: [45, 90],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={require('../assets/images/trash.png')}
                    style={styles.trash}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-150}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={this.onRowDidOpen}
          onSwipeValueChange={this.onSwipeValueChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  standalone: {
    marginTop: 50,
  },
  standaloneRowFront: {
    backgroundColor: 'white',
    justifyContent: 'center',
    height: 50,
    marginLeft: 20,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#1253bc',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 4,
  },
  trash: {
    height: 25,
    width: 25,
  },
});

export default RemoveItem;
