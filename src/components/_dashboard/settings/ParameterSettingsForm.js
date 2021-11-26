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
import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
import AutoAwesomeSharpIcon from '@mui/icons-material/AutoAwesomeSharp';
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

ParameterSettingsForm.propTypes = {
  settingsData: PropTypes.object
};

export default function ParameterSettingsForm({ settingsData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const itemValidation = Yup.object().shape({
    refresh_location_time_interval: Yup.string().required('This field is required'),
    top_information_online_hour: Yup.string().required('This field is required'),
    downloads_message_num: Yup.string().required('This field is required'),
    message_limit_character_num: Yup.string().required('This field is required'),
    domain_name: Yup.string().required('This field is required'),
    app_use_hour: Yup.string().required('This field is required'),
    top_message_num: Yup.string().required('This field is required'),
    top_message_save_hour: Yup.string().required('This field is required'),
    default_coverage: Yup.string().required('This field is required'),
    banned_hour: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      refresh_location_time_interval: settingsData?.settings.refresh_location_time_interval || 5,
      top_information_online_hour: settingsData?.settings.top_information_online_hour || 24,
      downloads_message_num: settingsData?.settings.downloads_message_num || 100,
      message_limit_character_num: settingsData?.settings.message_limit_character_num || 1000,
      domain_name: settingsData?.settings.domain_name || 'toptalk.app',
      app_use_hour: settingsData?.settings.app_use_hour || 1,
      top_message_num: settingsData?.settings.top_message_num || 1,
      top_message_save_hour: settingsData?.settings.top_message_save_hour || 24,
      message_save_hour: settingsData?.settings.message_save_hour || 1,
      default_coverage: settingsData?.settings.default_coverage || 150,
      banned_hour: settingsData?.settings.banned_hour || 72
    },
    validationSchema: itemValidation,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        await axios.put('/settings/parameter/', values);

        // resetForm();
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
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    How often to refresh the user's location: every
                  </Typography>
                  <TextField
                    {...getFieldProps('refresh_location_time_interval')}
                    variant="standard"
                    style={{ width: 80 }}
                    error={Boolean(touched.refresh_location_time_interval && errors.refresh_location_time_interval)}
                    helperText={touched.refresh_location_time_interval && errors.refresh_location_time_interval}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    minutes
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    TOP information is online for
                  </Typography>
                  <TextField
                    {...getFieldProps('top_information_online_hour')}
                    variant="standard"
                    style={{ width: 80 }}
                    error={Boolean(touched.top_information_online_hour && errors.top_information_online_hour)}
                    helperText={touched.top_information_online_hour && errors.top_information_online_hour}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    hours
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    After the user logs into the APP, system downloads last
                  </Typography>
                  <TextField
                    {...getFieldProps('downloads_message_num')}
                    variant="standard"
                    style={{ width: 80 }}
                    error={Boolean(touched.downloads_message_num && errors.downloads_message_num)}
                    helperText={touched.downloads_message_num && errors.downloads_message_num}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    messages of the public chat room
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Each message text is limited to
                  </Typography>
                  <TextField
                    {...getFieldProps('message_limit_character_num')}
                    variant="standard"
                    style={{ width: 80 }}
                    error={Boolean(touched.message_limit_character_num && errors.message_limit_character_num)}
                    helperText={touched.message_limit_character_num && errors.message_limit_character_num}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    characters
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Domain name:
                  </Typography>
                  <TextField
                    {...getFieldProps('domain_name')}
                    variant="standard"
                    style={{ width: 120 }}
                    error={Boolean(touched.domain_name && errors.domain_name)}
                    helperText={touched.domain_name && errors.domain_name}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Visitors are allowed to use APP for
                  </Typography>
                  <TextField
                    {...getFieldProps('app_use_hour')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.app_use_hour && errors.app_use_hour)}
                    helperText={touched.app_use_hour && errors.app_use_hour}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    hours each time
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Each user can only TOP
                  </Typography>
                  <TextField
                    {...getFieldProps('top_message_num')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.top_message_num && errors.top_message_num)}
                    helperText={touched.top_message_num && errors.top_message_num}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    messages
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    The server saves TOP messages in the past
                  </Typography>
                  <TextField
                    {...getFieldProps('top_message_save_hour')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.top_message_save_hour && errors.top_message_save_hour)}
                    helperText={touched.top_message_save_hour && errors.top_message_save_hour}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    hours, and the messages within
                  </Typography>
                  <TextField
                    {...getFieldProps('message_save_hour')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.message_save_hour && errors.message_save_hour)}
                    helperText={touched.message_save_hour && errors.message_save_hour}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    hours of public chat
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    The default max. coverage set is
                  </Typography>
                  <TextField
                    {...getFieldProps('default_coverage')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.default_coverage && errors.default_coverage)}
                    helperText={touched.default_coverage && errors.default_coverage}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    people nearby
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <AutoAwesomeSharpIcon />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    If a user is blocked by 3 users within 24 hours, he will be banned speaking for
                  </Typography>
                  <TextField
                    {...getFieldProps('banned_hour')}
                    variant="standard"
                    style={{ width: 60 }}
                    error={Boolean(touched.banned_hour && errors.banned_hour)}
                    helperText={touched.banned_hour && errors.banned_hour}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    hours
                  </Typography>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Save Changes
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
