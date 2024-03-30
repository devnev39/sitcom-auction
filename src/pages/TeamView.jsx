import { Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import teamsApi from "../api/teamsApi";
import { setCurrentTeam } from "../feature/teamsSlice";
import { AlertContext } from "../context/AlertContext";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from '@mui/styles';

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

export default function TeamView() {
    // Get the team with key
    const [teamKey, setTeamKey] = useState(null);
    const currentTeam = useSelector((state) => state.team.currentTeam);
    const dispatch = useDispatch();
    const {OpenAlert} = useContext(AlertContext);

    const classes = useStyles();
    
    const characterColumns = useMemo(() => [
        {
          field: '#',
          headerName: '#',
          valueGetter: (value, row) => {
            return currentTeam.characters.findIndex((c) => c.id == row.id) + 1;
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
      ], [currentTeam]);

    const fetchTeamWithKey = () => {
        let unsub;
        teamsApi.getTeam(teamKey).then((resp) => {
            dispatch(setCurrentTeam(resp));
            OpenAlert('Team found !', 'success');
            unsub = teamsApi.onTeamUpdate(resp.id, (data) => {
                dispatch(setCurrentTeam(data));
            });
        }).catch((err) => {
            OpenAlert(err.message);
        })

        return () => {
            if (unsub) unsub();
        }
    }

    return (
        <Box>
            {
                Object.keys(currentTeam).length ? 
                <Card sx={{mt: "2rem", p: "1rem"}}>
                    <Box display={'flex'} justifyContent={'center'}>
                        <Typography variant="h3">
                            Fiction Fusion - 2024
                        </Typography>
                    </Box>
                    <Box sx={{mt: "2rem"}} display={'flex'} justifyContent={'center'}>
                        <Typography variant="h4">
                            {currentTeam.name}
                        </Typography>
                    </Box>
                    <CardContent>
                        <Box display={'flex'} justifyContent={'center'}>
                            <Box>
                                <Box>
                                    <Typography variant="h5" className={classes.lightHighlighted}>
                                        Current Budget: {currentTeam.currentBudget}
                                    </Typography>
                                </Box>
                            <Box sx={{mt: "1rem"}}>                            
                                <DataGrid
                                rows={currentTeam.characters ? currentTeam.characters : []}
                                columns={characterColumns}
                                getRowId={getRowId}
                                />
                            </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>:
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100vh'}>
                    <Box>
                        <Box>
                            <TextField label={'Team Key'} onChange={(e) => setTeamKey(e.target.value)} />
                        </Box>
                        <Box display={'flex'} justifyContent={'center'} marginTop={'2rem'}>
                            <Button variant="outlined" onClick={() => fetchTeamWithKey()}>Submit</Button>    
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    )
}
