import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';

import { useNavigate, Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Box, useMediaQuery, Checkbox, FormControlLabel } from '@material-ui/core';
// redux
import { useSelector } from '../../../redux/store';
// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

import { MIconButton } from '../../@material-extend';
import Scrollbar from '../../Scrollbar';
import ChatAccount from './ChatAccount';
import ChatSearchResults from './ChatSearchResults';
import ChatContactSearch from './ChatContactSearch';
import ChatConversationList from './ChatConversationList';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create('width'),
  borderRight: `1px solid ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

export default function ChatSidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSidebar, setOpenSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  const displayResults = searchQuery && isSearchFocused;
  const { conversations, activeConversationId } = useSelector((state) => state.privatechat);
  const [onlyUnreadShow, setOnlyUnreadShow] = useState(false);

  useEffect(() => {
    if (isMobile) {
      return setOpenSidebar(false);
    }
    return setOpenSidebar(true);
  }, [isMobile]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  const handleClickAwaySearch = () => {
    setSearchFocused(false);
    setSearchQuery('');
  };

  const handleChangeSearch = async (event) => {
    try {
      const { value } = event.target;
      setSearchQuery(value);
      if (value) {
        const response = await axios.get('/chat/search', {
          params: { query: value }
        });
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchSelect = (username) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigate(`${PATH_DASHBOARD.chat.root}/${username}`);
  };

  const handleSelectContact = (result) => {
    if (handleSearchSelect) {
      handleSearchSelect(result.username);
    }
  };

  const handleUnreadShowChange = (e) => {
    setOnlyUnreadShow(e.target.checked);
  };

  return (
    <RootStyle sx={{ ...(!openSidebar && { width: 96 }) }}>
      <Box sx={{ py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openSidebar && (
            <>
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <MIconButton onClick={() => setOpenSidebar(!openSidebar)}>
            <Icon width={20} height={20} icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill} />
          </MIconButton>
        </Box>

        {openSidebar && (
          <Box>
            <ChatContactSearch
              query={searchQuery}
              onFocus={handleSearchFocus}
              onChange={handleChangeSearch}
              onClickAway={handleClickAwaySearch}
            />
            <FormControlLabel
              control={<Checkbox checked={onlyUnreadShow} onChange={handleUnreadShowChange} />}
              label="display unread chat partner only"
            />
          </Box>
        )}
      </Box>

      <Scrollbar>
        {/* {!displayResults ? ( */}
        <ChatConversationList
          conversations={conversations}
          isOpenSidebar={openSidebar}
          activeConversationId={activeConversationId}
          // sx={{ ...(isSearchFocused && { display: 'none' }) }}
          query={searchQuery}
          onlyUnreadShow={onlyUnreadShow}
        />
        {/* ) : (
          <ChatSearchResults query={searchQuery} results={searchResults} onSelectContact={handleSelectContact} />
        )} */}
      </Scrollbar>
    </RootStyle>
  );
}
