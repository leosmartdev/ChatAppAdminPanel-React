import React from 'react';
// material
import { Container, Grid, Box, TextField, Typography } from '@material-ui/core';
import { format } from 'date-fns';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import {
  AppWelcome,
  AppWidgets1,
  AppWidgets2,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppTotalDownloads,
  AppTotalInstalled,
  AppCurrentDownload,
  AppTotalActiveUsers,
  AppTotalRegisterUsers,
  AppTotalOnlineVisitors,
  AppTotalChart,
  AppTopInstalledCountries
} from '../../components/_dashboard/general-app';
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = React.useState(0);
  const [totalOnlineVisitors, setTotalOnlineVisitors] = React.useState(0);
  const [totalInstalled, setTotalInstalled] = React.useState(0);
  const [totalDownloads, setTotalDownloads] = React.useState(0);
  const [selectedDate, setSelectedDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const { user } = useAuth();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  React.useEffect(() => {
    async function getAnalytics() {
      if (selectedDate) {
        const { data } = await axios.get(`/analytics/logs/${selectedDate}`);
        if (data.error) {
          console.log(data);
          setTotalRegisteredUsers(0);
          setTotalOnlineVisitors(0);
          return;
        }
        // setTotalUsers(data.logs.active_user_num);
        setTotalRegisteredUsers(data.logs.register_user_num);
        setTotalOnlineVisitors(data.logs.online_user_num);
        // setTotalInstalled(data.statistics.installs);
        // setTotalDownloads(data.statistics.maxInstalls);
      }
    }
    getAnalytics();
  }, [selectedDate]);

  return (
    <Page title="App | Locals">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <TextField
              name="date"
              label="Date"
              InputLabelProps={{ shrink: true, required: true }}
              type="date"
              onChange={handleDateChange}
              defaultValue={selectedDate}
            />
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <AppTotalActiveUsers totalUsers={totalUsers} />
          </Grid> */}

          <Grid item xs={12} md={4}>
            <AppTotalOnlineVisitors totalUsers={totalOnlineVisitors} />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppTotalRegisterUsers totalUsers={totalRegisteredUsers} />
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <AppTotalInstalled totalInstalled={totalInstalled} />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <AppTotalDownloads totalDownloads={totalDownloads} />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <AppTotalChart chartDate={selectedDate} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
