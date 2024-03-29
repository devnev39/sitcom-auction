import React, { useContext, useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import charactersApi from '../api/charactersApi';
import { clearCharacters, removeCharacter, setCharacters, updateCharacters } from '../feature/charactersSlice';
import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid';
import CreateIcon from '@mui/icons-material/Create';
import { Formik } from 'formik';
import dayjs from 'dayjs';
import * as Yup from "yup";
import { AlertContext } from '../context/AlertContext';
import EditIcon from '@mui/icons-material/Edit';
import { UserContext } from '../context/UserContext';

const getRowId = (row) => {
  return row.id;
}

export default function Characters() {
  const characters = useSelector((state) => state.character.characters);
  const loaded = useSelector((state) => state.character.loaded);

  const { appUser } = useContext(UserContext);

  const [initialState, setInitialState] = useState({
    name: "",
    sitcom: "",
    basePoints: undefined,
    refPoints: undefined,
    url: "",
    lang: undefined,
  });

  const resetInitialState = () => {
    setInitialState({name: "",
    sitcom: "",
    basePoints: undefined,
    refPoints: undefined,
    url: "",
    lang: undefined,});
  }

  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { OpenAlert } = useContext(AlertContext);

  const columns = useMemo(() => [
    {
      field: '#',
      valueGetter: (value, row) => {
        return characters.findIndex((r) => r.id == row.id) + 1
      },
      width: 100
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 300
    },
    {
      field: 'sitcom',
      headerName: 'Sitcom',
      width: 200
    },
    {
      field: 'lang',
      headerName: 'Language',
      width: 100
    },
    {
      field: 'basePoints',
      headerName: 'Base Points',
      width: 150
    },
    {
      field: 'refPoints',
      headerName: 'Ref Points',
      width: 150
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (value) => {
        return dayjs(value).toDate().toLocaleString()
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: (value) => {
        return [
          <GridActionsCellItem onClick={() => editCharacter(value.id)} key={value.id} icon={<EditIcon color='info' />} />,
          <GridActionsCellItem key={value.id} onClick={() => deleteCharacter(value.id)} icon={<GridDeleteIcon color='error' />} />
        ]
      }
    }
  ], [characters]);

  const editCharacter = (id) => {
    const character = characters.findIndex((c) => c.id == id);
    setInitialState(characters[character]);
    setIsUpdating(true);
    handleOpen();
  }

  const deleteCharacter = (id) => {
    if (!window.confirm('Confirm to delete character ?')) return;
    charactersApi.deleteCharacter(id).then(() => {
      OpenAlert('Character deleted !', 'info');
      dispatch(removeCharacter(id));
    }).catch((err) => {
      OpenAlert(err.message, 'error');
    });
  }

  const updateCharacter = (values, setSubmitting) => {
    setSubmitting(true);
    values.updatedAt = dayjs().toISOString();
    charactersApi.updateCharacter(values).then((resp) => {
      dispatch(updateCharacters(resp));
      OpenAlert('Character updated !', 'info');
    }).catch((err) => {
      OpenAlert(err.message, 'error');
    }).finally(() => {
      setSubmitting(false);
      setIsUpdating(false);
      resetInitialState();
      handleClose();
    });
  }

  const createNewCharacter = (values, setSubmitting) => {
    setSubmitting(true);
    values.createdAt = dayjs().toISOString();
    charactersApi.createCharacter(values).then((resp) => {
      dispatch(setCharacters(resp));
      setSubmitting(false);
      OpenAlert('Character created !', 'success');
      handleClose();
    }).catch((err) => {
      OpenAlert(err.message, 'error');
      setSubmitting(false);
      console.log(err);
    });
  }

  const formSubmitted = (values, setSubmitting) => {
    if (isUpdating) {
      updateCharacter(values, setSubmitting);
    } else {
      createNewCharacter(values, setSubmitting);
    }
  }

  useEffect(() => {
    if (loaded) return;
    if (!appUser) {
      OpenAlert('Need to login to view this page !');
      return;
    }
    charactersApi.getCharacters().then((data) => {
      dispatch(clearCharacters());
      dispatch(setCharacters(data));
    }).catch((err) => {
      OpenAlert(err, 'error');
    });
  }, []);

  return (
    <>
    {
      appUser ? 
      <>
        <Card sx={{mt: "2rem"}}>
          <Box sx={{display: "flex", justifyContent: "center"}}>
            <Typography variant='h4'>
              Characters
            </Typography>
          </Box>
          <CardContent>
            <DataGrid
              columns={columns}
              rows={characters}
              getRowId={getRowId}
            />
            <Box sx={{display: "flex", justifyContent: "center", mt: "2rem"}}>
              <Button variant='outlined' onClick={() => handleOpen()} startIcon={<CreateIcon />}>Add</Button>
            </Box>
          </CardContent>
        </Card>
        <Dialog 
          open={open}
          onClose={() => handleClose()}
          fullWidth
        >
          <DialogTitle>
            {/* <Typography variant='h3'> */}
              Create Character
            {/* </Typography> */}
          </DialogTitle>
          <DialogContent>
            <Formik enableReinitialize initialValues={initialState} validationSchema={Yup.object({
                    name: Yup.string().required('Required'),
                    sitcom: Yup.string().required('Required'),
                    basePoints: Yup.number().required('Required'),
                    refPoints: Yup.number().required('Required'),
                    lang: Yup.string().required(),
                    url: Yup.string().required('Required')
                  })} onSubmit={(values, {setSubmitting}) => formSubmitted(values, setSubmitting)}>
                    {(formik) => (
                      <form id='characterForm' onSubmit={formik.handleSubmit}>
                        <Box sx={{py: '0.5rem'}}>
                          <TextField fullWidth size='small' label='Name' error={formik.touched.name && formik.errors.name} id='name' {...formik.getFieldProps('name')} />
                        </Box>
                        <Box sx={{py: '0.5rem'}}>
                          <TextField fullWidth size='small' label='SitCom' error={formik.touched.sitcom && formik.errors.sitcom} id='sitcom' {...formik.getFieldProps('sitcom')} />
                        </Box>
                        
                        <Box sx={{py: '0.5rem'}}>
                          <TextField type='number' fullWidth size='small' label='Base Points' error={formik.touched.basePoints && formik.errors.basePoints} id='basePoints' {...formik.getFieldProps('basePoints')} />
                        </Box>
                        
                        <Box sx={{py: '0.5rem'}}>
                          <TextField type='number' fullWidth size='small' label='Ref Points' error={formik.touched.refPoints && formik.errors.refPoints} id='refPoints' {...formik.getFieldProps('refPoints')} />
                        </Box>
                        
                        <Box sx={{py: '0.5rem'}}>
                          <TextField fullWidth size='small' label='Lang' error={formik.touched.lang && formik.errors.lang} id='lang' {...formik.getFieldProps('lang')} />
                        </Box>
                        
                        <Box sx={{py: '0.5rem'}}>
                          <TextField fullWidth size='small' label='Url' error={formik.touched.url && formik.errors.url} id='url' {...formik.getFieldProps('url')} />
                          <Box sx={{display: "flex", justifyContent: "center", mt: "2rem"}}>
                            <img style={{width: '10vw'}} src={formik.values.url} />
                          </Box>
                        </Box>
                        
                      </form>
                    )}
                  </Formik>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='secondary' variant='contained'>Close</Button>
            <Button form='characterForm' type='submit' color='success' variant='outlined'>{isUpdating ? 'Update' : 'Create'}</Button>
          </DialogActions>
        </Dialog>
      </>
      : null
    }
    </>
  )
}
