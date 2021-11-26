import * as Yup from 'yup';
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
  Stack,
  TextField
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Form, FormikProvider, useFormik } from 'formik';

MailSendMessageDialog.propTypes = {
  mailAddress: PropTypes.string,
  message: PropTypes.string,
  onMessage: PropTypes.func,
  onSend: PropTypes.func,
  onClose: PropTypes.func
};

export default function MailSendMessageDialog({ mailAddress, message, onMessage, onSend, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const formSchema = Yup.object().shape({
    message: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: message || ''
    },
    validationSchema: formSchema
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    // so it will close the dialog, if we pass it to the onClose attribute.
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={onSend}>
          <DialogTitle>Mail Send to {mailAddress}</DialogTitle>
          <Box position="absolute" top={0} right={0}>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <DialogContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 0, sm: 0 }}>
              <TextField type="hidden" name="to_email" value={mailAddress} />
              <TextField
                fullWidth
                label="Message"
                multiline
                minRows={6}
                maxRows={6}
                onChange={onMessage}
                value={message}
                {...getFieldProps('message')}
                error={Boolean(touched.message && errors.message)}
                helperText={touched.message && errors.message}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" onClick={onClose}>
              Cancel
            </Button>
            <Button color="secondary" variant="contained" type="submit">
              Send
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
}
