import { useRef, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
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
  Typography,
  TextareaAutosize,
  TextField,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  styled,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CancelIcon from '@material-ui/icons/Cancel';
import roundAddPhotoAlternate from '@iconify/icons-ic/round-add-photo-alternate';
// utils
import axios from '../../../utils/axios';
import fakeRequest from '../../../utils/fakeRequest';

// ----------------------------------------------------------------------

export default function AnnouncementPostForm() {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadImgs, setUploadImgs] = useState(null);

  const handleAttach = () => {
    if (imageFiles.length === 9) {
      enqueueSnackbar('Uploaded pictures (max. 9) from hard-disk.', { variant: 'info' });
      return;
    }
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    // console.log(e.target.files);
    const fileObj = [];
    let fileArray = [];
    if (imageFiles.length > 0) {
      fileArray = imageFiles.map((file) => file);
    }
    const formData = uploadImgs || new FormData();
    fileObj.push(e.target.files);
    const startIndex = (imageFiles.length > 0 && imageFiles[imageFiles.length - 1].index + 1) || 0;
    for (let i = 0, index = startIndex; i < fileObj[0].length && fileArray.length < 9; i += 1, index += 1) {
      const file = fileObj[0][i];
      formData.append(`img[${index}]`, file, file.name);
      fileArray.push({ index, name: file.name, url: URL.createObjectURL(file) });
    }
    console.log(fileArray, formData);
    setImageFiles(fileArray);
    setUploadImgs(formData);
  };

  const handleCloseImage = (index) => {
    const filterFiles = imageFiles.filter((file) => file.index !== index);
    const formData = uploadImgs;
    formData.delete(`img[${index}]`);
    setImageFiles(filterFiles);
    setUploadImgs(formData);
  };

  const MessageImgStyle = styled('img')(({ theme }) => ({
    height: 80,
    minWidth: 80,
    width: 'auto',
    cursor: 'pointer',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius
  }));

  const itemValidation = Yup.object().shape({
    message: Yup.string().required('This field is required'),
    position: Yup.string().required('This field is required'),
    coverage: Yup.string().required('This field is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: '',
      posted_at: 'public',
      publisher: 'admin',
      position: '',
      coverage: 150
    },
    validationSchema: itemValidation,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        await fakeRequest(500);

        let imgs = [];

        if (uploadImgs) {
          const res = await axios.post('/roomMessages/upload_multi_imgs', uploadImgs);
          imgs = res.data.data;
          setImageFiles([]);
          setUploadImgs(null);
        }

        values.imgs = imgs;
        await axios.post('/roomMessages/announcement', values);

        resetForm();
        setSubmitting(false);
        enqueueSnackbar('Posted announcement successfully', { variant: 'success' });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar(`Error occured: ${error.message}`, { variant: 'error' });
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  // console.log(values);

  console.log(imageFiles);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextareaAutosize
                    {...getFieldProps('message')}
                    maxRows={20}
                    minRows={6}
                    aria-label="Post Public Announcement"
                    placeholder="text input(max. 2000 words)"
                    style={{ width: '100%', padding: '10px' }}
                    // inputProps={{ maxLength: 2000 }}
                    // error={Boolean(touched.message && errors.message)}
                    // helperText={touched.message && errors.message}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="body1" component="div" style={{ lineHeight: 3 }}>
                    Add pictures (max. 9) from hard-disk.
                  </Typography>
                  <IconButton size="small" onClick={handleAttach}>
                    <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
                  </IconButton>
                </Stack>

                {imageFiles.length > 0 && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 1, mb: 1 }} spacing={{ xs: 3, sm: 2 }}>
                    {/* <ImageList sx={{ width: '100%', height: 50 }} cols={10} rowHeight={164}> */}
                    {imageFiles.map((img) => (
                      // <MessageImgStyle key={`${img.index}`} alt="attachment" src={`${img.url}`} />
                      <ImageListItem key={`${img.index}`}>
                        <MessageImgStyle key={`${img.index}`} alt="attachment" src={`${img.url}`} />
                        <ImageListItemBar
                          sx={{ background: 'transparent' }}
                          // title={item.title}
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: '#115293', backgroundColor: 'white' }}
                              aria-label="close"
                              onClick={(e) => handleCloseImage(img.index)}
                              size="small"
                              style={{ position: 'absolute', top: '-15px', right: '-15px' }}
                            >
                              <CancelIcon width={15} height={15} />
                            </IconButton>
                          }
                          actionPosition="right"
                        />
                      </ImageListItem>
                    ))}
                    {/* </ImageList> */}
                  </Stack>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 10, sm: 8 }}>
                  <Typography variant="subtitle1" component="div" style={{ lineHeight: 2 }}>
                    Post at
                  </Typography>
                  <RadioGroup
                    {...getFieldProps('posted_at')}
                    aria-label="Posted at"
                    // error={Boolean(touched.posted_at && errors.posted_at)}
                    // helperText={touched.posted_at && errors.posted_at}
                  >
                    <FormControlLabel value="public" control={<Radio />} label="Public chat room" />
                    <FormControlLabel value="top" control={<Radio />} label="Top column" />
                  </RadioGroup>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 8, sm: 5 }}>
                  <Typography variant="subtitle1" component="div" style={{ lineHeight: 2 }}>
                    Publisher
                  </Typography>
                  <RadioGroup
                    {...getFieldProps('publisher')}
                    aria-label="Publisher"
                    // error={Boolean(touched.publisher && errors.publisher)}
                    // helperText={touched.publisher && errors.publisher}
                  >
                    <FormControlLabel value="admin" control={<Radio />} label="App administrator (default)" />
                    <FormControlLabel value="user" control={<Radio />} label="User email" />
                  </RadioGroup>
                </Stack>

                {values.publisher === 'user' && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 18, sm: 15 }}>
                    <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                      &nbsp;
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <TextField
                        {...getFieldProps('poster_email')}
                        variant="standard"
                        style={{ width: 200 }}
                        // error={Boolean(touched.poster_email && errors.poster_email)}
                        // helperText={touched.poster_email && errors.poster_email}
                      />
                      <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                        (announcement post by user's name/avatar)
                      </Typography>
                    </Stack>
                  </Stack>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="subtitle1" component="div" style={{ lineHeight: 2 }}>
                    Range Setting
                  </Typography>
                  <Stack spacing={1}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                        Center (longitude, latitude)
                      </Typography>
                      <TextField
                        {...getFieldProps('position')}
                        variant="standard"
                        style={{ width: 300 }}
                        error={Boolean(touched.position && errors.position)}
                        helperText={touched.position && errors.position}
                      />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                      <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                        Cover people
                      </Typography>
                      <TextField
                        {...getFieldProps('coverage')}
                        variant="standard"
                        style={{ width: 200 }}
                        error={Boolean(touched.coverage && errors.coverage)}
                        helperText={touched.coverage && errors.coverage}
                      />
                      <Typography variant="body1" component="div" style={{ lineHeight: 2 }}>
                        person（ between 0 ~ 1 million )
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <Box sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    SEND MESSAGE
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </FormikProvider>
  );
}
