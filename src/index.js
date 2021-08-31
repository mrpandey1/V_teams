import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import 'semantic-ui-css/semantic.min.css'
import firebase from './firebase';
import { createStore } from 'redux';
import { Provider,connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { BrowserRouter as Router,Switch,Route,withRouter } from 'react-router-dom';
import EmailNotVerified from './components/auth/EmailNotVerified';
import rootReducer from './reducers/index'
import {setUser} from './actions'
import Spinner from './Spinner';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        if(user.emailVerified){
          this.props.setUser(user);
          this.props.history.push('/');
        }else{
          this.props.history.push('/verifyEmail');
        }
      }else {
        this.props.history.push("/login");
      }
    })
  }
  render(){
    return this.props.isLoading ?<Spinner/>:(
      <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route path='/verifyEmail' component={EmailNotVerified}/>
      </Switch>
    );
  }
}
const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(
  connect(
    mapStateFromProps,
    { setUser }
  )(Root)
);
ReactDOM.render(
  <Provider store={store}>
  <Router>
    <RootWithAuth/>
  </Router>
  </Provider>,
  document.getElementById('root')
); 

reportWebVitals();
