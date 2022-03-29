import React from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import { nanoid } from 'nanoid'
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
  Message
} from "semantic-ui-react";

class Channels extends React.Component {
  state = {
    activeChannel: "",
    user: this.props.currentUser,
    userId: this.props.currentUser.uid,
    channel: null,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    messagesRef: firebase.database().ref("messages"),
    typingRef: firebase.database().ref('typing'),
    usersRef: firebase.database().ref("users"),
    codeRef: firebase.database().ref('channelCode'),
    notifications: [],
    modal: false,
    firstLoad: true,
    loading: true,
    joinModal: false,
    channelCode: null,
    error:''
  };


  componentDidMount() {
    this.addListeners(this.state.userId);
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = userId => {
    let loadedChannels = []
    this.state.usersRef.child(`${userId}/channels`).on('child_added', snap2 => {
      this.state.channelsRef.on("child_added", snap => {
        if (snap2.val().key === snap.val().id) {
          loadedChannels.push(snap.val());
          this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
          this.addNotificationListener(snap.key);
        }
      })
    })
  }


  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.channels.forEach(channel => {
      this.state.messagesRef.child(channel.id).off();
    })
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = this.state;
    const key = channelsRef.push().key;

    let code=nanoid(6)
    this.state.codeRef
      .child(code)
      .update({ key,code:code })
      .then(() => {
        // adding channel in channel document
        channelsRef
          .child(key)
          .update({
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
              name: user.displayName,
              avatar: user.photoURL
            },
            code:code,
          })
          .then(() => {
            this.setState({ channelName: "", channelDetails: "" });
            //adding channel in user document
            this.state.usersRef
              .child(`${this.state.userId}/channels`)
              .push()
              .update({
                key
              })
              .then(() => {

              })
              .catch(err => console.error(err));
            this.closeModal();
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => console.error(err));

  };

  searchUserChannel=channelId=>{
    let ans=false;
    this.state.usersRef
    .child(`${this.state.userId}/channels`)
    .on('value',(snapshot)=>{
      snapshot.forEach(element => {
        if(element.val().key===channelId){
          ans=true;
        }
      });
    })
    return ans;
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }else{
      this.setState({error:"Invalid Details"})
    }
  };

  handleSubmit2 = event => {
    event.preventDefault();
    if (this.state.channelCode) {
      this.joinChannel(this.state);
    }else{
      this.setState({error:"Please enter code"})
    }
  }

  joinChannel = ({ codeRef,channelCode }) => {
    let found=false;
    let validCode=false;
    codeRef
    .on('value',(snapshot)=>{
      snapshot.forEach(data=>{
        if(data.val().code===channelCode){
          if(!this.searchUserChannel(data.val().key)){
            this.state.usersRef
            .child(`${this.state.userId}/channels`)
            .push()
            .update({
              key:data.val().key
            })
            .then(() => {
                this.closeJoinChannel();
                return 0;
            })
            .catch((err)=>{
              this.setState({error:"Something went wrong"})
            });
          }
          else{
            found=true;
          }
          validCode=true;
        }
      })
    })
    console.log(validCode);
    console.log(found);

    if(validCode==false){
      this.setState({error:"Invalid Code"})
    }
    else if(found){
      this.setState({error:"Already member of the channel"})
    }
    else{
      this.setState({error:""})
      this.setActiveChannel(channelCode);
    }

  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = channel => {
    console.log(this.state.channel);
    this.setActiveChannel(channel);
    this.state.typingRef
      .child(this.state.channel.id)
      .child(this.state.user.uid)
      .remove();
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  openModal = () => this.setState({ modal: true });

  openJoinChannel = () => this.setState({ joinModal: true });

  closeJoinChannel = () => this.setState({ joinModal: false });

  closeModal = () => this.setState({ modal: false });

  render() {
    const { channels, modal, joinModal,error } = this.state;

    return (
      // this.state.channels.length===0?<Spinner/>:
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length})
            <Icon name="add circle" onClick={this.openJoinChannel} />
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Join Channel Modal */}

        <Modal basic open={joinModal} onClose={this.closeJoinChannel}>
          <Modal.Header>Join with code</Modal.Header>
          <Modal.Content>
            { error.length>0 ? <Message error>
              <h3>Error</h3>
              <p>{error}</p>
            </Message>:<div></div>}
            <Form onSubmit={this.handleSubmit2}>
              <Form.Field>
                <Input
                  fluid
                  label="Enter Code"
                  name="channelCode"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit2}>
              <Icon name="checkmark" /> Join
            </Button>
            <Button color="red" inverted onClick={this.closeJoinChannel}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>

        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);