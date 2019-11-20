import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Material UI
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

// Material UI Icons
import AddCircleIcon from '@material-ui/icons/AddBox';
import CheckMarkIcon from '@material-ui/icons/Check';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import SendIcon from '@material-ui/icons/Send';

// Redux
import { connect } from 'react-redux';
import { getDirectMessages, checkUsernameValid, createNewDirectMessage } from '../redux/actions/dataActions';

const styles = {
	pageContainer: {
		minHeight: 'calc(100vh - 50px - 60px)'
	},
	sidePadding: {
		maxWidth: 350
	},
	dmList: {
		width: 300,
		marginLeft: 15
	},
	dmItem: {
		marginBottom: 1
	},
	dmItemUsernameSelected: {
		fontSize: 20,
		color: 'white'
	},
	dmItemUsernameUnselected: {
		fontSize: 20,
		color: '#1da1f2'
	},
	dmItemTimeSelected: {
		color: '#D6D6D6',
		fontSize: 12,
		float: 'right',
		marginRight: 5,
		marginTop: 5
	},
	dmItemTimeUnselected: {
		color: 'black',
		fontSize: 12,
		float: 'right',
		marginRight: 5,
		marginTop: 5
	},
	dmRecentMessageSelected: {
		color: '#D6D6D6'
	},
	dmRecentMessageUnselected: {
		color: 'black'
	},
	dmListItemContainer: {
		height: 100
	},
	dmListTextLayout: {
		height: '100%'
	},
	dmCardUnselected: {
		fontSize: 20,
		backgroundColor: '#FFFFFF'
	},
	dmCardSelected: {
		fontSize: 20,
		backgroundColor: '#1da1f2'
	},
	messagesGrid: {
		// // margin: "auto"
		// height: "auto",
		// width: "auto"
	},
	messagesBox: {
		width: 450
	},
	messagesContainer: {
		height: 'calc(100vh - 50px - 110px)',
		overflow: 'auto',
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
		backgroundColor: '#008394',
		color: '#FFFFFF',
		float: 'right'
	},
	toMessage: {
		minWidth: 150,
		maxWidth: 350,
		minHeight: 40,
		marginLeft: 2,
		marginTop: 2,
		marginBottom: 10,
		backgroundColor: '#008394',
		color: '#FFFFFF',
		float: 'left'
	},
	messageContent: {
		textAlign: 'left',
		marginLeft: 5,
		marginRight: 5
	},
	messageTime: {
		color: '#D6D6D6',
		textAlign: 'left',
		marginLeft: 5,
		fontSize: 12
	},
	writeMessage: {
		backgroundColor: '#FFFFFF',
		boxShadow: '0px 0px 5px 0px grey',
		width: 450
	},
	messageTextField: {
		width: 388
	},
	messageButton: {
		backgroundColor: '#1da1f2',
		marginTop: 8,
		marginLeft: 2
	},
	loadingUsernameChecks: {
		height: 55,
		width: 55,
		marginLeft: 5
	},
	errorIcon: {
		height: 55,
		width: 55,
		marginLeft: 5,
		color: '#ff3d00'
	},
	checkMarkIcon: {
		height: 55,
		width: 55,
		marginLeft: 5,
		color: '#1da1f2'
    },
    createButton: {
        // textAlign: "center",
        // display: "block",
        marginLeft: 96,
        marginRight: 96,
        position: "relative"
    }
};

export class directMessages extends Component {
	constructor() {
		super();
		this.state = {
			hasChannelSelected: false,
			selectedChannel: null,
			dmData: null,
			anchorEl: null,
			createDMUsername: '',
            usernameValid: false,
            errors: null
		};
	}

	componentDidUpdate() {
		if (this.state.hasChannelSelected) {
			document.getElementById('messagesContainer').scrollTop = document.getElementById(
				'messagesContainer'
			).scrollHeight;
		}
	}

