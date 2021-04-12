import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Copyright from '../common/copyright'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import SignIn from '../login/signin';
import Logout from '../login/logout';
import Movies from '../movies'
import MovieForm from '../movies/crud/movie_form'
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import CustomizedSnackbars from './alerter';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
}));

function Hero() {
    const classes = useStyles();
    return (
        <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Movies List
            </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    Something short and leading about the collection below—its contents, the creator, etc.
                    Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                    entirely.
            </Typography>
                <div className={classes.heroButtons}>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Button variant="contained" color="primary">
                                Main call to action
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" color="primary">
                                Secondary action
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    )
}

function TopBar(props) {
    const classes = useStyles();
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")

    let logout_login_button = <Link to="login" style={{ color: "#FFFFFF", textDecoration: "none", float: "right"}}>Login</Link>
    if (props.loggedIn == "true") {
        logout_login_button = <Link to="logout" style={{ color: "#FFFFFF", textDecoration: "none", float: "right"}}>Logout</Link>
    }
    return (
        <AppBar position="relative">
            <CustomizedSnackbars open={openAlert} message={alertMessage}/>
            <Toolbar>
                <CameraIcon className={classes.icon} />
                <Typography variant="h6" color="inherit" noWrap style={{width: "100%"}}>
                    Movies List
                </Typography>
                <Typography variant="h6" color="inherit" noWrap style={{width: "100%", color: "white"}}>
                    {logout_login_button}
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                Footer
            </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Something here to give the footer a purpose!
            </Typography>
            <Copyright />
        </footer>
    )
}

function check_user_logged_in() {
    let data = localStorage.getItem('logged_in') || "false";
    // console.log(`State of loggedin from localstorage: ${localStorage.getItem('logged_in')}`)
    return data
}

function PossibleRoutes() {
    let [logged_in, setloggedIn] = useState("false")
    useEffect(() => {
        let loggin_state = check_user_logged_in()
        console.log(`State of loggedin from State: ${loggin_state}`)
        setloggedIn(loggin_state)
    }, []);
    return (
        <Router>
            <React.Fragment>
                <CssBaseline />
                <TopBar loggedIn={logged_in} />

                {/* <div> */}
                {/* <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                            <li>
                                <Link to="/users">Users</Link>
                            </li>
                        </ul>
                    </nav> */}

                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/login">
                        <SignIn />
                    </Route>
                    <Route path="/logout">
                        <Logout />
                    </Route>
                    <Route path="/movies/create" child={<MovieForm />}>
                        <MovieForm />
                    </Route>
                    <Route path="/movies/:movie_id" child={<MovieForm />}>
                        <MovieForm />
                    </Route>
                    <Route path="/movies">
                        <Movies />
                    </Route>
                    <Route path="/">
                        <Movies />
                    </Route>
                </Switch>
                {/* </div> */}
                <Footer />
            </React.Fragment>
        </Router>
    );
}


function ResponsiveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgreeAndClose = () => {
    setOpen(false);
    props.customFunction(id)
  };

  return (
    <div>
      <Button color="primary" onClick={() => {handleClickOpen(props.id)}}>
        {props.button_text}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleAgreeAndClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export { TopBar, Footer, PossibleRoutes, ResponsiveDialog };
