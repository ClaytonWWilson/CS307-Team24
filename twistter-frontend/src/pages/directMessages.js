import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import _ from "underscore";

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
import { 
    getDirectMessages, 
    createNewDirectMessage, 
    getNewDirectMessages, 
    reloadDirectMessageChannels, 
    sendDirectMessage
} from '../redux/actions/dataActions';

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
	dmItemsUpper: {
        marginBottom: 1,
        // height: 'calc(100vh - 50px - 142px)',
        minHeight: 100,
        maxHeight: 'calc(100vh - 50px - 142px)',
        overflow: "auto"
    },
    dmItemsLower: {

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
		wordBreak: "break-all",
		color: '#D6D6D6'
	},
	dmRecentMessageUnselected: {
		wordBreak: "break-all",
		color: 'black'
	},
	dmListItemContainer: {
		height: 100
	},
	dmListLayoutContainer: {
		height: "100%"
	},
	dmListRecentMessage: {
		marginLeft: 10,
		marginRight: 10
	},
	dmListTextLayout: {
		height: 30
	},
	dmCardUnselected: {
		fontSize: 20,
		backgroundColor: '#FFFFFF',
		width: 300
	},
	dmCardSelected: {
		fontSize: 20,
		backgroundColor: '#1da1f2',
		width: 300
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
		marginLeft: 15,
		marginTop: 2,
		marginBottom: 10,
		backgroundColor: '#008394',
		color: '#FFFFFF',
		float: 'left'
	},
	messageContent: {
		// maxWidth: 330,
		// width: 330,
		wordBreak: "break-all",
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
            // message: '',
            drafts: {},
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
        this.props.getDirectMessages();
        // this.updatePage();
    }
    
    // Updates the state whenever redux is updated
    componentWillReceiveProps(nextProps) {
        if (nextProps.directMessages && !_.isEqual(nextProps.directMessages, this.state.dmData)) {
            this.setState({ dmData: nextProps.directMessages}, () => {
                if (this.state.selectedChannel) {
                    this.state.dmData.forEach((channel) => {
                        if (channel.dmId === this.state.selectedChannel.dmId) {
                            this.setState({
                                selectedChannel: channel
                            });
                        }
                    });
                }
            });
        }
    }

    updatePage = async() => {
        while (true) {
            await this.sleep(15000);
            // console.log("getting new DMs");
            this.props.getNewDirectMessages();
        }
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	// Handles selecting different DM channels
	handleClickChannel = (event) => {
		this.setState({
			hasChannelSelected: true
		});

		const dmItemsUpper = document.getElementById("dmItemsUpper");
		let target = event.target;
		let dmChannelKey;

		// Determine which DM channel was clicked by finding the data-key.
		// A while loop is necessary, because the user can click on any part of the
		// DM list item. dmItemsUpper is the list container of the dmItems
		while (target !== dmItemsUpper) {
			dmChannelKey = target.dataset.key;

			if (dmChannelKey) {
				break;
			} else {
				target = target.parentNode;
			}
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

	shortenText = (text, length) => {
		// Shorten the text
		let shortened = text.slice(0, length + 1);

		// Trim whitespace from the end of the text
		if (shortened[shortened.length - 1] === ' ') {
			shortened = shortened.trimRight();
		}

		// Add ... to the end
		shortened = `${shortened}...`;

		return shortened;
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
        this.props.createNewDirectMessage(this.state.createDMUsername)
            .then(() => {
                return this.props.reloadDirectMessageChannels();
            })
            .then(() => {
                this.handleCloseAddDMPopover();
                return;
            })
            .catch(() => {
                return;
            })
    }

    handleChangeMessage = (event) => {
        let drafts = this.state.drafts;
        drafts[this.state.selectedChannel.dmId] = event.target.value;
        this.setState({
            drafts
        });
    }

    handleClickSend = () => {
        // console.log(this.state.drafts[this.state.selectedChannel.dmId]);
        let drafts = this.state.drafts;
        if (this.state.hasChannelSelected && drafts[this.state.selectedChannel.dmId]) {
            this.props.sendDirectMessage(this.state.selectedChannel.recipient, drafts[this.state.selectedChannel.dmId]);
            drafts[this.state.selectedChannel.dmId] = null;
            this.setState({
                drafts
            });
        }
    }

	render() {
		const { classes, user: { credentials: { dmEnabled } } } = this.props;
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
						this.state.selectedChannel && this.state.selectedChannel.dmId === channel.dmId ? classes.dmCardSelected : classes.dmCardUnselected
					}
				>
					<Box className={classes.dmListItemContainer}>
						<Grid container direction="column" className={classes.dmListLayoutContainer} spacing={1}>
							<Grid item>
								<Grid container className={classes.dmListTextLayout}>
									<Grid item sm />
									<Grid item sm>
										<Typography
											className={
												this.state.selectedChannel && this.state.selectedChannel.dmId === channel.dmId ? (
													classes.dmItemUsernameSelected
												) : (
													classes.dmItemUsernameUnselected
												)
											}
										>
											{channel.recipient}
										</Typography>
									</Grid>
									<Grid item sm>
										<Typography
											className={
												this.state.selectedChannel && this.state.selectedChannel.dmId === channel.dmId ? (
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
							</Grid>
							<Grid item className={classes.dmListRecentMessage}>
								<Typography
									className={
										this.state.selectedChannel && this.state.selectedChannel.dmId === channel.dmId ? (
											classes.dmRecentMessageSelected
										) : (
											classes.dmRecentMessageUnselected
										)
									}
								>
									{!channel.hasDirectMessagesEnabled ? "This user has DMs disabled" :
										!channel.recentMessage ? 
											'No messages' 
										: 
											channel.recentMessage.length > 65 ?
												this.shortenText(channel.recentMessage, 65)
											:
												channel.recentMessage
									}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				</Card>
			))
		) : (
			<p>You don't have any DMs yet</p>
		)

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
                      // Won't accept classes style for some reason
                      <CircularProgress size={30} style={{position: "absolute"}}/>
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
			loadingDirectMessages ? <CircularProgress size={60} style={{marginTop: "300px"}}></CircularProgress> : 
				(dmEnabled !== undefined && dmEnabled !== null && !dmEnabled ? <Typography>Oops! It looks like you have DMs disabled. You can enable them on the Edit Profile page.</Typography> :
			<Grid container className={classes.pageContainer}>
				<Grid item className={classes.sidePadding} sm />
				<Grid item className={classes.dmList}>
					<Grid container direction="column">
						<Grid item className={classes.dmItemsUpper} id="dmItemsUpper">
							{dmListMarkup}
						</Grid>
              <Grid item className={classes.dmItemsLower}>
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
                    disabled={!this.state.selectedChannel.hasDirectMessagesEnabled}
                    value={
                      !this.state.selectedChannel.hasDirectMessagesEnabled ? 
                        "This user has DMs disabled"
                      :
                        this.state.drafts[this.state.selectedChannel.dmId] ? 
                          this.state.drafts[this.state.selectedChannel.dmId] 
                        : 
                          ""
                    }
                    onChange={this.handleChangeMessage}
									/>
                    <Fab 
                      className={classes.messageButton}
                      onClick={this.handleClickSend}
                      disabled={
                        sendingDirectMessage ||
                        !this.state.drafts[this.state.selectedChannel.dmId] ||
                        this.state.drafts[this.state.selectedChannel.dmId] === ""
                      }
                    >
										<SendIcon style={{ color: '#FFFFFF' }} />
                    {
                      sendingDirectMessage && 
                      <CircularProgress size={30} style={{position: "absolute"}}/>
                      // Won't accept classes style for some reason
                    }
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
			)
		);
	}
}

directMessages.propTypes = {
	classes: PropTypes.object.isRequired,
    getDirectMessages: PropTypes.func.isRequired,
    createNewDirectMessage: PropTypes.func.isRequired,
    getNewDirectMessages: PropTypes.func.isRequired,
    reloadDirectMessageChannels: PropTypes.func.isRequired,
    sendDirectMessage: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI,
	directMessages: state.data.directMessages
});

const mapActionsToProps = {
    getDirectMessages,
    createNewDirectMessage,
    getNewDirectMessages,
    reloadDirectMessageChannels,
    sendDirectMessage
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(directMessages));
