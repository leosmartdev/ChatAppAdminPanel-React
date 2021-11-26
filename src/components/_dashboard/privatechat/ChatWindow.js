import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import { Box, Divider } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation
} from '../../../redux/slices/privatechat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';

// ----------------------------------------------------------------------

const conversationSelector = (state) => {
  const { conversations, activeConversationId } = state.privatechat;
  const conversation = conversations.byId[activeConversationId];
  if (conversation) {
    return conversation;
  }
  return {
    id: null,
    messages: [],
    users: []
  };
};

export default function ChatWindow({ socket }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { opponentId } = useParams();
  const { contacts, recipients, participants, activeConversationId } = useSelector((state) => state.privatechat);
  const conversation = useSelector((state) => conversationSelector(state));
  const [currentConversationId, setCurrentCoversationId] = useState(null);

  const mode = opponentId ? 'DETAIL' : 'COMPOSE';

  const displayParticipants = participants.filter((item) => item._id !== '8864c717-587d-472a-929a-8e5f298024da-0');

  useEffect(() => {
    if (activeConversationId) {
      console.log('get conversation', activeConversationId);
      dispatch(getConversation(activeConversationId));
      // dispatch(markConversationAsRead(activeConversationId));
    }
  }, [dispatch, activeConversationId]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Successfully connected');
      if (activeConversationId) {
        if (currentConversationId) {
          console.log('leaveChat', currentConversationId);
          socket.emit(
            'leaveChat',
            JSON.stringify({
              chatId: currentConversationId
            })
          );
        }
        console.log('joinChat', activeConversationId);
        const params = { chatId: activeConversationId };
        socket.emit('joinChat', JSON.stringify(params));
        setCurrentCoversationId(activeConversationId);
      }
    });
    socket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    socket.on('msgReceive', handleReceiveMessage);
    socket.on('onDeleted', handleDeleteMessage);
    socket.on('onTyping', onTyping);
  }, [socket, activeConversationId]);

  const handleAddRecipient = (recipient) => {
    dispatch(addRecipients(recipient));
  };

  const handleSendMessage = async (value) => {
    try {
      dispatch(onSendMessage(value));
      const message = {
        sender_id: value.senderId,
        sender_name: value.senderName,
        messageId: value.messageId,
        chat_id: value.conversationId,
        message: value.message,
        receiver_id: value.receiverId,
        message_type: value.messageType,
        imgs: value.imgs
      };
      console.log('socket new message', message);
      socket.emit('new_message', JSON.stringify(message));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReceiveMessage = async (value) => {
    console.log(activeConversationId, value);
    dispatch(getConversation(activeConversationId));
  };

  const handleDeleteMessage = async (value) => {
    console.log(value);
    dispatch(getConversation(activeConversationId));
  };

  const onTyping = async (value) => {
    console.log(value);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipient={handleAddRecipient}
        />
      )}

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
          <ChatMessageList conversation={conversation} />

          <Divider />

          <ChatMessageInput
            conversationId={activeConversationId}
            opponentId={opponentId}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.private}
          />
        </Box>

        {/* {mode === 'DETAIL' && <ChatRoom conversation={conversation} participants={displayParticipants} />} */}
      </Box>
    </Box>
  );
}
