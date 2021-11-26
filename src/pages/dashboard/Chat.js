import { useEffect } from 'react';
// material
import { Card, Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getConversations, getContacts } from '../../redux/slices/chat';
import { getSettingsList } from '../../redux/slices/settings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow, ChatAdminMessageForm } from '../../components/_dashboard/chat';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { settingsList } = useSelector((state) => state.setting);
  const chatSettings = settingsList.find((settingRow) => settingRow.type === 'chat');

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
    dispatch(getSettingsList());
  }, [dispatch]);

  return (
    <Page title="Chat | Locals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <ChatAdminMessageForm chatSettings={chatSettings} />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar />
          <ChatWindow />
        </Card>
      </Container>
    </Page>
  );
}
