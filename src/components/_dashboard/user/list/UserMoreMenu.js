import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { paramCase } from 'change-case';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Stack, Box, Link, Button } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

UserMoreMenu.propTypes = {
  onDelete: PropTypes.func,
  userName: PropTypes.string,
  userId: PropTypes.string
};

export default function UserMoreMenu({ onDelete, userName, userId }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={RouterLink}
          to={`${PATH_DASHBOARD.user.root}/${paramCase(userId)}/edit`}
          sx={{ color: 'text.secondary' }}
        >
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem onClick={onDelete} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem component={RouterLink} to={`${PATH_DASHBOARD.chat.root}`} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={messageCircleFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Chat" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu> */}

      <Stack direction={{ xs: 'column', sm: 'row' }}>
        <Button
          variant="text"
          component={RouterLink}
          to={`${PATH_DASHBOARD.user.root}/${paramCase(userId)}/edit`}
          sx={{ color: 'text.secondary' }}
          style={{ minWidth: 'unset', padding: '5px' }}
        >
          <Icon icon={editFill} width={18} height={18} />
        </Button>
        <Button
          variant="text"
          onClick={onDelete}
          sx={{ color: 'text.secondary' }}
          style={{ minWidth: 'unset', padding: '5px' }}
        >
          <Icon icon={trash2Outline} width={18} height={18} />
        </Button>
        <Button
          variant="text"
          component={RouterLink}
          to={`${PATH_DASHBOARD.chat.private}/${userId}`}
          sx={{ color: 'text.secondary' }}
          style={{ minWidth: 'unset', padding: '5px' }}
        >
          <Icon icon={messageCircleFill} width={18} height={18} />
        </Button>
      </Stack>
    </>
  );
}
