import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { BrowserRouter as Router,Switch,Route } from 'react-router-dom';

const Root=()=>(
  <Router>
    <Switch>
      <Route exact path='/' component={App}/>
      <Route path='/login' component={Login}/>
      <Route path='/register' component={Register}/>
    </Switch>
  </Router>
)

ReactDOM.render(
  <Root>
    
  </Root>,
  document.getElementById('root')
);

reportWebVitals();
