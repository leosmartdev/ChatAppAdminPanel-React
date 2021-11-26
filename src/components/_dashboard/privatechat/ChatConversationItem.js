import { last } from 'lodash';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Avatar, ListItemText, ListItemAvatar, ListItemButton } from '@material-ui/core';
//
import BadgeStatus from '../../BadgeStatus';
import { serverConfig } from '../../../config';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all')
}));

const AvatarWrapperStyle = styled('div')({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' }
});

// ----------------------------------------------------------------------

const getDetails = (conversation, currentUserId) => {
  const otherParticipants = conversation.participants.filter((participant) => participant.id !== currentUserId);
  const displayNames = otherParticipants.reduce((names, participant) => [...names, participant.name], []).join(', ');
  let displayText = '';
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  if (lastMessage) {
    const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';
    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;
    displayText = `${sender}${message}`;
  }
  return { otherParticipants, displayNames, displayText };
};

ChatConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  opponent: PropTypes.object,
  // conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func
};

export default function ChatConversationItem({
  isSelected,
  opponent,
  // conversation,
  onSelectConversation,
  isOpenSidebar,
  ...other
}) {
  // const displayLastActivity = last(conversation.messages).createdAt;
  const displayLastActivity = opponent.created;
  // const isGroup = details.otherParticipants.length > 1;
  const isGroup = false;
  // const isUnread = conversation.unreadCount > 0;
  const isUnread = false;
  // const isOnlineGroup = isGroup && details.otherParticipants.map((item) => item.status).includes('online');
  const avatarImgSrc = `${serverConfig.baseUrl}/user/img-src/${opponent.avatarUrl}`;
  const opponentStatus = opponent.online ? 'online' : 'offline';

  return (
    <RootStyle
      disableGutters
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' })
      }}
      {...other}
    >
      <ListItemAvatar>
        <Box
          sx={{
            ...(isGroup && {
              position: 'relative',
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              '& .avatarWrapper': {
                position: 'absolute',
                width: AVATAR_SIZE_GROUP,
                height: AVATAR_SIZE_GROUP,
                '&:nth-of-type(1)': {
                  left: 0,
                  zIndex: 9,
                  bottom: 2,
                  '& .MuiAvatar-root': {
                    border: (theme) => `solid 2px ${theme.palette.background.paper}`
                  }
                },
                '&:nth-of-type(2)': { top: 2, right: 0 }
              }
            })
          }}
        >
          {/* {details.otherParticipants.slice(0, 2).map((participant) => ( */}
          <AvatarWrapperStyle className="avatarWrapper" key={opponent._id}>
            <Avatar alt={opponent.name} src={avatarImgSrc} />
            <BadgeStatus status={opponentStatus} sx={{ right: 2, bottom: 2, position: 'absolute' }} />
          </AvatarWrapperStyle>
          {/* ))} */}
          {/* {opponent.online && <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />} */}
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={opponent.name}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2'
            }}
            secondary="last message here"
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'textPrimary' : 'textSecondary'
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled'
              }}
            >
              {formatDistanceToNowStrict(new Date(displayLastActivity), {
                addSuffix: false
              })}
            </Box>
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
