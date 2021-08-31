import React from "react";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Icon,
  Message
} from "semantic-ui-react";

class EmailNotVerified extends React.Component {
    state = {
        sent: false,
        loading:false
      };
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user=>{
            if(user){}else{
                this.props.history.push('/login');
            }
        })
    }
    handleLogout=()=>{
        firebase.auth().signOut();
    }
    handleVerification=()=>{

        firebase.auth().currentUser.sendEmailVerification()
        .then(()=>{
            this.setState({
                sent:true,
            })
        })
    }
  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h3" icon color="violet" textAlign="center">
            <Icon name="envelope open" color="violet" />
            Email Not Verified
          </Header>
          <Form size="large">
            <Segment>
                <Message>
                  {firebase.auth().currentUser.email}
                </Message>
                <Button
                // disabled={loading}
                // className={loading ? "loading" : ""}
                onClick={this.handleVerification}
                color="violet"
                fluid
                size="large"
              >
                Verify
              </Button>
              <br></br>      
                <Button
                // disabled={loading}
                // className={loading ? "loading" : ""}
                onClick={this.handleLogout}
                color="violet"
                fluid
                size="large"
              >
                Change Email
              </Button>
              
            {this.state.sent ? <Message success>
              <h3>Verification Link Sent</h3>
            </Message>:<p></p>}
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default EmailNotVerified;