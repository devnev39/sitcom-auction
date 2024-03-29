import React, { useContext, useEffect, useMemo, useState } from 'react'
import { UserContext } from '../context/UserContext'
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
  } from '@mui/material'
import { nanoid } from 'nanoid'
import CreateIcon from '@mui/icons-material/Create'
import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { AlertContext } from '../context/AlertContext';
import teamsApi from '../api/teamsApi';
import { clearTeams, removeTeam, setTeams, updateTeam } from '../feature/teamsSlice';
import EditIcon from '@mui/icons-material/Edit';
import { Formik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs';

const getRowId = (row) => {
    return row.id;
}

export default function Team () {
    const {appUser} = useContext(UserContext);

    const dispatch = useDispatch();
    const {OpenAlert} = useContext(AlertContext);

    const teams = useSelector((state) => state.team.teams);
    const [isUpdating, setIsUpdating] = useState(false);
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false);
        resetInitialState();
        setIsUpdating(false);
    }

    const [initialState, setInitialState] = useState({
        name :"",
        budget: undefined,
    });

    const resetInitialState = () => {
        setInitialState({
            name :"",
            budget: undefined, 
        });
    }

    const columns = useMemo(() => [
        {
            field: '#',
            headerName: "#",
            valueGetter: (value, row) => {
                return teams.findIndex((r) => r.id == row.id) + 1
            },
        },
        {
            field: "name",
            headerName: "Name",
            width: 200
        },
        {
            field: "key",
            headerName: "Key",
            width: 200
        },
        {
            field: "budget",
            headerName: "Budget",
            width: 200
        },
        {
            field: "currentBudget",
            headerName: "Current Budget",
            width: 200
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: "Actions",
            getActions: (value) => {
                return [
                    <GridActionsCellItem color='info' onClick={() => updateTeamClicked(value.id)} key={value.id} icon={<EditIcon />} />,
                    <GridActionsCellItem color='error' onClick={() => deleteTeam(value.id)} key={value.id} icon={<GridDeleteIcon />} />
                ]
            }
        }
    ],[teams]);

    const updateTeamClicked = (id) => {
        const ind = teams.findIndex((t) => t.id == id);
        setIsUpdating(true);
        setInitialState(teams[ind]);
        handleOpen();
    }

    const deleteTeam = (id) => {
        if (!window.confirm('Confirm to delete team ?')) return;
        teamsApi.deleteTeam(id).then(() => {
            dispatch(removeTeam(id));
            OpenAlert('Team removed !', 'success');
        }).catch((err) => {
            OpenAlert(err.message);
        })
    }

    const createNewTeam = (values, setSubmitting) => {
        setSubmitting(true);
        values.createdAt = dayjs().toISOString();
        values.currentBudget = values.budget;
        values.key = nanoid(5);
        teamsApi.createTeam(values).then((resp) => {
            dispatch(setTeams(resp));
            OpenAlert('Team created !', 'success');
            handleClose();
            setSubmitting(false);
        }).catch((err) => {
            OpenAlert(err.message);
            setSubmitting(false);
        });
    }

    const updateExistingTeam = (values, setSubmitting) => {
        setSubmitting(true);
        values.updatedAt = dayjs().toISOString();
        teamsApi.updateTeam(values).then((resp) => {
            dispatch(updateTeam(resp));
            OpenAlert('Team updated !', 'success');
            setSubmitting(false);
            handleClose();
        }).catch((err) => {
            OpenAlert(err.message);
            setSubmitting(false);
        });
    }

    const formSubmitted = (values, setSubmitting) => {
        if (isUpdating) {
            updateExistingTeam(values, setSubmitting);
        } else {
            createNewTeam(values, setSubmitting);
        }
    }

    useEffect(() => {
        teamsApi.getTeams().then((resp) => {
            dispatch(clearTeams());
            dispatch(setTeams(resp));
        }).catch((err) => {
            OpenAlert(err.message);
        });
    }, [OpenAlert, dispatch]);

    return (
        <>
        {
            appUser ? 
            <>
                <Card sx={{mt: "2rem"}}>
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <Typography variant='h4'>
                            Teams
                        </Typography>
                    </Box>
                    <CardContent>
                        <DataGrid 
                         rows={teams}
                         columns={columns}
                         getRowId={getRowId}
                        />
                        <Box sx={{display: "flex", justifyContent: "center"}}>
                            <Button
                            variant='outlined'
                            onClick={() => handleOpen()}
                            startIcon={<CreateIcon />}
                        >
                            Add
                        </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Dialog open={open} onClose={() => handleClose()} fullWidth>
                    <DialogTitle>
                        Create Team
                    </DialogTitle>
                    <DialogContent>
                    <Formik
                        initialValues={initialState}
                        enableReinitialize
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            budget: Yup.number().required('Required')
                        })}
                        onSubmit={(values, { setSubmitting }) =>
                        formSubmitted(values, setSubmitting)
                        }
                    >
                        {formik => (
                        <form id='teamForm' onSubmit={formik.handleSubmit}>
                            <Box sx={{ py: '0.5rem' }}>
                            <TextField
                                sx={{my: "0.5rem"}}
                                fullWidth
                                size='small'
                                label='Name'
                                error={formik.touched.name && formik.errors.name}
                                id='name'
                                {...formik.getFieldProps('name')}
                            />
                            <TextField
                                sx={{my: "0.5rem"}}
                                fullWidth
                                type='number'
                                size='small'
                                label='Budget'
                                error={formik.touched.budget && formik.errors.budget}
                                id='budget'
                                {...formik.getFieldProps('budget')}
                            />
                            </Box>
                        </form>
                        )}
                    </Formik>
                    </DialogContent>
                    <DialogActions>
                    <Button
                        onClick={handleClose}
                        color='secondary'
                        variant='contained'
                    >
                        Close
                    </Button>
                    <Button
                        form='teamForm'
                        type='submit'
                        color='success'
                        variant='outlined'
                    >
                        {isUpdating ? 'Update' : 'Create'}
                    </Button>
                    </DialogActions>
                </Dialog>
            </> : null
        }

        </>
    )
}
