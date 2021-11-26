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
import axios from '../../../../utils/axios';
import fakeRequest from '../../../../utils/fakeRequest';

// ----------------------------------------------------------------------

ProhibitedWordMessageForm.propTypes = {
  prohibitedWordSettings: PropTypes.object
};

export default function ProhibitedWordMessageForm({ prohibitedWordSettings }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const ProhibitedWordMessageSchema = Yup.object().shape({
    admin_message: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      admin_message:
        prohibitedWordSettings?.settings.admin_message ||
        'Your message has contents that violate the "User Agreement", please edit it and then send it again.'
    },
    validationSchema: ProhibitedWordMessageSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        await axios.put(`/settings/prohibited_word`, values);

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
