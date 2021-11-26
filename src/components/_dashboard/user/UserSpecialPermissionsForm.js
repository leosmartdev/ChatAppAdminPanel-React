import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
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
// import AdjustSharpIcon from '@mui/icons-material/AdjustSharp';
// import AutoAwesomeSharpIcon from '@mui/icons-material/AutoAwesomeSharp';
// utils
import axios from '../../../utils/axios';
// import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
// import Label from '../../Label';
// import { UploadAvatar } from '../../upload';
import ConfirmDialog from '../../ConfirmDialog';

// ----------------------------------------------------------------------

UserSpecialPermissionsForm.propTypes = {
  readOnly: PropTypes.bool,
  currentUser: PropTypes.object,
  userSpecialPermissions: PropTypes.object
};

export default function UserSpecialPermissionsForm({ readOnly, currentUser, userSpecialPermissions }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  readOnly = readOnly || false;
  // console.log(readOnly);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleCloseClearConfirm = () => {
    setClearConfirm(false);
  };

  const onClear = async () => {
    setClearConfirm(true);
  };

  const handleClear = async () => {
    await axios.post(`user/clearSpecialPermission/${currentUser._id}`);
    navigate(PATH_DASHBOARD.user.list);
    enqueueSnackbar('Cleared User Special Permissions Successfully', { variant: 'success' });
  };

  const itemValidation = Yup.object().shape({
    // user_email: Yup.string().required('This field is required'),
    max_coverage: Yup.string().required('This field is required'),
    top_message_max_num: Yup.string().required('This field is required'),
    effect_year: Yup.string().required('This field is required'),
    effect_month: Yup.string().required('This field is required'),
    effect_day: Yup.string().required('This field is required'),
    valid_period: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // user_email: userSpecialPermissions?.user_email || '',
      max_coverage: userSpecialPermissions?.max_coverage || '',
      top_message_max_num: userSpecialPermissions?.top_message_max_num || '',
      effect_year: userSpecialPermissions?.effect_year || '',
      effect_month: userSpecialPermissions?.effect_month || '',
      effect_day: userSpecialPermissions?.effect_day || '',
      valid_period: userSpecialPermissions?.valid_period || ''
    },
    validationSchema: !readOnly ? itemValidation : null,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        await axios.put(`/user/permissions/${currentUser._id}`, values);

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
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" color="inherit" component="div" sx={{ mb: 3 }}>
                User Special Permission
              </Typography>
              <Stack spacing={3}>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    User Email&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <TextField
                    {...getFieldProps('user_email')}
                    variant="standard"
                    style={{ width: 250 }}
                    error={Boolean(touched.user_email && errors.user_email)}
                    helperText={touched.user_email && errors.user_email}
                  />
                </Stack> */}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Max Cover people&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <TextField
                    {...getFieldProps('max_coverage')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 250 }}
                    error={Boolean(touched.max_coverage && errors.max_coverage)}
                    helperText={touched.max_coverage && errors.max_coverage}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    person (range 1 ~ 1,000,000)
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    TOP messages permission&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <TextField
                    {...getFieldProps('top_message_max_num')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 150 }}
                    error={Boolean(touched.top_message_max_num && errors.top_message_max_num)}
                    helperText={touched.top_message_max_num && errors.top_message_max_num}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    (1 ~ 10)
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Effective Time&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <TextField
                    {...getFieldProps('effect_year')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 80 }}
                    error={Boolean(touched.effect_year && errors.effect_year)}
                    helperText={touched.effect_year && errors.effect_year}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    year
                  </Typography>
                  <TextField
                    {...getFieldProps('effect_month')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 80 }}
                    error={Boolean(touched.effect_month && errors.effect_month)}
                    helperText={touched.effect_month && errors.effect_month}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    month
                  </Typography>
                  <TextField
                    {...getFieldProps('effect_day')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 80 }}
                    error={Boolean(touched.effect_day && errors.effect_day)}
                    helperText={touched.effect_day && errors.effect_day}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    day (East America Time from 00:01 AM)
                  </Typography>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    Permissions Valid period&nbsp;&nbsp;&nbsp;
                  </Typography>
                  <TextField
                    {...getFieldProps('valid_period')}
                    variant="standard"
                    inputProps={{ readOnly }}
                    style={{ width: 150 }}
                    error={Boolean(touched.valid_period && errors.valid_period)}
                    helperText={touched.valid_period && errors.valid_period}
                  />
                  <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                    day
                  </Typography>
                </Stack>

                {!readOnly && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      {userSpecialPermissions && (
                        <LoadingButton type="button" color="secondary" variant="contained" onClick={onClear}>
                          Clear Special Permissions
                        </LoadingButton>
                      )}
                      <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        Save Changes
                      </LoadingButton>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
      {clearConfirm && (
        <ConfirmDialog
          message="Are you sure you are going to clear this user's special permission?"
          onConfirm={handleClear}
          onClose={handleCloseClearConfirm}
        />
      )}
    </FormikProvider>
  );
}
