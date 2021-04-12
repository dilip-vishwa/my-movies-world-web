import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";
import Link from '@material-ui/core/Link';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ResponsiveDialog } from '../../common/page_element';
import CustomizedSnackbars from '../../common/alerter';
import endpoint from '../../../config';

// function MyComponent() {
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   return <Dialog fullScreen={fullScreen} />
// }

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
    link: {
        color: "#FFFFFF",
        textDecoration: "none"
    }
}));

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


function MoviesList() {
    const history = useHistory();
    function onClickFilterGenre(e) {
        console.log(e)
        history.push(`/movies?genre=${e}`);
    }

    const classes = useStyles();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openAlert, setOpenAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    let isLoggedIn = localStorage.getItem('logged_in') == "true"? true : false;
    console.log(localStorage.getItem('logged_in'), isLoggedIn)
    const [loggedIn, setLoggedIn] = useState(isLoggedIn)

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        const fetchOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
            // body: JSON.stringify(post_json_data),
        }
        fetch(`${endpoint.endpoint}/movies?page=1&limit=12`, fetchOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    if (result['result'] === 'Unauthorized') {
                        history.push(`/login`);
                    } else {
                        setIsLoaded(true);
                        setItems(result['result']);
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        // return (
        // <ul>
        //     {items.map(item => (
        //     <li key={item.id}>
        //         {item.name} {item.price}
        //     </li>
        //     ))}
        // </ul>
        // );
    }

    function deleteMovie(movie_id) {
        console.log(movie_id)
        // setOpen(true);
        const fetchOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
            // body: JSON.stringify(post_json_data),
        }
        fetch(`${endpoint.endpoint}/movies?movie_id=${movie_id}`, fetchOptions)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if (result['result'] === 'Unauthorized') {
                        history.push(`/login`);
                    } else {
                        console.log("Deleted")
                        setIsLoaded(true);
                        setAlertMessage(`Successfully deleted Movie Data. Reloading Movie List`)
                        setOpenAlert(true);
                        setTimeout(function () {
                            history.push(`/movies`);
                            window.location.reload(false);
                        }, 4000);
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log(error)
                    setIsLoaded(true);
                    setError(error);
                }
            )

    }

    const title = "Are you sure?";
    const message = "This will delete the movie";
    return (
        <main>

            {/* Hero unit */}
            <Container className={classes.cardGrid} maxWidth="md">
                <CustomizedSnackbars open={openAlert} message={alertMessage} />
                { loggedIn && <Button variant="contained" color="secondary"><Link className={classes.link} href="/movies/create">Add Movies</Link></Button> }
                {/* <p>Click on Any Item and filter with it</p> */}

                <Grid container spacing={4}>
                    {items.map((card) => (
                        <Grid item key={card.movie_id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                {/* <CardMedia
                                    className={classes.cardMedia}
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                /> */}
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {card.name} <span style={{ fontSize: "10px", color: "green", fontVariant: "bold", float: "right" }}>{card.imdb_score}</span>
                                    </Typography>
                                    <Typography>
                                        By {card.director}
                                    </Typography>
                                    <Typography>
                                        {card.genre.map((tag, i) => [
                                            i > 0 && " ",
                                            // <Tag key={i} tag= />
                                            <Chip key={i} size="small" label={tag} component="a" href="#chip" clickable onClick={() => onClickFilterGenre(tag)} />
                                        ])}
                                    </Typography>
                                </CardContent>
                                
                                <CardActions>
                                    { loggedIn && <Link href={"/movies/" + card.movie_id}>Edit</Link> }
                                    { loggedIn && <ResponsiveDialog button_text="Delete" id={card.movie_id} customFunction={deleteMovie} title={title} message={message} /> }
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                { loggedIn && <Button variant="contained" color="primary">More Movies</Button> }
            </Container>
        </main>
    )
}

export default MoviesList;