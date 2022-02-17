import React, { Component } from 'react'
import './Todo.css'
const TodoMessage = ({ message}) => (
    <p className='message'>
        {message.content}
    </p>
);


export default TodoMessage;