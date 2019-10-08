/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

export class Navbar extends Component {
    render() {
        return (
            <AppBar>
                <ToolBar>
                    <Button component={ Link } to='/'>
                        Home
                    </Button>
                    <Button component={ Link } to='/login'>
                        Login
                    </Button>
                    <Button component={ Link } to='/signup'>
                        Sign Up
                    </Button>
		    <Button component={ Link } to='/logout'>
			Logout
		    </Button>
                </ToolBar>
            </AppBar>
        )
    }
}

export default Navbar;
