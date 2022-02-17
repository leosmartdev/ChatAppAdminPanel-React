import { merge } from 'lodash';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import moment from 'moment';
import { BaseOptionChart } from '../../charts';
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

// const CHART_DATA = [
//   {
//     category: 'statistics',
//     data: [
//       // { name: 'Active Users', data: [0, 0, 0, 0, 0, 13, 16, 17, 26, 40] },
//       { name: 'Online Users', data: [0, 0, 0, 0, 22, 45, 42, 12, 12, 5] },
//       { name: 'Registered Users', data: [0, 0, 0, 0, 1, 19, 20, 24, 36, 51] }
//       // { name: 'App Installed', data: [0, 10, 21, 35, 40, 49, 62, 69, 91, 102] },
//       // { name: 'App Download', data: [0, 12, 25, 38, 42, 58, 64, 72, 97, 120] }
//     ]
//   }
// ];

AppTotalChart.propTypes = {
  chartDate: PropTypes.string
};

export default function AppTotalChart({ chartDate }) {
  const [seriesData, setSeriesData] = useState('statistics');
  const [dateCount, setDateCount] = useState(10);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function getAnalytics() {
      if (chartDate) {
        const toDateObj = new Date(chartDate);
        const fromDateObj = new Date(toDateObj.getTime() - (dateCount - 1) * 1000 * 60 * 60 * 24);
        const fromDate = moment(fromDateObj).format('YYYY-MM-DD');
        const toDate = chartDate;
        const { data } = await axios.get(`/analytics/logs/${fromDate}/${toDate}`);
        if (data.error) {
          const zeroValueArr = [];
          for (let i = 0; i < dateCount; i += 1) {
            zeroValueArr.push(0);
          }
          const CHART_DATA = [
            {
              category: 'statistics',
              data: [
                { name: 'Online Users', data: zeroValueArr },
                { name: 'Registered Users', data: zeroValueArr }
              ]
            }
          ];
          setChartData(CHART_DATA);
        } else {
          const { logs } = data;
          const onlineUserArr = [];
          const registerUserArr = [];
          for (let i = 0; i < dateCount; i += 1) {
            onlineUserArr.push(0);
            registerUserArr.push(0);
          }
          const lastDateLimit = new Date(toDateObj.getTime() + 1000 * 60 * 60 * 24);
          for (let i = 0; i < logs.length; i += 1) {
            const logDate = new Date(logs[i].date);
            console.log(logs[i]);
            if (logDate >= fromDateObj && logDate < lastDateLimit) {
              const index = Math.floor((logDate.getTime() - fromDateObj.getTime()) / (1000 * 60 * 60 * 24));
              onlineUserArr[index] = logs[i].online_user_num;
              registerUserArr[index] = logs[i].register_user_num;
            }
          }
          const CHART_DATA = [
            {
              category: 'statistics',
              data: [
                { name: 'Online Users', data: onlineUserArr },
                { name: 'Registered Users', data: registerUserArr }
              ]
            }
          ];
          setChartData(CHART_DATA);
        }
      }
    }
    getAnalytics();
  }, [chartDate]);

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const daysList = (num) => {
    const date = new Date(chartDate);
    const datesCollection = [];

    for (let i = 0; i < num; i += 1) {
      const newDate = new Date(date.getTime() - i * 1000 * 60 * 60 * 24);
      const dateFromatStr = moment(newDate).format('YYYY MMM DD');
      // datesCollection.unshift(`${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`);
      datesCollection.unshift(dateFromatStr);
    }

    return datesCollection;
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: daysList(dateCount)
    }
  });

  return (
    <Card>
      <CardHeader
        title="Statistics Chart"
        subheader="Growing Fast"
        // action={
        //   <TextField
        //     select
        //     fullWidth
        //     value={seriesData}
        //     SelectProps={{ native: true }}
        //     onChange={handleChangeSeriesData}
        //     sx={{
        //       '& fieldset': { border: '0 !important' },
        //       '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
        //       '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
        //       '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
        //     }}
        //   >
        //     {CHART_DATA.map((option) => (
        //       <option key={option.category} value={option.category}>
        //         {option.category}
        //       </option>
        //     ))}
        //   </TextField>
        // }
      />

      {chartData.map((item) => (
        <Box key={item.category} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.category === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
