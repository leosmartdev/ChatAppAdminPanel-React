import { merge } from 'lodash';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box, TextField } from '@material-ui/core';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    category: 'statistics',
    data: [
      { name: 'Active Users', data: [0, 0, 0, 0, 0, 13, 16, 17, 26, 40] },
      { name: 'Registered Users', data: [0, 0, 0, 0, 1, 19, 20, 24, 36, 51] },
      { name: 'Online Visitors', data: [0, 0, 0, 0, 22, 45, 42, 12, 12, 5] },
      { name: 'App Installed', data: [0, 10, 21, 35, 40, 49, 62, 69, 91, 102] },
      { name: 'App Download', data: [0, 12, 25, 38, 42, 58, 64, 72, 97, 120] }
    ]
  }
];

export default function AppTotalChart() {
  const [seriesData, setSeriesData] = useState('statistics');

  const handleChangeSeriesData = (event) => {
    setSeriesData(Number(event.target.value));
  };

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories: [
        '2021 Oct 26',
        '2021 Oct 27',
        '2021 Oct 28',
        '2021 Oct 29',
        '2021 Oct 30',
        '2021 Oct 31',
        '2021 Nov 1',
        '2021 Nov 2',
        '2021 Nov 3',
        '2021 Nov 4'
      ]
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

      {CHART_DATA.map((item) => (
        <Box key={item.category} sx={{ mt: 3, mx: 3 }} dir="ltr">
          {item.category === seriesData && (
            <ReactApexChart type="line" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </Card>
  );
}
