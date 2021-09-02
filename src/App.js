import React from "react";
import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "./aws-exports";
import "./App.css";
Amplify.configure(awsconfig);

class App extends React.Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          console.log(data);
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
          break;
        default:
          this.setState({ customState: "" });
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user) => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <button
          style={
            user == null
              ? { backgroundColor: "#4285f4", color: "white" }
              : { display: "none" }
          }
          onClick={() => Auth.federatedSignIn({ provider: "Google" })}
        >
          Login with Google
        </button>
        <button
          style={
            user
              ? { backgroundColor: "red", color: "white" }
              : { display: "none" }
          }
          onClick={() => Auth.signOut()}
        >
          Sign Out: {user ? user.username : "no user"}
        </button>
      </div>
    );
  }
}

export default App;
