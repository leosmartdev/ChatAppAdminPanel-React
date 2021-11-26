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

export default function UserAgreement() {
  const { themeStretch } = useSettings();

  const [userAgreementDefaultValue, setUserAgreementDefaultValue] = React.useState('');
  const [userAgreement, setUserAgreement] = React.useState(userAgreementDefaultValue);
  const [userAgreementLoading, setUserAgreementLoading] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const { data } = await axios.get('/pages/user-agreement');
      if (data.success) {
        setUserAgreementDefaultValue(data.content);
      }
    };
    init();
  }, []);

  return (
    <Page title="Legal Agreement | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <h2>User Agreement</h2>
        <textarea
          placeholder="Write something!"
          defaultValue={userAgreementDefaultValue}
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