	componentDidMount() {
		//   this.props.getDirectMessages();
		const resp = {
            "data": [
                {
                    "recipient": "CrazyEddy",
                    "messages": [
                        {
                            "message": "This is message 1",
                            "createdAt": "2019-11-04T17:10:29.180Z",
                            "messageId": "yGqcBbDSM8TsoaQAfAVc",
                            "author": "CrazyEddy"
                        },
                        {
                            "messageId": "c1Bd1REkMBaMaraH10WP",
                            "author": "keanureeves",
                            "message": "This is message 2",
                            "createdAt": "2019-11-04T17:33:35.169Z"
                        },
                        {
                            "messageId": "CL5sThnuekks6579MKuF",
                            "author": "keanureeves",
                            "message": "Yo, this my first message",
                            "createdAt": "2019-11-08T22:15:08.456Z"
                        },
                        {
                            "messageId": "BgMSSlLLLdC1DMtJl5VJ",
                            "author": "CrazyEddy",
                            "message": "That is epic",
                            "createdAt": "2019-11-08T22:20:16.768Z"
                        },
                        {
                            "message": "test test test",
                            "createdAt": "2019-11-08T22:20:58.961Z",
                            "messageId": "9AeUuz0l4wWyQSG6RQ4A",
                            "author": "keanureeves"
                        },
                        {
                            "messageId": "zhfEpirBK7jl9FnFMtsQ",
                            "author": "CrazyEddy",
                            "message": "noice",
                            "createdAt": "2019-11-08T22:21:29.768Z"
                        },
                        {
                            "message": "What time is it?",
                            "createdAt": "2019-11-08T22:23:27.353Z",
                            "messageId": "XwyKwFU2L5wrTKedzlyF",
                            "author": "CrazyEddy"
                        },
                        {
                            "messageId": "qeasHYkAtTGvjnc3VJAi",
                            "author": "keanureeves",
                            "message": "it's 5:24 right now",
                            "createdAt": "2019-11-08T22:24:21.807Z"
                        },
                        {
                            "messageId": "I7kzyLUd9Pp5qzxTPzQv",
                            "author": "keanureeves",
                            "message": "a",
                            "createdAt": "2019-11-08T22:31:42.852Z"
                        },
                        {
                            "messageId": "iySWBDFFrbY8FT6E61NL",
                            "author": "keanureeves",
                            "message": "b",
                            "createdAt": "2019-11-08T22:31:51.558Z"
                        },
                        {
                            "messageId": "Yis0vXSEuMggj6z5Mq1a",
                            "author": "keanureeves",
                            "message": "c",
                            "createdAt": "2019-11-08T22:32:01.293Z"
                        },
                        {
                            "messageId": "DIgjDvFczqO0OWkOrL0t",
                            "author": "keanureeves",
                            "message": "d",
                            "createdAt": "2019-11-08T22:32:16.095Z"
                        },
                        {
                            "messageId": "6h1dnFE440MOrjySEQHU",
                            "author": "keanureeves",
                            "message": "e",
                            "createdAt": "2019-11-08T22:32:22.134Z"
                        },
                        {
                            "messageId": "lmOGGYUWZyB3xG38T7lG",
                            "author": "keanureeves",
                            "message": "f",
                            "createdAt": "2019-11-08T22:32:28.424Z"
                        },
                        {
                            "messageId": "64swTj7yiFy7SF6BPbki",
                            "author": "keanureeves",
                            "message": "g",
                            "createdAt": "2019-11-08T22:32:37.632Z"
                        }
                    ],
                    "recentMessage": "g",
                    "recentMessageTimestamp": "2019-11-08T22:32:37.632Z",
                    "dmId": "avGcIs4PFCJhc4EDqAfe"
                },
                {
                    "recipient": "batman",
                    "messages": [],
                    "recentMessage": null,
                    "recentMessageTimestamp": null,
                    "dmId": "Lifb0XAONpNLJRhDnOHj"
                },
                {
                    "recipient": "katherine",
                    "messages": [],
                    "recentMessage": null,
                    "recentMessageTimestamp": null,
                    "dmId": "QBMonxPTbha0uJc7P73R"
                }
            ]
        }
		// const resp = {"data": null}
		this.setState({ dmData: resp.data });
    }
    
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.data.dmData) {
    //       this.setState({ dmData: nextProps.data.dmData });
    //     }
    //   }

	// Handles selecting different DM channels
	handleClickChannel = (event) => {
		this.setState({
			hasChannelSelected: true
		});
		let dmChannelKey;

		// Determine which DM channel was clicked by finding the key
		// An if statement is needed because the user could click the card or the typography
		if (event.target.parentNode.parentNode.parentNode.dataset.key === undefined) {
			// They clicked text
			dmChannelKey = event.target.parentNode.parentNode.parentNode.parentNode.dataset.key;
		} else {
			// They clicked the background/card
			dmChannelKey = event.target.parentNode.parentNode.parentNode.dataset.key;
		}

		// Save the entire DM channel in the state so that it is easier to load the messages
		this.state.dmData.forEach((channel) => {
			if (channel.dmId === dmChannelKey) {
				this.setState({
					selectedChannel: channel
				});
			}
		});
	};

	formatDateToString(dateString) {
		let newDate = new Date(Date.parse(dateString));
		return newDate.toDateString();
	}

	formatDateToTimeDiff(dateString) {
		return dayjs(dateString).fromNow();
	}

	handleOpenAddDMPopover = (event) => {
		this.setState({
			anchorEl: event.currentTarget
		});
	};

	handleCloseAddDMPopover = () => {
		this.setState({
			anchorEl: null,
            createDMUsername: '',
			usernameValid: false
		});
	};

	handleChangeAddDMUsername = (event) => {
		this.setState({
			createDMUsername: event.target.value
        });
    };
    
    handleClickCreate = () => {
        this.props.createNewDirectMessage(this.state.createDMUsername);
    }

	render() {
        const { classes } = this.props;
        const loadingDirectMessages = this.props.UI.loading2;
        const creatingDirectMessage = this.props.UI.loading3;
        const sendingDirectMessage = this.props.UI.loading4;
        let errors = this.props.UI.errors ? this.props.UI.errors : {};
		dayjs.extend(relativeTime);

		// Used for the add button on the dmList
		const open = Boolean(this.state.anchorEl);
		const id = open ? 'simple-popover' : undefined;

		let dmListMarkup = this.state.dmData ? (
			this.state.dmData.map((channel) => (
				<Card
					onClick={this.handleClickChannel}
					key={channel.dmId}
					data-key={channel.dmId}
					className={
						this.state.selectedChannel === channel ? classes.dmCardSelected : classes.dmCardUnselected
					}
				>
					<Box className={classes.dmListItemContainer}>
						<Grid container className={classes.dmListTextLayout}>
							<Grid item sm />
							<Grid item sm>
								<Typography
									className={
										this.state.selectedChannel === channel ? (
											classes.dmItemUsernameSelected
										) : (
											classes.dmItemUsernameUnselected
										)
									}
								>
									{channel.recipient}
								</Typography>
								<Typography
									className={
										this.state.selectedChannel === channel ? (
											classes.dmRecentMessageSelected
										) : (
											classes.dmRecentMessageUnselected
										)
									}
								>
									{channel.recentMessage ? channel.recentMessage : 'No messages'}
								</Typography>
							</Grid>
							<Grid item sm>
								<Typography
									className={
										this.state.selectedChannel === channel ? (
											classes.dmItemTimeSelected
										) : (
											classes.dmItemTimeUnselected
										)
									}
								>
									{channel.recentMessageTimestamp ? (
										this.formatDateToTimeDiff(channel.recentMessageTimestamp)
									) : null}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Card>
			))
		) : (
			<p>You don't have any DMs yet</p>
		);

		let messagesMarkup =
			this.state.selectedChannel !== null ? this.state.selectedChannel.messages.length > 0 ? (
				this.state.selectedChannel.messages.map((messageObj) => (
					<Grid item key={messageObj.messageId}>
						<Card
							className={
								messageObj.author === this.state.selectedChannel.recipient ? (
									classes.toMessage
								) : (
									classes.fromMessage
								)
							}
						>
							<Typography className={classes.messageContent}>{messageObj.message}</Typography>
							<Typography className={classes.messageTime}>
								{this.formatDateToString(messageObj.createdAt)}
							</Typography>
						</Card>
					</Grid>
				))
			) : (
				<p>No DMs here</p>
			) : (
				<p>Select a DM channel</p>
			);

		let addDMMarkup = (
			<div>
				<AddCircleIcon
					style={{
						color: '#1da1f2',
						height: 82,
						width: 82,
						marginTop: 9,
						cursor: 'pointer'
					}}
					aria-describedby={id}
					onClick={this.handleOpenAddDMPopover}
				/>
				<Popover
					id={id}
					open={open}
					anchorEl={this.state.anchorEl}
					onClose={this.handleCloseAddDMPopover}
					anchorOrigin={{
						vertical: 'center',
						horizontal: 'center'
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center'
					}}
				>
					<Box
						style={{
							height: 200,
							width: 400
						}}
					>
						<Grid container>
							<Grid item sm />
							<Grid item style={{ height: 200, width: 285 }}>
								<Grid container direction="column" spacing={2}>
									<Grid item>
										<Typography style={{ marginTop: 15 }}>
											Who would you like to start a DM with?
										</Typography>
									</Grid>
									<Grid item>
										<TextField
											onChange={this.handleChangeAddDMUsername}
											value={this.state.createDMUsername}
											label="Username"
                                            variant="outlined"
                                            helperText={errors.createDirectMessage}
                                            error={errors.createDirectMessage ? true : false}
											style={{
                                                width: 265,
                                                marginRight: 10,
                                                marginLeft: 10,
                                                textAlign: 'center',
											}}
										/>
									</Grid>
                                    <Grid item> 
                                        <Button
                                            className={classes.createButton}
                                            variant="outlined"
                                            color="primary"
                                            onClick={this.handleClickCreate}
                                            disabled={
                                                creatingDirectMessage ||
                                                this.state.createDMUsername === ""    
                                            }
                                        >
                                            Create
                                            {creatingDirectMessage && 
											    <CircularProgress size={30} style={{position: "absolute"}}/>
                                                // Won't accept classes style for some reason
                                            }
                                        </Button>
                                    </Grid>
								</Grid>
							</Grid>
							<Grid item sm />
						</Grid>
					</Box>
				</Popover>
			</div>
		);

		return (
			<Grid container className={classes.pageContainer}>
				<Grid item className={classes.sidePadding} sm />
				<Grid item className={classes.dmList}>
					<Grid container direction="column">
						<Grid item className={classes.dmItem}>
							{dmListMarkup}
							<Card key="5555" data-key="5555" className={classes.dmCardUnselected}>
								<Box className={classes.dmListItemContainer}>
                                    {addDMMarkup}
                                </Box>
							</Card>
						</Grid>
					</Grid>
				</Grid>
				<Grid item className={classes.messagesGrid} sm>
					<Box>
						{this.state.hasChannelSelected && (
							<Card className={classes.messagesBox}>
								<Box className={classes.messagesContainer} id="messagesContainer">
									<Grid container direction="column">
										{messagesMarkup}
									</Grid>
								</Box>
								<Box className={classes.writeMessage}>
									<TextField
										className={classes.messageTextField}
										variant="outlined"
										multiline
										rows={2}
										margin="dense"
									/>
									<Fab className={classes.messageButton}>
										<SendIcon style={{ color: '#FFFFFF' }} />
									</Fab>
								</Box>
							</Card>
						)}
						{!this.state.hasChannelSelected &&
						this.state.dmData && <Typography>Select a DM on the left</Typography>}
					</Box>
				</Grid>
				<Grid item className={classes.sidePadding} sm />
			</Grid>
		);
	}
}

directMessages.propTypes = {
	classes: PropTypes.object.isRequired,
    getDirectMessages: PropTypes.func.isRequired,
    createNewDirectMessage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI,
	directMessages: state.directMessages
});

const mapActionsToProps = {
    getDirectMessages,
    createNewDirectMessage
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(directMessages));
