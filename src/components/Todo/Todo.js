import React from 'react'
import { Button, Input,Segment } from "semantic-ui-react";
import TodoMessage from './TodoMessage';
import firebase from "../../firebase";
import './Todo.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from './CustomInput';



class Todo extends React.Component {
  constructor(props){
    super(props)
  this.state= {
    channel: this.props.channel,
    getTodoRef:firebase.database().ref("todos"),
    todoMessage:'',
    messages:[],
    startDate: new Date(),
    datePickerIsOpen: false
  };
  this.openDatePicker = this.openDatePicker.bind(this)
  this.handleChange2=this.handleChange2.bind(this)
  }
componentDidMount(){
    const {channel}=this.state;
    if(channel){
        this.addListeners(channel.id);
    }
}
  
  addListeners = channelId => {
    this.addMessageListener(channelId);
    this.addDeleteMessageListener(channelId);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  openDatePicker() {
    this.setState({
      datePickerIsOpen:!this.state.datePickerIsOpen
    })
  };

  handleSubmit=()=>{

    const newTodoRef=this.state.getTodoRef.child(this.state.channel.id).push();
    const key=newTodoRef.key;
    const date=this.state.startDate.toLocaleDateString();
    newTodoRef.set({
      content:this.state.todoMessage,
      timestamp:firebase.database.ServerValue.TIMESTAMP,
      key:key,
      date:date
    }).then(()=>{
      this.setState({
        todoMessage:""
    })
    })
    .catch(err=>{})
    
  }    
  addDeleteMessageListener=channelId=>{
    const ref = this.state.getTodoRef;
    ref.child(channelId).on("child_removed", snap => {
      this.addMessageListener(channelId);
    });
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
    console.log(this.state.messages);
    if(this.state.messages.length==1){
      console.log("empty");
    }
};


handleChange2(date) {
  this.setState({
    startDate: date,
    datePickerIsOpen:false
  });
}


displayMessages = messages =>
messages.length > 0 &&
messages.map(message => (
  <TodoMessage
    message={message}
    channel={this.state.channel}
  />
));


  render(){
      return(
    <React.Fragment>
        <Segment>
            <div style={{width: '249px',marginBottom:'10px'}}>
              <div style={{float: 'left', width: '83px'}}>
                <h3>Todo</h3>
              </div>
              <div style={{float: 'left', width: '136px'}}>
                <DatePicker
                  popperPlacement='up'
                  selected={this.state.startDate}
                  onChange={this.handleChange2}
                  onClickOutside={this.openDatePicker}
                  open={this.state.datePickerIsOpen}
                  customInput={<CustomInput/>}
                  dateFormat='dd/MM/y'
                />
              </div>
              <div style={{float: 'left', width: '30px'}}>
                <button style={{border:'none',padding:'10px',backgroundColor:'#E8E8E8'}} onClick={this.openDatePicker}>
                ⏰
                </button>
              </div>
              <br style={{clear:'left'}} />
            </div>
            <Input className='todoInput'
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
                        className='todoOk'
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