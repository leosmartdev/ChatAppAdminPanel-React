import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
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
import countries from './countries';
import useAuth from '../../../hooks/useAuth';
import ConfirmDialog from '../../ConfirmDialog';
import { serverConfig } from '../../../config';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object
};

export default function UserNewForm({ isEdit, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuth();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const onDeleteUser = async () => {
    if (currentUser._id !== user._id) {
      setOpenDeleteConfirm(true);
    } else {
      enqueueSnackbar("You can't delete this user you logged in", { variant: 'warning' });
    }
  };

  const handleDeleteUser = async () => {
    if (currentUser._id !== user._id) {
      await axios.delete(`user/delete/${currentUser._id}`);
      navigate(PATH_DASHBOARD.user.list);
    }
  };

  const currencies = [
    {
      value: 'USD',
      label: '$'
    },
    {
      value: 'EUR',
      label: '€'
    },
    {
      value: 'BTC',
      label: '฿'
    },
    {
      value: 'JPY',
      label: '¥'
    }
  ];

  let NewUserSchema = null;

  if (!isEdit) {
    NewUserSchema = Yup.object().shape({
      // name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required').email(),
      password: Yup.string().required('Password is required'),
      gender: Yup.string().required('Gender is required'),
      role: Yup.string().required('Role is required')
      // coverage: Yup.string().required('Coverage is required'),
      // address: Yup.string().required('Address is required'),
      // phoneNumber: Yup.string().required('Phone number is required'),
      // country: Yup.string().required('country is required'),
      // state: Yup.string().required('State is required'),
      // city: Yup.string().required('City is required')
    });
  } else {
    NewUserSchema = Yup.object().shape({
      // name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required').email(),
      password: Yup.string().required('Password is required'),
      gender: Yup.string().required('Gender is required')
      // role: Yup.string().required('Role is required'),
      // coverage: Yup.string().required('Coverage is required'),
      // address: Yup.string().required('Address is required'),
      // phoneNumber: Yup.string().required('Phone number is required'),
    });
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: currentUser?.originPassword || '',
      gender: currentUser && currentUser.gender > -1 ? currentUser.gender : '',
      role: currentUser?.role || '',
      balance: currentUser?.balance || 0,
      balanceCurrency: currentUser?.balanceCurrency || '$',
      punishment: currentUser?.punishment || 0,
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
      username: currentUser?.username || '',
      note: currentUser?.note || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        if (!isEdit) {
          if (!values.isVerified) {
            enqueueSnackbar(
              'The system sends an email to your email address, please click the link in the email to finish verification, thank you.',
              { variant: 'info', delay: 3000 }
            );
          }
          await axios.post('/user/create', values);
        } else {
          await axios.post(`/user/update/${currentUser._id}`, values);
        }

        if (avatarImage) {
          await axios.post(`/user/img/${currentUser._id}`, avatarImage);
        }

        resetForm();
        setSubmitting(false);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.list);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(error.message, { variant: 'error' });
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const handleAbort = async () => {
    navigate(PATH_DASHBOARD.user.list);
  };

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append('img', file, file.name);
        setAvatarImage(formData);
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  const handleChangeEmail = useCallback((event) => {
    const emailValue = event.target.value;
    setFieldValue('email', emailValue);
    const currentName = getFieldProps('name').value;
    if (currentName.trim() === '') {
      const nameInd = emailValue.indexOf('@');
      if (nameInd !== -1) {
        setFieldValue('name', emailValue.slice(0, nameInd));
      }
    }
  });

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                >
                  {values.status}
                </Label>
              )}

              {isEdit && (
                <Box sx={{ mb: 5 }}>
                  <UploadAvatar
                    accept="image/*"
                    file={values.avatarUrl}
                    maxSize={3145728}
                    onDrop={handleDrop}
                    error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                    caption={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary'
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of {fData(3145728)}
                      </Typography>
                    }
                  />
                  <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {touched.avatarUrl && errors.avatarUrl}
                  </FormHelperText>
                </Box>
              )}

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
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
              )}

              <FormControlLabel
                labelPlacement="start"
                control={<Switch {...getFieldProps('isVerified')} checked={values.isVerified} />}
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
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    onChange={handleChangeEmail}
                  />
                  <TextField
                    fullWidth
                    label="NickName"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    // type="password"
                    fullWidth
                    label="Password"
                    {...getFieldProps('password')}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    {...getFieldProps('gender')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.gender && errors.gender)}
                    helperText={touched.gender && errors.gender}
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
                </Stack>

                {!isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Role"
                      {...getFieldProps('role')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.role && errors.role)}
                      helperText={touched.role && errors.role}
                    >
                      <option value="" />
                      <option key="user" value="user">
                        user
                      </option>
                      <option key="admin" value="admin">
                        admin
                      </option>
                    </TextField>
                    {/* {isEdit && (
                      <TextField
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        label="Coverage"
                        {...getFieldProps('coverage')}
                        error={Boolean(touched.coverage && errors.coverage)}
                        helperText={touched.coverage && errors.coverage}
                      />
                    )} */}
                  </Stack>
                )}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                  <TextField
                    fullWidth
                    label="Latitude and longitude"
                    {...getFieldProps('location')}
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                  />
                </Stack> */}

                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      label="Fixed Location"
                      {...getFieldProps('fixedLocation')}
                      error={Boolean(touched.fixedLocation && errors.fixedLocation)}
                      helperText={touched.fixedLocation && errors.fixedLocation}
                    />
                  </Stack>
                )}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Country"
                    placeholder="Country"
                    {...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="State/Region"
                    {...getFieldProps('state')}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                  />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="City"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                  <TextField fullWidth label="Zip/Code" {...getFieldProps('zipCode')} />
                </Stack> */}

                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    {...getFieldProps('username')}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />
                </Stack> */}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Note"
                    multiline
                    minRows={4}
                    maxRows={4}
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                  />
                </Stack>

                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                      Balance: &nbsp;&nbsp;&nbsp;
                    </Typography>
                    <TextField
                      // select
                      variant="standard"
                      style={{ width: 100 }}
                      {...getFieldProps('balanceCurrency')}
                      // SelectProps={{ native: true }}
                      error={Boolean(touched.balanceCurrency && errors.balanceCurrency)}
                      helperText={touched.balanceCurrency && errors.balanceCurrency}
                    >
                      {/* {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))} */}
                    </TextField>
                    <TextField
                      variant="standard"
                      style={{ width: 100 }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      {...getFieldProps('balance')}
                      error={Boolean(touched.balance && errors.balance)}
                      helperText={touched.balance && errors.balance}
                    />
                  </Stack>
                )}

                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                      Punishment: &nbsp;&nbsp;&nbsp; banned from talking,
                    </Typography>
                    <TextField
                      variant="standard"
                      style={{ width: 50 }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      {...getFieldProps('punishment')}
                      error={Boolean(touched.punishment && errors.punishment)}
                      helperText={touched.punishment && errors.punishment}
                    />
                    <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                      hours remaining
                    </Typography>
                  </Stack>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    {isEdit && (
                      <LoadingButton type="button" color="error" variant="contained" onClick={onDeleteUser}>
                        Delete This User
                      </LoadingButton>
                    )}
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Create User' : 'Save Changes'}
                    </LoadingButton>
                    <LoadingButton type="button" color="warning" variant="contained" onClick={handleAbort}>
                      Abort
                    </LoadingButton>
                  </Stack>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
      {openDeleteConfirm && (
        <ConfirmDialog
          message="Are you sure you are going to delete this user?"
          onConfirm={handleDeleteUser}
          onClose={handleCloseDeleteConfirm}
        />
      )}
    </FormikProvider>
  );
}
