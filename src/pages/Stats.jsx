import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import teamsApi from '../api/teamsApi';
import { updateTeam } from '../feature/teamsSlice';
// import charactersApi from '../api/charactersApi';
// import { onUpdateCharacters } from '../feature/charactersSlice';

const getRowId = (row) => {
  return row.id;
}

export default function Stats() {
  const teams = useSelector((state) => state.team.teams);
  const characters = useSelector((state) => state.character.characters);

  const dispatch = useDispatch();

  const teamColmns = useMemo(() => [
    {
      field: "#",
      headerName: "#",
      valueGetter: (value, row) => {
        return teams.findIndex((i) => i.id == row.id);
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150
    },
    {
      field: 'Rule',
      headerName: "Rule",
      valueGetter: (value, row) => {
        return row.characters.length ?
        row.characters.reduce((p,c) => p + ((c.refPoints - c.soldPoints) + 100), 0) :
        NaN;
      },
      width: 150
    }
  ], [teams]);

  const characterColumns = useMemo(() => [
    {
      field: '#',
      headerName: '#',
      valueGetter: (value, row) => {
        return characters.findIndex((c) => c.id == row.id) + 1;
      }
    },
    {
      field: 'name',
      headerName: "Name",
      width: "150"
    },
    {
      field: 'basePoints',
      headerName: 'Base Points',
      width: 150,
    },
    {
      field: 'refPoints',
      headerName: 'Ref Points',
      width: 150,
    },
    {
      field: 'soldPoints',
      headerName: 'Sold Points',
      width: 150
    },
    {
      field: "Rule",
      headerName: 'Rule',
      width: 150,
      valueGetter: (value, row) => {
          return row.sold ? (row.refPoints - row.soldPoints) + 100 : NaN;
      }
    }
  ], [characters]);

  useEffect(() => {
    const unsubs = [];
    if (teams.length) {
      teams.forEach((t) => {
        const unsub = teamsApi.onTeamUpdate(t.id, (data) => {
          dispatch(updateTeam(data));
        });
        unsubs.push(unsub);
      });
    }

    return () => {
      unsubs.forEach((u) => u());
    }
  }, [dispatch, teams]);

  // useEffect(() => {
  //   let unsub = undefined;
  //   if(characters.length) {
  //     unsub = charactersApi.onCharactersUpdate((data) => {
  //       dispatch(onUpdateCharacters(data));
  //     });
  //   }

  //   return () => {
  //     if(unsub) unsub();
  //   }
  // }, [characters, dispatch]);

  return (
    <Grid container>
      <Grid item xs={8}>
      {
        teams.length ? 
        teams.map((t) => (
          <Card key={t.key} sx={{my: "0.5rem", p: "1rem"}}>
            <Box>
              <Typography variant='h5'>
                {t.name}
              </Typography>
              <Typography color={'red'}>
                Remaining Budget : {t.currentBudget}
              </Typography>
            </Box>
            <CardContent>
              <Box sx={{display: "flex", justifyContent: "center"}}>
                <DataGrid 
                  rows={t.characters}
                  columns={characterColumns}
                  getRowId={getRowId}
                />
              </Box>
              <Box display={'flex'} justifyContent={'space-evenly'} sx={{mt: "0.5rem"}}>
                <Typography>
                  Rule Avg : {t.characters.reduce((p,c) => p + ((c.refPoints - c.soldPoints) + 100), 0) / t.characters.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )) : null
      }
      </Grid>
      <Grid item xs={1}>

      </Grid>
      <Grid item xs={3}>
        {/* <Box display={'flex'} justifyContent={'space-evenly'}>
          <Card>
            <CardContent>
              <Box>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Total Players
              </Typography>
              <Typography variant="h5" component="div" align='center'>
                {characters.length}
              </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                Sold Players
              </Typography>
              <Typography variant="h5" component="div" align='center'>
                {characters.filter((c) => c.sold == true).length}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Remaining Player
              </Typography>
              <Typography variant="h5" component="div" align='center'>
                {characters.filter((c) => c.sold == false).length}
              </Typography>
            </CardContent>
          </Card>
        </Box> */}
        <Box sx={{mt: "1rem"}} display={'flex'} justifyContent={'center'}>
          <DataGrid
           columns={teamColmns}
           rows={teams}
           getRowId={getRowId}
           />
        </Box>
      </Grid>
    </Grid>
  )
}
