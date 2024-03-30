import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import teamsApi from '../api/teamsApi';
import { updateTeam } from '../feature/teamsSlice';

const getRowId = (row) => {
  return row.id;
}

export default function Stats() {
  const teams = useSelector((state) => state.team.teams);
  const characters = useSelector((state) => state.character.characters);

  const dispatch = useDispatch();

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
      field: 'soldPoints',
      headerName: 'Sold Points',
      width: 150
    }
  ], [teams]);

  useEffect(() => {
    const unsubs = [];
    if (teams.length) {
      teams.forEach((t) => {
        const unsub = teamsApi.onTeamUpdate(t.id, (data) => {
          console.log(data);
          dispatch(updateTeam(data));
        });
        unsubs.push(unsub);
      });
    }

    return () => {
      unsubs.forEach((u) => u());
    }
  }, []);

  return (
    <Grid container gap={1}>
      <Grid item xs={7}>
      {
        teams.length ? 
        teams.map((t) => (
          <Card key={t.key} sx={{my: "0.5rem", p: "1rem"}}>
            <Box>
              <Typography variant='h5'>
                {t.name}
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
            </CardContent>
          </Card>
        )) : null
      }
      </Grid>
    </Grid>
  )
}
