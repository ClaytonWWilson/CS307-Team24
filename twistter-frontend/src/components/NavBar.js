import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

export class Navbar extends Component {
    render() {
        return (
            <AppBar>
                <ToolBar>
                    <Button>Home</Button>
                </ToolBar>
            </AppBar>
        )
    }
}

export default Navbar;
