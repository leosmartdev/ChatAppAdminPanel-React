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
import UserDetailsForm from '../../components/_dashboard/user/UserDetailsForm';
import UserSpecialPermissionsForm from '../../components/_dashboard/user/UserSpecialPermissionsForm';

// ----------------------------------------------------------------------

export default function UserDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { userId } = useParams();
  const { userList, specialPermissionList } = useSelector((state) => state.user);
  const currentUser = userList.find((user) => paramCase(user._id) === userId);
  const userSpecialPermissions = specialPermissionList.find(
    (specialPermssion) => paramCase(specialPermssion.userId) === userId
  );
  const readOnly = true;

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getSpecialPermssionList());
  }, [dispatch]);

  return (
    <Page title="User: Create a new user | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: `${currentUser && currentUser.name}` }
          ]}
        />

        <UserDetailsForm currentUser={currentUser} />
        {userSpecialPermissions && (
          <UserSpecialPermissionsForm
            readOnly={readOnly}
            currentUser={currentUser}
            userSpecialPermissions={userSpecialPermissions}
          />
        )}
      </Container>
    </Page>
  );
}
