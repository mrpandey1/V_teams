import React from 'react'
import { Grid } from 'semantic-ui-react'
import { connect } from "react-redux";
import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import './App.css'
const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor,secondaryColor }) => (
  <Grid columns="equal" className="app" style={{ background: secondaryColor }}>
      <ColorPanel 
        key={currentUser && currentUser.name}
        currentUser={currentUser}
      />
    <SidePanel
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
      primaryColor={primaryColor}
    />
      <Messages/>
      {/* <button onClick={firebase.auth().signOut()}>

      </button> */}
    </Grid>
);
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  primaryColor: state.colors.primaryColor,
  secondaryColor: state.colors.secondaryColor
});

export default connect(mapStateToProps)(App);