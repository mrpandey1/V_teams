import React from 'react'
import { Button, Input,Segment } from "semantic-ui-react";
import TodoMessage from './TodoMessage';
import firebase from "../../firebase";
import './Todo.css'

class Todo extends React.Component {
  state = {
    channel: this.props.channel,
    getTodoRef:firebase.database().ref("todos"),
    todoMessage:'',
    messages:[]
  };
componentDidMount(){
    const {channel}=this.state;
    if(channel){
        this.addListeners(channel.id);
    }
}
    addListeners = channelId => {
    this.addMessageListener(channelId);
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit=()=>{
    this.state.getTodoRef
    .child(this.state.channel.id)
    .push()
    .set({
        content:this.state.todoMessage,
        timestamp:firebase.database.ServerValue.TIMESTAMP
    })
    .then(()=>{
        this.setState({
            todoMessage:""
        })
    })
    .catch(err=>{
    })
    
    console.log(this.state.channel.name);
    console.log(this.state.channel.id);
    console.log(this.state.todoMessage);
    console.log(this.state.messages);
  }
  
  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.state.getTodoRef;
    ref.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
      });
    });
};


displayMessages = messages =>
messages.length > 0 &&
messages.map(message => (
  <TodoMessage
    message={message}
  />
));


  render(){
      return(
    <React.Fragment>
        <Segment>
            <h3>Todo</h3>
            <Input
                fluid
                onChange={this.handleChange}
                value={this.state.todoMessage}
                name="todoMessage"
                style={{ marginBottom: "0.1em" }}
                labelPosition="right"
                placeholder="Add a work"
                label={
                    <Button
                        icon="add"
                        onClick={this.handleSubmit}
                    />
                }
                />
            <div className='todoShow'>
                {
                    this.displayMessages(this.state.messages)
                }
            </div>
        </Segment>
    </React.Fragment>
      )
  }
}

export default Todo;