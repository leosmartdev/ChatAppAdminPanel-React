import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack5';
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
  TablePagination
} from '@material-ui/core';
import emailjs from 'emailjs-com';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getSettingsList } from '../../redux/slices/settings';
import { getUserList } from '../../redux/slices/user';
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
import { MailListHead, MailListToolbar } from '../../components/_dashboard/mail/list';
import MailSendMessageDialog from '../../components/_dashboard/mail/MailSendMessageDialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [{ id: 'email', label: 'Mail', alignRight: false }, { id: '' }];

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
      if (query.filterLocation && _user.address.toLowerCase().indexOf(query.filterLocation.toLowerCase()) === -1) {
        return false;
      }
      if (Number(query.filterCoverage) > 0 && _user.coverage < query.filterCoverage) {
        return false;
      }
      if (Number(query.filterBalance) > 0 && _user.balance < query.filterBalance) {
        return false;
      }
      if (Number(query.filterCredit) > 0 && _user.credit < query.filterCredit) {
        return false;
      }
      return true;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MailList() {
  const { themeStretch } = useSettings();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { userList } = useSelector((state) => state.user);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('email');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCoverage, setFilterCoverage] = useState('');
  const [filterBalance, setFilterBalance] = useState('');
  const [filterCredit, setFilterCredit] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(
    localStorage.getItem('maillist_rows_per_page') ? Number(localStorage.getItem('maillist_rows_per_page')) : 25
  );
  const { settingsList } = useSelector((state) => state.setting);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [handleMailAddress, setHandleMailAddress] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getSettingsList());
  }, [dispatch]);

  const handleCloseSendMsgDlg = () => {
    setOpenMessageDialog(false);
  };

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMsg = (e) => {
    // console.log(message, handleMailAddress, e);
    setOpenMessageDialog(false);

    e.preventDefault();

    emailjs.sendForm('service_wn9lisb', 'template_m65qsyc', e.target, 'user_MxzB0RTW3TNvE5j2yxcMi').then(
      (result) => {
        console.log(result);
        enqueueSnackbar('Send Message Successfully', { variant: 'success' });
      },
      (error) => {
        enqueueSnackbar(error.text, { variant: 'error' });
        console.log(error.text);
      }
    );
  };

  const handleSendMessage = (email) => {
    setMessage('');
    setHandleMailAddress(email);
    setOpenMessageDialog(true);
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
    localStorage.setItem('maillist_rows_per_page', parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByLocation = (event) => {
    setFilterLocation(event.target.value);
  };

  const handleFilterByCoverage = (event) => {
    setFilterCoverage(event.target.value);
  };

  const handleFilterByBalance = (event) => {
    setFilterBalance(event.target.value);
  };

  const handleFilterByCredit = (event) => {
    setFilterCredit(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), {
    filterLocation,
    filterCoverage,
    filterBalance,
    filterCredit
  });

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Mail: List | Locals">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Mail List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'MailList' }]}
        />

        <Card>
          <MailListToolbar
            numSelected={selected.length}
            filterLocation={filterLocation}
            onFilterLocation={handleFilterByLocation}
            filterCoverage={filterCoverage}
            onFilterCoverage={handleFilterByCoverage}
            filterBalance={filterBalance}
            onFilterBalance={handleFilterByBalance}
            filterCredit={filterCredit}
            onFilterCredit={handleFilterByCredit}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <MailListHead
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
                      balance,
                      status,
                      isVerified,
                      coverage,
                      country,
                      online
                    } = row;
                    const isItemSelected = selected.indexOf(email) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, email)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            onClick={() => {
                              handleSendMessage(email);
                            }}
                          >
                            Send Message
                          </Button>
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
                        <SearchNotFound
                          searchQuery={`${filterLocation}, ${filterCoverage}, ${filterBalance}, ${filterCredit}`}
                        />
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
        {openMessageDialog && (
          <MailSendMessageDialog
            mailAddress={handleMailAddress}
            message={message}
            onMessage={handleMessage}
            onSend={(e) => handleSendMsg(e)}
            onClose={handleCloseSendMsgDlg}
          />
        )}
      </Container>
    </Page>
  );
}
