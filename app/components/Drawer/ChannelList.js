import React, {PropTypes} from 'react';
import {ScrollView, Text, RefreshControl} from 'react-native';
import {categorize} from '../../utils/sortRoomsByType'
import ChannelListSection from './ChannelListSection'

const ChannelList = ({
  ids,
  rooms,
  activeRoom,
  onRoomPress,
  onLongRoomPress,
  isLoadingRooms,
  onRefresh
}) => {
  if (!ids || !rooms) {
    // TODO: Add tips how to add room
    return <Text>Nothing to display</Text>
  }

  const {favorites, unread, channels, orgs} = categorize(ids, rooms)

  // TODO: Use ListView instead to reduce performance issues
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoadingRooms}
          onRefresh={onRefresh} />
      }>
      {!!favorites.length &&
        <ChannelListSection
          name="Favorites"
          items={favorites}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!unread.length &&
        <ChannelListSection
          name="Unread"
          items={unread}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!channels.length &&
        <ChannelListSection
          name="Channels"
          items={channels}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
      {!!orgs.length &&
        <ChannelListSection
          name="Organizations"
          items={orgs}
          activeRoom={activeRoom}
          onRoomPress={onRoomPress}
          onLongRoomPress={onLongRoomPress} />
      }
    </ScrollView>
  )
}

ChannelList.propTypes = {
  ids: PropTypes.array,
  onLongRoomPress: PropTypes.func,
  rooms: PropTypes.object,
  onRoomPress: PropTypes.func
}

export default ChannelList
