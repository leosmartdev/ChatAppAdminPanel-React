import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import micFill from '@iconify/icons-eva/mic-fill';
import roundSend from '@iconify/icons-ic/round-send';
import attach2Fill from '@iconify/icons-eva/attach-2-fill';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
// material
import { styled } from '@material-ui/core/styles';
import { Input, Divider, IconButton, InputAdornment, Stack, Box } from '@material-ui/core';
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
import axios from '../../../utils/axios';
// hooks
import useAuth from '../../../hooks/useAuth';
//
import EmojiPicker from '../../EmojiPicker';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  // minHeight: 56,
  height: 'auto',
  // display: 'flex',
  position: 'relative',
  alignItems: 'center',
  paddingLeft: theme.spacing(2)
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 40,
  minWidth: 40,
  width: 'auto',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius
}));

// ----------------------------------------------------------------------

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  conversationId: PropTypes.string,
  opponentId: PropTypes.string,
  onSend: PropTypes.func,
  messageMaxLen: PropTypes.number
};

export default function ChatMessageInput({ disabled, conversationId, opponentId, onSend, messageMaxLen, ...other }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadImgs, setUploadImgs] = useState(null);

  const handleAttach = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    // console.log(e.target.files);
    const fileObj = [];
    const fileArray = [];
    const formData = new FormData();
    fileObj.push(e.target.files);
    for (let i = 0; i < fileObj[0].length; i += 1) {
      const file = fileObj[0][i];
      formData.append(`img[${i}]`, file, file.name);
      fileArray.push({ index: i, name: file.name, url: URL.createObjectURL(file) });
    }
    // console.log(fileArray);
    setImageFiles(fileArray);
    setUploadImgs(formData);
  };

  const handleChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!message && imageFiles.length === 0) {
      return '';
    }
    if (onSend) {
      // const accessToken = window.localStorage.getItem('accessToken');
      // const authHeader = {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`
      //   }
      // };

      let imgs = [];

      if (uploadImgs) {
        const res = await axios.post('/message/upload_multi_imgs', uploadImgs);
        imgs = res.data.data;
        setImageFiles([]);
        setUploadImgs(null);
      }

      onSend({
        conversationId,
        messageId: uuidv4(),
        message,
        imgs,
        senderId: user._id,
        senderName: user.name,
        messageType: 0,
        receiverId: opponentId
      });
    }
    return setMessage('');
  };

  return (
    <RootStyle {...other}>
      {imageFiles.length > 0 && (
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 1, mb: 1 }} spacing={{ xs: 3, sm: 2 }}>
          {imageFiles.map((img) => (
            <MessageImgStyle key={`${img.index}`} alt="attachment" src={`${img.url}`} />
          ))}
        </Stack>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 1, mb: 1 }}>
        <Input
          disabled={disabled}
          fullWidth
          value={message}
          disableUnderline
          onKeyUp={handleKeyUp}
          onChange={handleChangeMessage}
          placeholder="Type a message"
          inputProps={{ maxLength: messageMaxLen || 1000 }}
          startAdornment={
            <InputAdornment position="start">
              <EmojiPicker disabled={disabled} value={message} setValue={setMessage} />
            </InputAdornment>
          }
          endAdornment={
            <Stack direction="row" spacing={0.5} mr={1.5}>
              <IconButton disabled={disabled} size="small" onClick={handleAttach}>
                <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
              </IconButton>
              {/* <IconButton disabled={disabled} size="small" onClick={handleAttach}>
                <Icon icon={attach2Fill} width={24} height={24} />
              </IconButton>
              <IconButton disabled={disabled} size="small">
                <Icon icon={micFill} width={24} height={24} />
              </IconButton> */}
            </Stack>
          }
          sx={{ height: '100%' }}
        />

        <Divider orientation="vertical" flexItem />

        <IconButton color="primary" disabled={!message && imageFiles.length === 0} onClick={handleSend} sx={{ mx: 1 }}>
          <Icon icon={roundSend} width={24} height={24} />
        </IconButton>
      </Stack>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </RootStyle>
  );
}
