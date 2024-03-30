import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Characters from './Characters';
import Team from './Team';
import { useDispatch } from 'react-redux';
import { clearTeams, setTeams } from '../feature/teamsSlice';
import { clearCharacters, setCharacters } from '../feature/charactersSlice';
import teamsApi from '../api/teamsApi';
import charactersApi from '../api/charactersApi';
import { AlertContext } from '../context/AlertContext';
import Stats from './Stats';

export default function Auction() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const {OpenAlert} = React.useContext(AlertContext);

  const dispatch = useDispatch();

  React.useEffect(() => {
    charactersApi.getCharacters().then((resp) => {
      dispatch(clearCharacters());
      dispatch(setCharacters(resp));
    }).catch((err) => {
      OpenAlert(err.message);
      console.log(err);
    });

    teamsApi.getTeams().then((resp) => {
      dispatch(clearTeams());
      dispatch(setTeams(resp));
    }).catch((err) => {
      OpenAlert(err.message);
      console.log(err);
    });
    
    return () => {
      dispatch(clearTeams());
      dispatch(clearCharacters());
    }
  }, [OpenAlert, dispatch]);

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Characters" value="1" />
            <Tab label="Teams" value="2" />
            <Tab label="Stats" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Characters />
        </TabPanel>
        <TabPanel value="2">
          <Team />
        </TabPanel>
        <TabPanel value="3">
          <Stats />
        </TabPanel>
      </TabContext>
    </Box>
  )
}
