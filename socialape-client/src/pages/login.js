import React, { Component } from 'react';
import axios from 'axios'; 
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

import logo from '../images/twistter-logo.png';





const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        margin: '20px auto 20px auto'
    },
    pageTitle: {
        margin: '20px auto 20px auto'
    },
    textField: {
        margin: '20px auto 20px auto'
    },
    button: {
        margin: '20px auto 20px auto'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem'
    }
};

class login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
    };
    handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        axios.post('/login', userData)
        .then(res => {
            console.log(res.data);
            localStorage.setItem('firebaseIdToken', `Bearer ${res.data.token}`);
            this.props.history.push('/');
        })
        .catch(err => {
            this.setState({
                errors: err.response.data
            });
        });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    render() {
        const { classes } = this.props;
        const { errors } = this.state;
        return (
            <Grid container className={classes.form}>
                <Grid item sm>
                    <img src={logo} alt="logo" className={classes.image} height="200" />
                    <Typography variant="h4" className={classes.pageTitle}>
                        Log in
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField id="email" name="email" type="email" label="Email" className={classes.textField} 
                        helperText={errors.email} error={errors.email ? true : false} 
                        value={this.state.email} onChange={this.handleChange} />
                        <br />
                        <TextField id="password" name="password" type="password" label="Password" className={classes.textField} 
                        helperText={errors.password} error={errors.password ? true : false} 
                        value={this.state.password} onChange={this.handleChange} />
                        <br />
                        {
                            errors.general && 
                            (<Typography variant="body2" className={classes.customError}>
                                {errors.general}
                            </Typography>)
                        }
                        <Button type="submit" variant="contained" color="primary" className={classes.button}>Log in</Button>
                    </form>
                </Grid>
            </Grid>
        );
    };
};

login.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(login);