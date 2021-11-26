import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
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

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string
};

export default function ChatConversationList({ conversations, isOpenSidebar, activeConversationId, ...other }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userList } = useSelector((state) => state.user);
  const { opponentId } = useParams();
  const localUsers = userList.filter((value) => value._id !== user._id);

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
          // conversation={conversations.byId[conversationId]}
          isSelected={opponentId === value._id}
          onSelectConversation={() => handleSelectConversation(value._id)}
        />
      ))}
    </List>
  );
}
