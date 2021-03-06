import React, {Component, PropTypes} from 'react';
import {Alert, View, Platform, ActionSheetIOS} from 'react-native';
import {connect} from 'react-redux'
import DialogAndroid from 'react-native-dialogs'

import {logOut} from '../modules/auth'
import * as Navigation from '../modules/navigation'
import {selectRoom, leaveRoom, markAllAsRead, refreshRooms} from '../modules/rooms'

import s from '../styles/screens/Drawer/DrawerStyles'
import DrawerUserInfo from '../components/Drawer/DrawerUserInfo'
import ChannelList from '../components/Drawer/ChannelList'
import Loading from '../components/Loading'

import {THEMES} from '../constants'
const {colors} = THEMES.gitterDefault
const iOS = Platform.OS === 'ios'

class Drawer extends Component {
  constructor(props) {
    super(props)
    this.onRoomPress = this.onRoomPress.bind(this)
    this.onLongRoomPress = this.onLongRoomPress.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.handleSettingsPress = this.handleSettingsPress.bind(this)
    this.handleDialogPress = this.handleDialogPress.bind(this)
    this.handleSearchPress = this.handleSearchPress.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  onRoomPress(id) {
    const {dispatch, navigateTo} = this.props
    navigateTo({name: 'room', roomId: id})
    dispatch(selectRoom(id))
  }

  onLongRoomPress(id) {
    const {rooms} = this.props

    if (iOS) {
      const options = [
        'Mark as read',
        'Leave this room',
        'Close'
      ]
      ActionSheetIOS.showActionSheetWithOptions({
        title: rooms[id].name,
        options,
        cancelButtonIndex: 2
      }, index => this.handleDialogPress(index, options[index], id))
    } else {
      const dialog = new DialogAndroid()

      dialog.set({
        title: rooms[id].name,
        items: [
          'Mark as read',
          'Leave this room'
        ],
        itemsCallback: (index, text) => this.handleDialogPress(index, text, id)
      })
      dialog.show()
    }
  }

  onLeave(id) {
    const {dispatch} = this.props
    Alert.alert(
      'Leave room',
      'Are you sure?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => dispatch(leaveRoom(id))}
      ]
    )
  }

  handleSettingsPress() {
    const {navigateTo} = this.props
    navigateTo({name: 'settings'})
  }

  handleSearchPress() {
    const {navigateTo} = this.props
    navigateTo({name: 'search'})
  }

  handleDialogPress(index, text, id) {
    const {dispatch} = this.props
    switch (text) {
    case 'Mark as read':
      dispatch(markAllAsRead(id))
      break
    case 'Leave this room':
      this.onLeave(id)
      break
    default:
      return null
    }
  }

  handleRefresh() {
    const {dispatch} = this.props
    dispatch(refreshRooms())
  }

  render() {
    const {user, ids, isLoadingRooms} = this.props

    return (
      <View style={s.container}>
        <DrawerUserInfo
          {...user}
          onSettingsPress={this.handleSettingsPress.bind(this)}
          onSearchPress={this.handleSearchPress} />
        {ids.length === 0
          ? <Loading color={colors.brand} />
          : <ChannelList
              {...this.props}
              isLoadingRooms={isLoadingRooms}
              onRefresh={this.handleRefresh}
              onLongRoomPress={this.onLongRoomPress.bind(this)}
              onRoomPress={this.onRoomPress.bind(this)} />
        }
      </View>
    )
  }
}

Drawer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoadingUser: PropTypes.bool,
  isLoadingRooms: PropTypes.bool,
  navigateTo: PropTypes.func.isRequired,
  user: PropTypes.object,
  ids: PropTypes.array,
  rooms: PropTypes.object,
  activeRoom: PropTypes.string
}

Drawer.defaultProps = {
  isLoadingUser: true,
  isLoadingRooms: true
}

function mapStateToProps(state) {
  return {
    isLoadingUser: state.viewer.isLoading,
    isLoadingRooms: state.rooms.isLoading,
    user: state.viewer.user,
    ids: state.rooms.ids,
    rooms: state.rooms.rooms,
    activeRoom: state.rooms.activeRoom
  }
}

export default connect(mapStateToProps)(Drawer)
