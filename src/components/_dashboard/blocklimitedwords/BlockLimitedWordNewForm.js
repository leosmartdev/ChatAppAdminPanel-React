import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
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
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadAvatar } from '../../upload';

// ----------------------------------------------------------------------

BlockLimitedWordNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentWord: PropTypes.object
};

export default function BlockLimitedWordNewForm({ isEdit, currentWord }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    word: Yup.string().required('Word is required')
    // replacewith: Yup.string().required('ReplaceWith is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      word: currentWord?.word || '',
      replacewith: currentWord?.replacewith || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        if (!isEdit) {
          await axios.post('/block-limited-words/', values);
        } else {
          await axios.put(`/block-limited-words?word=${currentWord?.word}`, values);
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.blocklimitedwords.list);
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
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Block Limited Word"
                    {...getFieldProps('word')}
                    error={Boolean(touched.word && errors.word)}
                    helperText={touched.word && errors.word}
                  />

                  {/* <TextField
                    fullWidth
                    label="Replace With"
                    {...getFieldProps('replacewith')}
                    error={Boolean(touched.replacewith && errors.replacewith)}
                    helperText={touched.replacewith && errors.replacewith}
                  /> */}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Block Limited Word' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
