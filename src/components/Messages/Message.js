import React from "react";
import moment from "moment";
import { Comment,Image } from "semantic-ui-react";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "";
};

const isImage=(message)=>{
  return !message.hasOwnProperty('type') && message.hasOwnProperty('image') && !message.hasOwnProperty('content');
}

const isPdf=(message)=>{
  return message.type=='pdf';
}
const openTab=(message)=>{
  if(message.type=='pdf'){
    window.open(message.pdflink);
  }
  else{
    window.open(message.image);
  }
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <div onClick={()=>openTab(message)} style={{margin:'10px'}} className='pdfmessage'>
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a">{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
      {isImage(message)? 
      <Image src={message.image} className='message__image'/>:
      <Comment.Text>{message.content}</Comment.Text>
      }
      {isPdf(message)?
      <Image src={message.image}/>:null}
      {
      isPdf(message)?
      <Comment.Text>{message.name}</Comment.Text>:null
      }
    </Comment.Content>
  </Comment>
    </div>
);

export default Message;