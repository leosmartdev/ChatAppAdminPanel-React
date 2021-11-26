import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel
} from '@material-ui/core';
// utils
import axios from '../../../utils/axios';
import fakeRequest from '../../../utils/fakeRequest';

// ----------------------------------------------------------------------

ChatAdminMessageForm.propTypes = {
  chatSettings: PropTypes.object
};

export default function ChatAdminMessageForm({ chatSettings }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const ChatAdminMessageSchema = Yup.object().shape({
    admin_message: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      admin_message:
        chatSettings?.settings.admin_message ||
        'Please leave a message, I will reply to you as soon as possible. You may talk about anything: advertising, complaining, suggestions, advice, cooperation, etc.'
    },
    validationSchema: ChatAdminMessageSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        await axios.put(`/settings/chat`, values);

        setSubmitting(false);
        enqueueSnackbar('Update success', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Admin Message"
                    multiline
                    minRows={2}
                    maxRows={4}
                    {...getFieldProps('admin_message')}
                    error={Boolean(touched.message && errors.message)}
                    helperText={touched.message && errors.message}
                  />
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save
                  </LoadingButton>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
