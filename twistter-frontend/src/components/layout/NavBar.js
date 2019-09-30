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
                    <Button component={ Link } to='/user'>
                        User
                    </Button>
                    <Button component={ Link } to='/login'>
                        Login
                    </Button>
                    <Button component={ Link } to='/register'>
                        Register
                    </Button>
                    <Button component={ Link } to='/'>
                        Home
                    </Button>
                </ToolBar>
            </AppBar>
        )
    }
}

export default Navbar;
