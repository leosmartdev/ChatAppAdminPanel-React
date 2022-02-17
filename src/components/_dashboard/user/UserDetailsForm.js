import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Avatar
} from '@material-ui/core';
// utils
import axios from '../../../utils/axios';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import Label from '../../Label';
import { serverConfig } from '../../../config';

// ----------------------------------------------------------------------

UserDetailsForm.propTypes = {
  currentUser: PropTypes.object,
  userSpecialPermissions: PropTypes.object,
  parameterSettings: PropTypes.object
};

export default function UserDetailsForm({ currentUser, userSpecialPermissions, parameterSettings }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const role = currentUser
    ? ((currentUser.role === 'user' || currentUser.role === 's-user') && userSpecialPermissions && 's-user') ||
      currentUser.role
    : '';
  const displayMaxCoverage =
    (userSpecialPermissions && userSpecialPermissions.max_coverage) ||
    (parameterSettings && parameterSettings.settings.default_coverage) ||
    150;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: '',
      gender: currentUser && currentUser.gender > -1 ? currentUser.gender : '',
      role: role || '',
      coverage: currentUser?.coverage || 50,
      max_coverage: displayMaxCoverage,
      location: currentUser ? `${currentUser.location.coordinates[1]}, ${currentUser.location.coordinates[0]}` : '',
      fixedLocation: currentUser?.fixedLocation || '',
      phoneNumber: currentUser?.phoneNumber || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      state: currentUser?.state || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: (currentUser && `${serverConfig.baseUrl}/user/img-src/${currentUser.avatarUrl}`) || null,
      isVerified: currentUser?.isVerified || true,
      status: currentUser?.status,
      online: currentUser?.online || false,
      onlineStatus: (currentUser?.online && 'online') || 'offline',
      username: currentUser?.username || '',
      note: currentUser?.note || '',
      credit: currentUser?.credit || '0 %',
      balance: currentUser?.balance || '$ 0'
    },
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        await axios.put(`/user/manage-users?username=${values.username}`, values);

        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>

              <Box sx={{ mb: 5 }}>
                <Avatar src={values.avatarUrl} />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Box>

              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    disabled
                    onChange={(event) => setFieldValue('status', event.target.checked ? 'banned' : 'active')}
                    checked={values.status !== 'active'}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />

              <FormControlLabel
                labelPlacement="start"
                control={<Switch disabled {...getFieldProps('isVerified')} checked={values.isVerified} />}
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    disabled
                    inputProps={{ readOnly: true }}
                    fullWidth
                    label="Email"
                    {...getFieldProps('email')}
                  />
                  <TextField
                    disabled
                    inputProps={{ readOnly: true }}
                    fullWidth
                    label="Nickname"
                    {...getFieldProps('name')}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    {...getFieldProps('gender')}
                    SelectProps={{ native: true }}
                    disabled
                  >
                    <option value="" />
                    <option key="male" value="0">
                      Male
                    </option>
                    <option key="female" value="1">
                      Female
                    </option>
                    <option key="business" value="2">
                      Business
                    </option>
                  </TextField>
                  <TextField disabled fullWidth label="Role" {...getFieldProps('role')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField disabled fullWidth label="Credit" {...getFieldProps('credit')} />
                  <TextField disabled fullWidth label="Balance" {...getFieldProps('balance')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField disabled fullWidth label="Status" {...getFieldProps('onlineStatus')} />
                  <TextField disabled fullWidth label="Punishment" {...getFieldProps('punishment')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField disabled fullWidth label="Coverage" {...getFieldProps('coverage')} />
                  <TextField disabled fullWidth label="Max Coverage" {...getFieldProps('max_coverage')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField disabled fullWidth label="Location" {...getFieldProps('country')} />
                  <TextField disabled fullWidth label="Latitude and logintude" {...getFieldProps('location')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField disabled fullWidth label="Registration Date" {...getFieldProps('created')} />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    disabled
                    fullWidth
                    label="Note"
                    multiline
                    minRows={4}
                    maxRows={4}
                    {...getFieldProps('note')}
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
