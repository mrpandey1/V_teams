import React, { Component} from 'react'
import firebase from "../../firebase";
import './Todo.css'

class TodoMessage extends React.Component{
    state = {
        getTodoRef:firebase.database().ref("todos"),
      };
    removeMessage=messageId=>{
        console.log(messageId);
    }
    render(){
        return(
            <div className='message' onClick={()=>this.removeMessage(this.props.message)}>
                <p>{this.props.message.content}</p>
            </div>
        );
    }
}

export default TodoMessage;
