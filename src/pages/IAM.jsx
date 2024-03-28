import { DataGrid, GridActionsCellItem, GridDeleteIcon } from '@mui/x-data-grid'
import React, { useContext, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CreateIcon from '@mui/icons-material/Create'
import { Formik } from 'formik'
import * as Yup from 'yup'
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
import usersApi from '../api/usersApi'
import dayjs from 'dayjs'
import { AlertContext } from '../context/AlertContext'
import { clearUsers, removeUser, setUsers } from '../feature/usersSlice'
import { UserContext } from '../context/UserContext'

const getRowId = row => {
  return row.email
}

export default function IAM () {
  const users = useSelector(state => state.user.users)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { appUser } = useContext(UserContext)

  const dispatch = useDispatch()

  const { OpenAlert } = useContext(AlertContext)

  const addNewUser = (values, setSubmitting) => {
    setSubmitting(true)
    values.createdAt = dayjs().toISOString()
    usersApi
      .createUser(values)
      .then(resp => {
        dispatch(setUsers(resp))
        OpenAlert('User created !', 'success')
        setSubmitting(false)
        handleClose()
      })
      .catch(err => {
        OpenAlert(err.message)
        setSubmitting(false)
      })
  }

  const deleteUser = id => {
    usersApi
      .deleteUser(id)
      .then(() => {
        dispatch(removeUser(id))
      })
      .catch(err => {
        OpenAlert(err.message)
        console.log(err)
      })
  }

  const columns = useMemo(
    () => [
      {
        field: '#',
        headerName: '#',
        valueGetter: (value, row) => {
          return users.findIndex(r => r.email == row.email) + 1
        }
      },
      {
        field: 'email',
        headerName: 'Mail',
        width: 300
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        getActions: value => {
          return [
            <GridActionsCellItem
              onClick={() => deleteUser(value.email)}
              icon={<GridDeleteIcon color='error' />}
              key={value.id}
            />
          ]
        }
      }
    ],
    [users]
  )

  useEffect(() => {
    usersApi.getUsers().then(resp => {
      dispatch(clearUsers())
      dispatch(setUsers(resp))
    })

    return () => {
      dispatch(clearUsers())
    }
  }, [dispatch])

  return (
    <>
      {appUser && appUser.isRootUser ? (
        <>
          <Box sx={{mt: "2rem"}}>
            <Card>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h4'>Users</Typography>
              </Box>
              <CardContent sx={{justifyContent: 'center', display: "flex"}}>
                <Box sx={{ width: '50vw', display: "grid" }}>
                    <DataGrid
                      rows={users}
                      columns={columns}
                      getRowId={getRowId}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: '2rem'
                      }}
                    >
                      <Button
                        variant='outlined'
                        onClick={() => handleOpen()}
                        startIcon={<CreateIcon />}
                      >
                        Add
                      </Button>
                    </Box>
                  </Box>
              </CardContent>
            </Card>
          </Box>
          <Dialog open={open} onClose={() => handleClose()} fullWidth>
            <DialogTitle>
              {/* <Typography variant='h3'> */}
              Create User
              {/* </Typography> */}
            </DialogTitle>
            <DialogContent>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={Yup.object({
                  email: Yup.string().required('Required')
                })}
                onSubmit={(values, { setSubmitting }) =>
                  addNewUser(values, setSubmitting)
                }
              >
                {formik => (
                  <form id='userForm' onSubmit={formik.handleSubmit}>
                    <Box sx={{ py: '0.5rem' }}>
                      <TextField
                        fullWidth
                        size='small'
                        label='Email'
                        error={formik.touched.email && formik.errors.email}
                        id='email'
                        {...formik.getFieldProps('email')}
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
                form='userForm'
                type='submit'
                color='success'
                variant='outlined'
              >
                Create
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Typography variant='h3'>Unauthorised Access !</Typography>
        </Box>
      )}
    </>
  )
}
