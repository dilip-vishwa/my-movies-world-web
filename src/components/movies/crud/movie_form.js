import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { useHistory, useParams } from 'react-router';
import { Button } from '@material-ui/core';
import CustomizedSnackbars from '../../common/alerter';
import Movies from '../../movies/index'
import { matchPath } from 'react-router'
import endpoint from '../../../config';
// import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';


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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange,
    setValue
  }
}

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }



export default function MovieForm() {
  // const match = matchPath(this.props.history.location.pathname, {
  //         path: '/movies/:id',
  //         exact: true,
  //         strict: false
  //       })
  // let { movie_id } = match.params.movie_id;
  let { movie_id } = useParams();
  const classes = useStyles();
  const history = useHistory();

  const [formOperation, setFormOperation] = useState('create');
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [genreName, setGenreName] = useState([]);
  const movieName = useFormInput("");
  const director = useFormInput("");
  const imdbScore = useFormInput("");
  const popularity = useFormInput("");
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event) => {
    setGenreName(event.target.value);
  };

  const onClickSubmit = (e) => {
    e.preventDefault()
    let post_json_data = {
      name: movieName.value,
      imdb_score: imdbScore.value,
      popularity: popularity.value,
      genre: genreName,
      director: director.value
    }
    const fetchOptions = {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
      body: JSON.stringify(post_json_data),
    }
    let url = `${endpoint.endpoint}/movies`
    fetchOptions['method'] = 'POST'
    if (formOperation === 'update') {
      url = `${endpoint.endpoint}/movies?movie_id=${movie_id}`
      fetchOptions['method'] = 'PUT'
    }
    fetch(url, fetchOptions)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);

          setAlertMessage(`Successfully ${formOperation}d Movie Data. Reloading Movie List`)
          setOpenAlert(true);
          setTimeout(function () {
            history.push(`/movies`);
            // window.location.reload(false);
          }, 5000);

          // return (
          //     <Movies />
          // )
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }


  useEffect(() => {
    if (movie_id) {
      setFormOperation("update")
    }
    if (movie_id === undefined) {
      setFormOperation("create")
    }
    const fetchOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
      // body: JSON.stringify(post_json_data),
    }
    fetch(`${endpoint.endpoint}/movies/genre`, fetchOptions)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result['result']);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )

    if (movie_id !== undefined) {
      fetch(`${endpoint.endpoint}/movies/?movie_id=${movie_id}`, fetchOptions)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            result = result['result']
            movieName.setValue(result['name'])
            imdbScore.setValue(result['imdb_score'])
            popularity.setValue(result['popularity'])
            setGenreName(result['genre'])
            director.setValue(result['director'])
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  }, [])

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <CustomizedSnackbars open={openAlert} message={alertMessage} />
      {/* <p>Click on Any Item and filter with it</p> */}
      {/* End hero unit */}
      <Typography variant="h6" gutterBottom>
        Movie Information
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            id="name"
            name="name"
            label="Movie Name"
            fullWidth
            // autoComplete="given-name"
            value={movieName.value}
            onChange={movieName.onChange}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          {/* <ValidatorForm
            ref="form"
            // onSubmit={this.handleSubmit}
            // onChange
            onError={errors => console.log(errors)}
          > */}
          <TextField
            required
            id="popularity"
            name="popularity"
            label="Popularity"
            fullWidth
            // autoComplete="popularity"
            value={popularity.value}
            onChange={popularity.onChange}
            // validators={['minNumber:0', 'maxNumber:100', 'matchRegexp:^[0-9]$']}
          />
          {/* </ValidatorForm> */}
        </Grid>
        <Grid item xs={6} sm={6}>
          <TextField
            required
            id="director"
            name="director"
            label="Director"
            fullWidth
            // autoComplete="shipping address-line1"
            value={director.value}
            onChange={director.onChange}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          {/* <FormControl className={classes.formControl}> */}
          <InputLabel id="genre">Genre*</InputLabel>
          <Select
            fullWidth
            labelId="genre"
            id="genre"
            multiple
            value={genreName}
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {items.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {/* </FormControl> */}
        </Grid>
        <Grid item xs={6} sm={6}>
          <TextField
            required
            id="imdb_score"
            name="imdb_score"
            label="Imdb Score"
            fullWidth
            value={imdbScore.value}
            onChange={imdbScore.onChange}
          // autoComplete="shipping postal-code"
          />
        </Grid>
        <Button type="submit" variant="contained" color="secondary" onClick={onClickSubmit}>
          {formOperation === 'create' ? 'Create' : 'Update'} Movie
        </Button>
      </Grid>
    </Container>
  );
}