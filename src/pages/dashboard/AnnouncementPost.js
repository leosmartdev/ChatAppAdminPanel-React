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
import AnnouncementPostForm from '../../components/_dashboard/announcement/PostForm';

// ----------------------------------------------------------------------

export default function AnnouncementPost() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  // const { pathname } = useLocation();
  // const { word } = useParams();
  const { settingsList } = useSelector((state) => state.setting);
  // const parameterSettings = settingsList.find((settingRow) => settingRow.type === 'parameter');

  useEffect(() => {
    dispatch(getSettingsList());
  }, [dispatch]);

  return (
    <Page title="Announcement: Post | TopTalk">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Announcement Post"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Announcement Post' }]}
        />

        <AnnouncementPostForm />
      </Container>
    </Page>
  );
}
