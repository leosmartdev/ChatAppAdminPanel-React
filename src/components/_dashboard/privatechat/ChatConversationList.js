import { find, map } from 'lodash';
import PropTypes from 'prop-types';
// import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import socketio from 'socket.io-client';
// material
import { List } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatConversationItem from './ChatConversationItem';
// redux
import { useSelector } from '../../../redux/store';
// hooks
import useAuth from '../../../hooks/useAuth';

// import { serverConfig } from '../../../config';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  query: PropTypes.string,
  onlyUnreadShow: PropTypes.bool
};

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  query,
  onlyUnreadShow,
  ...other
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userList } = useSelector((state) => state.user);
  const { opponentId } = useParams();

  const getConversationByUserId = (userId) => {
    const conversation = find(conversations.byId, (value) => {
      const userIds = map(value.users, (user) => user._id);
      // console.log(userIds);
      return userIds.indexOf(userId) > -1;
    });
    // console.log(userId, conversation);
    return conversation;
  };

  const isUnread = (userId) => {
    const conversation = getConversationByUserId(userId);
    const unreadCount =
      (conversation &&
        (conversation.lastMessage.users_see_message.indexOf(user._id) > -1
          ? 0
          : conversation.lastMessage.unread_count)) ||
      0;
    return unreadCount > 0;
  };

  const localUsers = userList.filter((value) => {
    const result = value._id !== user._id && value.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    if (onlyUnreadShow && result) {
      return isUnread(value._id);
    }
    return result;
  });

  const handleSelectConversation = (conversationUserId) => {
    navigate(`${PATH_DASHBOARD.chat.private}/${conversationUserId}`);
  };

  return (
    <List disablePadding {...other}>
      {localUsers.map((value) => (
        <ChatConversationItem
          key={value._id}
          opponent={value}
          isOpenSidebar={isOpenSidebar}
          conversation={getConversationByUserId(value._id)}
          isSelected={opponentId === value._id}
          onSelectConversation={() => handleSelectConversation(value._id)}
          // sx={{ ...(onlyUnreadShow && isUnread(value._id) && { display: 'none' }) }}
        />
      ))}
    </List>
  );
}
