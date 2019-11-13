import React, { Component } from 'react'
import PropTypes from 'prop-types';

// Material UI
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
import GridList from "@material-ui/core/GridList";
import GridListTile from '@material-ui/core/GridListTileBar';
import Card from "@material-ui/core/Card";

import { connect } from 'react-redux';
import { Box } from '@material-ui/core';

const styles = {
    pageContainer: {
        // height: "100%"
        minHeight: "calc(100vh - 50px - 60px)"
    },
    sidePadding: {
        maxWidth: 350,
        // margin: "auto"
    },
    dmList: {
        width: 300,
        marginLeft: 15,
        // borderRight: "solid"
    },
    dmItem: {
        marginBottom: 1
        // height: 100,
        // border: "solid grey 1px",
        // boxShadow: "2px 0px grey"
    },
    dmItemUsernameSelected: {
        // marginLeft: "auto"
        // float: "left"
        fontSize: 20,
        color: "white"
    },
    dmItemUsernameUnselected: {
        fontSize: 20,
        color: "#1da1f2"
    },
    dmRecentMessageSelected: {
        color: "#D6D6D6"
    },
    dmRecentMessageUnselected: {
        color: "black"
    },
    dmListItemContainer: {
        height: 100
    },
    dmCardUnselected: {
        fontSize: 20,
        backgroundColor: "#FFFFFF"
    },
    dmCardSelected: {
        fontSize: 20,
        backgroundColor: "#1da1f2"
    },
    messagesGrid: {
        // // margin: "auto"
        // height: "auto",
        // width: "auto"
    },
    messagesContainer: {
        height: "100%",
        // width: "calc(100% - 4)",
        width: 450,
        marginLeft: 2,
        marginRight: 17
    },
    fromMessage: {
        minWidth: 150,
        maxWidth: 350,
        minHeight: 40,
        marginRight: 2,
        marginTop: 2,
        marginBottom: 10,
        backgroundColor: "#008394",
        color: "#FFFFFF",
        float: "right"
    },
    toMessage : {
        minWidth: 150,
        maxWidth: 350,
        minHeight: 40,
        marginLeft: 2,
        marginTop: 2,
        marginBottom: 10,
        backgroundColor: "#008394",
        color: "#FFFFFF",
        float: "left"
    },
    messageContent: {
        textAlign: "left",
        marginLeft: 5,
        marginRight: 5
    },
    messageTime: {
        color: "#D6D6D6",
        textAlign: "left",
        marginLeft: 5,
        fontSize: 12
    }
}


export class directMessages extends Component {
    constructor() {
        super();
        this.state = {
            selectedMessage: "-1"
        };
      }



    showAlert = (event) => {
        // alert(event.target.dataset)
        let paper;
        if (event.target.parentNode.dataset.key === undefined) {
            paper = event.target.parentNode.parentNode.dataset;
        } else {
            paper = event.target.parentNode.dataset;
        }
        this.setState({
            selectedMessage: paper.key
        })
    }

    render() {
        const { classes } = this.props;

        const selected = true;

        let dmListMarkup = (
            <Grid container direction="column">
                <Grid item className={classes.dmItem}>
                    {this.state.selectedMessage === "0" ? 
                    <Card onClick={this.showAlert} key={0} data-key={0} className={classes.dmCardSelected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameSelected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageSelected}>This is the most recent message</Typography>
                        </Box>
                    </Card>
                    : 
                    <Card onClick={this.showAlert} key={0} data-key={0} className={classes.dmCardUnselected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameUnselected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageUnselected}>This is the most recent message</Typography>
                        </Box>
                    </Card>}
                </Grid>
                <Grid item className={classes.dmItem}>
                    {this.state.selectedMessage === "1" ? 
                    <Card onClick={this.showAlert} key={1} data-key={1} className={classes.dmCardSelected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameSelected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageSelected}>This is the most recent message</Typography>
                        </Box>
                    </Card>
                    : 
                    <Card onClick={this.showAlert} key={1} data-key={1} className={classes.dmCardUnselected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameUnselected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageUnselected}>This is the most recent message</Typography>
                        </Box>
                    </Card>}
                </Grid>
                <Grid item className={classes.dmItem}>
                    {this.state.selectedMessage === "2" ? 
                    <Card onClick={this.showAlert} key={2} data-key={2} className={classes.dmCardSelected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameSelected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageSelected}>This is the most recent message</Typography>
                        </Box>
                    </Card>
                    : 
                    <Card onClick={this.showAlert} key={2} data-key={2} className={classes.dmCardUnselected}>
                        <Box className={classes.dmListItemContainer}>
                            <Typography className={classes.dmItemUsernameUnselected}>keanureeves</Typography>
                            <Typography className={classes.dmRecentMessageUnselected}>This is the most recent message</Typography>
                        </Box>
                    </Card>}
                </Grid>
                
            </Grid>
        )

        let messagesMarkup = (
            <Grid container direction="column">
                <Grid item>
                    <Card className={classes.toMessage}>
                        <Typography className={classes.messageContent}>hello</Typography>
                        <Typography className={classes.messageTime}>Tues 3:26pm</Typography>
                    </Card>
                </Grid>
                <Grid item>
                    <Card className={classes.fromMessage}>
                        <Typography>Hey, what's up?</Typography>
                        <Typography>Tues 3:26pm</Typography>
                    </Card>
                </Grid>
                <Grid item>
                    <Card className={classes.toMessage}>
                        <Typography>not much. just chillin'</Typography>
                        <Typography>Tues 3:27pm</Typography>
                    </Card>
                </Grid>
                <Grid item>
                    <Card className={classes.fromMessage}>
                        <Typography>yayayay yay ayay ya ys ydyyasydasy yd yas dyas ydyasy dyasydy asyd yay ydysyd yaysdy yasy dyas ydysyd yasy dasy dyaysydya sydyasyd yasyd yasyd yasydyasdy yas ys ysdyydayaysyd ysdyasyd ysdyy yasyd asydyasy dyasydy</Typography>
                        <Typography>Tues 9:35pm</Typography>
                    </Card>
                </Grid>
            </Grid>
        )

        return (
            <Grid container className={classes.pageContainer}>
                <Grid item className={classes.sidePadding} sm/>
                <Grid item className={classes.dmList}>
                    {dmListMarkup}
                </Grid>
                <Grid item className={classes.messagesGrid} sm>
                    <Box className={classes.messagesContainer}>
                        {selected && 
                        <Card className={classes.messagesContainer}>
                            {messagesMarkup}
                        </Card>}
                        {!selected && 
                            <Typography>Select a DM on the left</Typography>}
                        
                    </Box>
                </Grid>
                <Grid item className={classes.sidePadding} sm/>
            </Grid>
        )
    }
}

directMessages.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
});

// export default directMessages
export default connect(mapStateToProps)(withStyles(styles)(directMessages));
