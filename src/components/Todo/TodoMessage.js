import React, { Component} from 'react'
import firebase from "../../firebase";
import './Todo.css'

class TodoMessage extends React.Component{
    state = {
        getTodoRef:firebase.database().ref("todos"),
        channel:this.props.channel,
        currentDate:new Date().toLocaleDateString(),
        date:this.props.message.date
      };



    removeMessage=messageId=>{
        this.state.getTodoRef.child(this.props.channel.id).child(messageId.key).remove();
    }
    render(){
        const {date,currentDate}=this.state;
        return(
            <div className={'message '+(date>currentDate?'green2':date===currentDate?'yellow2':'red2')}
            // style={
            //     date>currentDate?
            //     {backgroundColor:'#d0f0c0'}:
            //         date===currentDate?
            //             {backgroundColor:'#ffffe0'}
            //             :{backgroundColor:'linen'}}
                        onClick={()=>this.removeMessage(this.props.message)}>
                <p>{this.props.message.content}</p>
            </div>
        );
    }
}

export default TodoMessage;
