import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { Box, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { AlertContext } from '../context/AlertContext';
import teamsApi from '../api/teamsApi';
import charactersApi from '../api/charactersApi';
import { clearTeams, setTeams, updateTeam } from '../feature/teamsSlice';
import { clearCharacters, setCharacters, updateCharacters } from '../feature/charactersSlice';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { makeStyles } from '@mui/styles';
import "./styles.css";


const getRowId = (row) => {
  return row.id;
}

const useStyles = makeStyles((theme) => ({
  highlighted: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
  },
  lightHighlighted: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.contrastText,
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius, 
  },
  backgroundColorSet: {
    backgroundColor: theme.palette.grey[400],
  }
}));

export default function AuctionView() {
  const { appUser } = useContext(UserContext);
  const { OpenAlert } = useContext(AlertContext);
  const characters = useSelector((state) => state.character.characters);
  const teams = useSelector((state) => state.team.teams);

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [soldPoints, setSoldPoints] = useState(undefined);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSoldPoints(undefined);
    setSelectedTeam(null);
    setOpen(false);
  };

  const [selectedTeam, setSelectedTeam] = useState(null);

  const teamColumns = useMemo(() => [
    {
      field: '#',
      headerName: '#',
      valueGetter: (value, row) => {
        return teams.findIndex((t) => t.id == row.id) + 1;
      },
      width: 100 
    },
    {
      field: 'name',
      headerName: "Name",
      width: 150
    },
    {
      field: "currentBudget",
      headerName: "Current Budget",
      width: 150
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      getActions: (value) => {
        return [
          <GridActionsCellItem key={value.id} icon={selectedTeam && selectedTeam.id == value.id ? <RadioButtonCheckedIcon color='success' />: <RadioButtonUncheckedIcon color='error' />} onClick={() => {
            setSelectedTeam(teams.filter((t) => t.id == value.id)[0]);
          }} />
        ]
      }
    }
  ], [teams, selectedTeam]);

  const [index, setIndex] = useState(0);

  const confirmBid = () => {
    if (selectedTeam.currentBudget > soldPoints) {
      const team = JSON.parse(JSON.stringify(selectedTeam));
      team.characters = team.characters ? team.characters : [];
      const newCharacter = JSON.parse(JSON.stringify(characters[index]));
      newCharacter.sold = true;
      newCharacter.teamName = team.name;
      newCharacter.teamId = team.id;
      newCharacter.soldPoints = soldPoints;
      team.characters.push(newCharacter);
      team.currentBudget -= soldPoints;
      teamsApi.updateTeam(team).then((newTeam) => {
        dispatch(updateTeam(newTeam));
        charactersApi.updateCharacter(newCharacter).then((uCharacter) => {
          dispatch(updateCharacters(uCharacter));
          handleClose();
          OpenAlert('Success !', 'success');
        }).catch((err) => {
          OpenAlert(err.message);
        })
      }).catch((err) => {
        OpenAlert(err.message);
      })
    } else {
      OpenAlert('Team budget not enought !');
    }
  }

  const cancelBid = () => {
    let team = teams.filter((t) => t.id == characters[index].teamId);
    if(team.length) {
      team = team[0];
    } else {
      OpenAlert('Team not found !');
    }
    team = JSON.parse(JSON.stringify(team));
    team.characters = team.characters.filter((c) => c.id != characters[index].id);
    team.currentBudget += characters[index].soldPoints;
    teamsApi.updateTeam(team).then((newTeam) => {
      const character = JSON.parse(JSON.stringify(characters[index]));
      character.sold = false;
      character.teamId = null;
      character.teamName = null;
      character.soldPoints = 0;
      dispatch(updateTeam(newTeam));
      charactersApi.updateCharacter(character).then((newCharacter) => {
        dispatch(updateCharacters(newCharacter));
        OpenAlert('Bid cancelled !', 'success');
      }).catch((err) => {
        OpenAlert(err.message);
      })
    }).catch((err) => {
      OpenAlert(err.message);
    })
  }

  useEffect(() => {
    charactersApi.getCharacters().then((resp) => {
      dispatch(clearCharacters());
      dispatch(setCharacters(resp));
    });

    teamsApi.getTeams().then((resp) => {
      dispatch(clearTeams());
      dispatch(setTeams(resp));
    });
    
    return () => {
      dispatch(clearTeams());
      dispatch(clearCharacters());
    }
  }, [dispatch]);

  return (
    <Box>
    {
      appUser && characters.length ?
      <Box>
        <Grid container spacing={1} sx={{mt: "2rem"}}>
          <Grid item xs={4}>
            <Box sx={{ml: '2rem'}}>
              <Box>
                <Box sx={{fontSize: '4rem', my: "1rem"}}>
                  {characters[index].name}
                </Box>
                <Box sx={{fontSize: '2.5rem', my: "1rem"}} className={classes.lightHighlighted}>
                  {characters[index].sitcom}
                </Box>
                <Box sx={{fontSize: '2.5rem', my: "1rem"}}>
                  {characters[index].lang}
                </Box>
                <Box sx={{fontSize: '2.5rem', my: "1rem"}} className={classes.lightHighlighted}>
                  {characters[index].basePoints}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <img style={{maxHeight: "60vh", maxWidth: "30vw"}} src={characters[index].url} />
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: '2rem'}}>
              {
                characters[index].sold ? 
                <Typography variant='h5' className={classes.highlighted}>
                  Sold to {characters[index].teamName}
                </Typography>
                : null
              }
            </Box>
          </Grid>
          <Grid item xs={4}>

          </Grid>
        </Grid>
        <Box position={'absolute'} bottom={'2rem'} width={'100%'}>
          <Box sx={{display: "flex", justifyContent: "space-evenly"}}>
            <Button color='primary' variant='contained' size='large' onClick={() => setIndex(index-1)} disabled={index == 0}><ArrowBackIosIcon /></Button>
            <Button color='success' variant='outlined' size='large' onClick={() => handleClickOpen()} disabled={characters[index].sold}><CheckIcon /></Button>
            <Button color='secondary' variant='contained' size='large' onClick={() => {
              const ind = window.prompt('Enter character number: ');
              if (ind < characters.length + 1 && ind > 0) {
                setIndex(ind-1);
              } else {
                window.alert(`Number should be between 1-${characters.length}`);
              }
            }}><SearchIcon /></Button>
            <Button size='large' color='error' variant='outlined' onClick={() => cancelBid()} disabled={!characters[index].sold}><CloseIcon /></Button>
            <Button size='large' color='primary' variant='contained' onClick={() => setIndex(index+1)} disabled={index == characters.length - 1}><ArrowForwardIosIcon /></Button> 
          </Box>
        </Box>
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Bid
        </DialogTitle>
        <DialogContent>
          <DataGrid
            rows={teams}
            columns={teamColumns}
            getRowId={getRowId}
          />
          <Box sx={{justifyContent: 'center', display: 'flex', mt: '2rem'}}>
            {
              selectedTeam ? 
              <>
                <Box>
                  <Typography variant='h6'>
                    Selected Team: {selectedTeam.name}
                  </Typography>
                  <TextField sx={{mt: '1rem'}} label='Sold Points' id='price' type='number' onChange={(e) => setSoldPoints(+e.target.value)} />
                </Box>
              </>: null
            }
          </Box>
        </DialogContent>
        <DialogActions>        
            <Button sx={{}} variant='contained' color='secondary' onClick={() => handleClose()}>Close</Button>
            <Button variant='outlined' disabled={!selectedTeam || (selectedTeam && soldPoints > selectedTeam.currentBudget)} color='success' onClick={() => confirmBid()}>Confirm</Button>
        </DialogActions>
      </Dialog>
      </Box>
      :
      <Box>
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
            Not Authenticated !
        </Box>
      </Box>
    }
    </Box>
  )
}
