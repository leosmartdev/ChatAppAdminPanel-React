import React from 'react';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
// material
import { LoadingButton } from '@material-ui/lab';
import { Container } from '@material-ui/core';
import axios from '../../utils/axios';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function PrivacyPolicy() {
  const { themeStretch } = useSettings();
  const [loading, setLoading] = React.useState(false);

  const [privacyPolicyDefaultValue, setPrivacyPolicyDefaultValue] = React.useState('');
  const [privacyPolicy, setPrivacyPolicy] = React.useState(privacyPolicyDefaultValue);

  React.useEffect(() => {
    const init = async () => {
      const { data } = await axios.get('/pages/privacy-policy');
      if (data.success) {
        setPrivacyPolicyDefaultValue(data.content);
      }
    };
    init();
  }, []);

  return (
    <Page title="Privacy Policy | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <h2>Privacy Policy</h2>
        <textarea
          defaultValue={privacyPolicyDefaultValue}
          placeholder="Write something!"
          readOnly="true"
          style={{
            // border: '1px solid #ccc',
            padding: '10px',
            minHeight: '38em',
            cursor: 'text',
            marginTop: '20px',
            marginBottom: '10px',
            width: '100%'
          }}
        />
      </Container>
    </Page>
  );
}
