import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Characters from './Characters';

export default function Auction() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Characters" value="1" />
            <Tab label="Teams" value="2" />
            <Tab label="Auction View" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Characters />
        </TabPanel>
        <TabPanel value="2">
          Comming soon !
        </TabPanel>
        <TabPanel value="3">Comming soon !</TabPanel>
      </TabContext>
    </Box>
  )
}
