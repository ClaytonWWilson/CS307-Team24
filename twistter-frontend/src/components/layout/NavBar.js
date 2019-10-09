/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// Material UI stuff
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import withStyles from "@material-ui/core/styles/withStyles";

// Redux stuff
// import { logoutUser } from '../../redux/actions/userActions';
// import { connect } from 'react-redux';

// const styles = {
//     form: {
//       textAlign: "center"
//     },
//     textField: {
//       marginBottom: 30
//     },
//     pageTitle: {
//       marginBottom: 40
//     },
//     button: {
//       positon: "relative",
//       marginBottom: 30
//     },
//     progress: {
//       position: "absolute"
//     }
//   };




  
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

// const mapStateToProps = (state) => ({
//     user: state.user
// })

// const mapActionsToProps = { logoutUser };

// Navbar.propTypes = {
//     logoutUser: PropTypes.func.isRequired,
//     user: PropTypes.object.isRequired,
//     classes: PropTypes.object.isRequired
// }

// export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Navbar));

export default Navbar;
