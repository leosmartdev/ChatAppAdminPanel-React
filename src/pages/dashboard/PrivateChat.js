import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socketio from 'socket.io-client';
// material
import { Card, Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
import { getConversations, getContacts, onConnectChat, getConversation } from '../../redux/slices/privatechat';
import { getSettingsList } from '../../redux/slices/settings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow, ChatAdminMessageForm } from '../../components/_dashboard/privatechat';
import { serverConfig } from '../../config';

// ----------------------------------------------------------------------

export default function PrivateChat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { opponentId } = useParams();
  const { settingsList } = useSelector((state) => state.setting);
  const chatSettings = settingsList.find((settingRow) => settingRow.type === 'chat');
  const { activeConversationId } = useSelector((state) => state.privatechat);
  const [currentConversationId, setCurrentCoversationId] = useState(null);

  console.log('Private Chat');

  useEffect(() => {
    if (opponentId) {
      const lastMessage =
        chatSettings?.settings.admin_message ||
        'Please leave a message, I will reply to you as soon as possible. You may talk about anything: advertising, complaining, suggestions, advice, cooperation, etc.';
      dispatch(onConnectChat(user._id, opponentId, lastMessage));
    }
  }, [dispatch, opponentId]);

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getConversations());
    dispatch(getContacts());
    dispatch(getSettingsList());
  }, [dispatch]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketio.connect(`${serverConfig.socketUrl}/api/message`, {
      // EIO: 2,
      // reconnect: true,
      transports: ['websocket']
    });
    newSocket.on('connect', () => {
      console.log('Successfully connected');
    });
    newSocket.on('connect_failed', () => {
      console.log('Connection Failed');
    });
    newSocket.on('disconnect', () => {
      console.log('Disconnected');
    });
    newSocket.on('msgReceive', handleReceiveMessage);
    newSocket.on('onDeleted', handleDeleteMessage);
    newSocket.on('onTyping', onTyping);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket && activeConversationId) {
      if (currentConversationId && currentConversationId !== activeConversationId) {
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
  }, [socket, dispatch, activeConversationId]);

  const handleReceiveMessage = async (value) => {
    console.log(activeConversationId, value);
    if (activeConversationId) {
      dispatch(getConversation(activeConversationId));
    }
  };

  const handleDeleteMessage = async (value) => {
    console.log(value);
    dispatch(getConversation(activeConversationId));
  };

  const onTyping = async (value) => {
    console.log(value);
  };

  const [roomListSocket, setRoomListSocket] = useState(null);

  useEffect(() => {
    console.log('RoomList Socket!');
    const newSocket = socketio.connect(`${serverConfig.socketUrl}/api/chatRoomList`, {
      // reconnect: true,
      transports: ['websocket']
    });
    newSocket.on('connect', () => {
      console.log('Successfully connected: api/chatRoomList');
    });
    newSocket.on('updateChatRoomList', handleUpdateChatRoomList);
    setRoomListSocket(newSocket);
    return () => newSocket.close();
  }, [setRoomListSocket]);

  const handleUpdateChatRoomList = () => {
    console.log('handleUpdateChatRoomList');
    dispatch(getConversations());
  };

  return (
    <Page title="Chat | Locals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Private Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Private Chat' }]}
        />
        <ChatAdminMessageForm chatSettings={chatSettings} />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          {socket && <ChatWindow socket={socket} />}
        </Card>
      </Container>
    </Page>
  );
}
