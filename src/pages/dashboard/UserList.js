import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase, paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@material-ui/core/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import axios from '../../utils/axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList, deleteUser, getSpecialPermssionList } from '../../redux/slices/user';
import { getSettingsList } from '../../redux/slices/settings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_dashboard/user/list';
import ConfirmDialog from '../../components/ConfirmDialog';
import { serverConfig } from '../../config';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'email', label: 'Account(Email)', alignRight: false },
  { id: 'name', label: 'Nickname', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'credit', label: 'Credit', alignRight: false },
  { id: 'balance', label: 'Balance', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'max_coverage', label: 'Max Coverage', alignRight: false },
  { id: 'location', label: 'Location', alignRight: false },
  { id: 'operation', label: 'Operation', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    array = stabilizedThis.map((el) => el[0]);
    return filter(array, (_user) => {
      if (query.filterName && _user.name.toLowerCase().indexOf(query.filterName.toLowerCase()) === -1) {
        return false;
      }
      if (query.filterEmail && _user.email.toLowerCase().indexOf(query.filterEmail.toLowerCase()) === -1) {
        return false;
      }
      return true;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { userList, specialPermissionList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('role');
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(
    localStorage.getItem('userlist_rows_per_page') ? Number(localStorage.getItem('userlist_rows_per_page')) : 25
  );
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [handleUserId, setHandleUserId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const { settingsList } = useSelector((state) => state.setting);
  const parameterSettings = settingsList.find((settingRow) => settingRow.type === 'parameter');

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getSpecialPermssionList());
    dispatch(getSettingsList());
  }, [dispatch]);

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    localStorage.setItem('userlist_rows_per_page', parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterByEmail = (event) => {
    setFilterEmail(event.target.value);
  };

  const onDeleteUser = async (userId) => {
    if (userId !== user._id) {
      setHandleUserId(userId);
      setOpenDeleteConfirm(true);
    } else {
      enqueueSnackbar("You can't delete this user you logged in", { variant: 'warning' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId !== user._id) {
      dispatch(deleteUser(userId));
      await axios.delete(`user/delete/${userId}`);
      setHandleUserId(null);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;
  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), {
    filterName,
    filterEmail
  });

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User: List | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.newUser}
              startIcon={<Icon icon={plusFill} />}
            >
              New User
            </Button>
          }
        />

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterEmail={filterEmail}
            onFilterEmail={handleFilterByEmail}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      _id,
                      email,
                      name,
                      avatarUrl,
                      role,
                      credit,
                      balanceCurrency,
                      balance,
                      status,
                      isVerified,
                      address,
                      coverage,
                      country,
                      online
                    } = row;
                    const userSpecialPermissions = specialPermissionList.find(
                      (specialPermssion) => paramCase(specialPermssion.userId) === _id
                    );
                    const displayRole =
                      (role === 'user' || role === 's-user') && userSpecialPermissions ? 's-user' : role;
                    const isItemSelected = selected.indexOf(name) !== -1;
                    const avatarImgSrc = `${serverConfig.baseUrl}/user/img-src/${avatarUrl}`;
                    const displayMaxCoverage =
                      (userSpecialPermissions && userSpecialPermissions.max_coverage) ||
                      (parameterSettings && parameterSettings.default_coverage) ||
                      150;

                    return (
                      <TableRow
                        hover
                        key={_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" align="left" style={{ padding: '0' }}>
                          <Typography
                            variant="body2"
                            noWrap
                            component={RouterLink}
                            to={`${PATH_DASHBOARD.user.root}/${paramCase(_id)}/details`}
                            style={{ color: 'unset', textDecorationLine: 'none', maxWidth: '150px', display: 'block' }}
                          >
                            {email}
                          </Typography>
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none" align="left">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            component={RouterLink}
                            to={`${PATH_DASHBOARD.user.root}/${paramCase(_id)}/details`}
                            style={{ color: 'unset', textDecorationLine: 'none' }}
                          >
                            <Avatar alt={name} src={avatarImgSrc} />
                            <Typography variant="body2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left" style={{ padding: '0' }}>
                          {displayRole}
                        </TableCell>
                        <TableCell align="right">{credit || 0} %</TableCell>
                        <TableCell align="right">
                          {balanceCurrency || '$'} {balance || 0}
                        </TableCell>
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}
                        <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(!online && 'warning') || 'success'}
                          >
                            {online ? 'online' : 'offline'}
                          </Label>
                        </TableCell>
                        <TableCell align="left">{(role !== 'admin' && displayMaxCoverage) || 'all'}</TableCell>
                        <TableCell align="left">{address}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu onDelete={() => onDeleteUser(_id)} userName={name} userId={_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={`${filterName}, ${filterEmail}`} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {openDeleteConfirm && (
          <ConfirmDialog
            message="Are you sure you are going to delete this user?"
            onConfirm={() => handleDeleteUser(handleUserId)}
            onClose={handleCloseDeleteConfirm}
          />
        )}
      </Container>
    </Page>
  );
}
