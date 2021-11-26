import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socketio from 'socket.io-client';
// material
import { Card, Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
import { getConversations, getContacts, onConnectChat } from '../../redux/slices/privatechat';
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

  const socket = socketio.connect(`${serverConfig.socketUrl}/api/message`, {
    // EIO: 2,
    reconnect: true,
    transports: ['websocket']
  });

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
