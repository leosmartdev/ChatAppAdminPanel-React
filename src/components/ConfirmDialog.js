import PropTypes from 'prop-types';
import { useState } from 'react';
// material ui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
// import create from 'zustand';

// const ConfirmDialog = () => {
//   return (
//     <Dialog open={true} maxWidth="sm" fullWidth>
//       <DialogTitle>Confirm the action</DialogTitle>
//       <Box position="absolute" top={0} right={0}>
//         <IconButton>
//           <Close />
//         </IconButton>
//       </Box>
//       <DialogContent>
//         <Typography>some message here</Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button color="primary" variant="contained">
//           Cancel
//         </Button>
//         <Button color="secondary" variant="contained">
//           Confirm
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// const useConfirmDialogStore = create((set) => ({
//   message: '',
//   onSubmit: undefined,
//   close: () => set({ onSubmit: undefined })
// }));

ConfirmDialog.propTypes = {
  message: PropTypes.string,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func
};

export default function ConfirmDialog({ message, onConfirm, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    // so it will close the dialog, if we pass it to the onClose attribute.
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
            onClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
