import { useEffect } from 'react';
// import { paramCase } from 'change-case';
// import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getSettingsList } from '../../redux/slices/settings';
// import { getWordList } from '../../redux/slices/prohibitedword';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ParameterSettingsForm from '../../components/_dashboard/settings/ParameterSettingsForm';

// ----------------------------------------------------------------------

export default function ParameterSettings() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  // const { word } = useParams();
  const { settingsList } = useSelector((state) => state.setting);
  const parameterSettings = settingsList.find((settingRow) => settingRow.type === 'parameter');

  useEffect(() => {
    dispatch(getSettingsList());
  }, [dispatch]);

  return (
    <Page title="Settings: Parameter Settings | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Parameter Settings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Settings', href: PATH_DASHBOARD.settings.parameters },
            { name: 'Parameters' }
          ]}
        />

        <ParameterSettingsForm settingsData={parameterSettings} />
      </Container>
    </Page>
  );
}
