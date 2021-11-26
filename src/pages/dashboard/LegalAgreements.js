import React from 'react';
import { useSnackbar } from 'notistack5';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
// material
import { LoadingButton } from '@material-ui/lab';
import { Container, TextField } from '@material-ui/core';
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function LegalAgreements() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
  const [loading, setLoading] = React.useState(false);

  const [privacyPolicyDefaultValue, setPrivacyPolicyDefaultValue] = React.useState('');
  const [privacyPolicy, setPrivacyPolicy] = React.useState(privacyPolicyDefaultValue);

  const [userAgreementDefaultValue, setUserAgreementDefaultValue] = React.useState('');
  const [userAgreement, setUserAgreement] = React.useState(userAgreementDefaultValue);
  const [userAgreementLoading, setUserAgreementLoading] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const { data } = await axios.get('/pages/legal-agreements');
      if (data.success) {
        setPrivacyPolicyDefaultValue(data.pages.privacy);
        console.log(data.pages.privacy);
        setUserAgreementDefaultValue(data.pages.agreement);
      }
    };
    init();
  }, []);

  const policyBtn = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.put('/pages/privacy-policy', {
      content: privacyPolicy
    });
    setLoading(false);
    enqueueSnackbar('Updated Privacy Policy Successfully', { variant: 'success' });
  };

  const agreementBtn = async (e) => {
    e.preventDefault();
    setUserAgreementLoading(true);
    await axios.put('/pages/user-agreement', {
      content: userAgreement
    });
    setUserAgreementLoading(false);
    enqueueSnackbar('Updated User Agreement Successfully', { variant: 'success' });
  };

  return (
    <Page title="Legal Agreement | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <h2 style={{ marginBottom: '20px' }}>Privacy Policy</h2>
        <TextField
          fullWidth
          // label="Privacy Policy"
          placeholder="Write something!"
          multiline
          minRows={15}
          maxRows={15}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          defaultValue={privacyPolicyDefaultValue}
          sx={{ mb: 2 }}
        />
        {/* <textarea
          defaultValue={privacyPolicyDefaultValue}
          placeholder="Write something!"
          onChange={(e) => setPrivacyPolicy(e.target.value)}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '6em',
            cursor: 'text',
            marginTop: '20px',
            marginBottom: '10px',
            width: '100%'
          }}
        /> */}

        <LoadingButton type="submit" variant="contained" loading={loading} onClick={policyBtn}>
          Save Changes
        </LoadingButton>

        <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>User Agreement</h2>
        <TextField
          fullWidth
          // label="User Agreement"
          placeholder="Write something!"
          multiline
          minRows={15}
          maxRows={15}
          onChange={(e) => setUserAgreement(e.target.value)}
          defaultValue={userAgreementDefaultValue}
          sx={{ mb: 2 }}
        />
        {/* <textarea
          placeholder="Write something!"
          defaultValue={userAgreementDefaultValue}
          onChange={(e) => setUserAgreement(e.target.value)}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            minHeight: '6em',
            cursor: 'text',
            marginBottom: '10px',
            width: '100%'
          }}
        /> */}
        <LoadingButton type="submit" variant="contained" loading={userAgreementLoading} onClick={agreementBtn}>
          Save Changes
        </LoadingButton>
      </Container>
    </Page>
  );
}
