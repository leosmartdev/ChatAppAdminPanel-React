import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// material
import { styled } from '@material-ui/core/styles';
import { Avatar, Box, Typography, Stack } from '@material-ui/core';

import useAuth from '../../../hooks/useAuth';

import { serverConfig } from '../../../config';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 450,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 80,
  minWidth: 100,
  width: 'auto',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  onOpenLightbox: PropTypes.func
};

export default function ChatMessageItem({ message, conversation, onOpenLightbox, ...other }) {
  const { user } = useAuth();
  const sender = conversation.users.find((user) => user._id === message.sender_id);
  const senderDetails =
    message.sender_id === user._id
      ? { type: 'me' }
      : { avatar: `${serverConfig.baseUrl}/user/img-src/${sender.avatarUrl}`, name: sender.name };

  const isMe = senderDetails.type === 'me';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  const replaceURLWithHTMLLinks = (text) => {
    const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    return text.replace(exp, (url) => `<a target="_blank" href="${url}">${url}</a>`);
  };

  return (
    <RootStyle {...other}>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar alt={senderDetails.name} src={senderDetails.avatar} sx={{ width: 32, height: 32 }} />
        )}

        <Box sx={{ ml: 2 }}>
          <InfoStyle noWrap variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${firstName},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.createdAt), {
              addSuffix: true
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: 'grey.800',
                bgcolor: 'primary.lighter'
              })
            }}
          >
            <Stack spacing={2} dangerouslySetInnerHTML={{ __html: replaceURLWithHTMLLinks(message.message) }} />
            {message.imgs.length > 0 && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                {message.imgs.map((img) => (
                  <MessageImgStyle
                    key={`${img}`}
                    alt="attachment"
                    src={`${serverConfig.baseUrl}/message/img-src/${img}`}
                    onClick={() => onOpenLightbox(`${serverConfig.baseUrl}/message/img-src/${img}`)}
                  />
                ))}
              </Stack>
            )}
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}
