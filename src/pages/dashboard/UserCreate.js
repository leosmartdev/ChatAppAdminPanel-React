import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList, getSpecialPermssionList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import UserSpecialPermissionsForm from '../../components/_dashboard/user/UserSpecialPermissionsForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { userId } = useParams();
  const { userList, specialPermissionList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user._id) === userId);
  // console.log(specialPermissionList);
  const userSpecialPermissions = specialPermissionList.find(
    (specialPermssion) => paramCase(specialPermssion.userId) === userId
  );

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getSpecialPermssionList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new user | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new user' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'New user' : (currentUser && currentUser.name) || '' }
          ]}
        />

        <UserNewForm isEdit={isEdit} currentUser={currentUser} />
        {isEdit && (
          <UserSpecialPermissionsForm currentUser={currentUser} userSpecialPermissions={userSpecialPermissions} />
        )}
      </Container>
    </Page>
  );
}
