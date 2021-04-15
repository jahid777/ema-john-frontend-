import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../firebase.config";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router-dom";

firebase.initializeApp(firebaseConfig); //from documentation
//by default useState e empty object rkhr jnno ...jhtu authorize kore user e empty object jcce
function Login() {
  const [newUser, setNewUser] = useState(false); //jhtu ekta user tai false...for toggle checkbox
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    error: "",
    password: "",
  });

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  //niser kaj ghula kora hoise login ar por jekhane jayte nisilam sekhane powce daoa
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const handleSignin = () => {
    const googleprovider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(googleprovider) //google r ontorgoto firebase auth popup use kore amra sign in korar system ta k call korchi
      .then((res) => {
        //ora response ta k json format ei dey tai amdr r res.json korar proyojon hyni
        const { displayName, photoURL, email } = res.user; //res e thaka user r property gulo destructure
        const signedInUser = {
          //signedInUser ekti object
          isSignedInUser: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUserToken();
        setUser(signedInUser);
        setLoggedInUser(signedInUser); //context ar state ar moddde setLoggedInUsera newUserInfo set kore dialm
        history.replace(from); // log in korer por jekane jete chay sekhne nia jabe
      })

      .catch((err) => {
        //kno karon e error kheye gele amra console log korchi
        console.log(err);
        console.log(err.message);
      });
  };

  const setUserToken = () => {
    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(function (idToken) {
        sessionStorage.setItem("token", idToken);
      })
      .catch(function (error) {
        // Handle error
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut() //call kora holo signout k firebase r auth thke
      .then((res) => {
        //jdi ei response orthat signOut ta success hy thle body te dhuke return krbe
        const signedOutUser = {
          //jhtu signout tai user r kno info thkbe na ,,,shob empty hbe tai
          isSignedIn: false,
          name: "",
          photo: "",
          password: "", //dhore nilam by default password hcce empty string
          email: "",
          error: "",
          success: false,
        };

        setUser(signedOutUser); //empty user pass kora holo
      })

      .catch((err) => {});
  };
  //user jdi already signed in thake thle ? er por statement ti run krbe orthat signout dekhabe..r condition opposite hle sign in krbe
  //trpor signed in hye 64 num line thke execute krte strt krbe
  const handleBlur = (e) => {
    let isFieldValid = true; //by default dhre nilam form ta valid

    if (e.target.name === "email") {
      //jdi input name email hy thle ekvabe validate koro..jhtu input name string tai === 'email'
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value); //regular expression diye checking email valid kina
      //orthat regular expression r sthe value mile gele isformValid r man hbe true..otherwise invalid orthat false
    }

    if (e.target.name === "password") {
      //ager line r moto
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value); //regular expression diye check..at least ekta num thkte hbe
      isFieldValid = passwordHasNumber && isPasswordValid; //duita case fullfill hlei pass valid hbe orthat true...otherwise invalid/false
    }
    //ekhn email ba pass jetai change kore blur kora hokk handleBlur k call korbe ebong ebong email hle email,r pass hle pass jdi valid hy then next if e jbe
    if (isFieldValid) {
      let newUserInfo = { ...user }; //user e ja ja property chilo amra newUserInfo te copy korlam..newUserInfo ekta object ekhane
      newUserInfo[e.target.name] = e.target.value; //ekhn user r name or pass jdi change kora hy tahole newUserInfo[password/email] = password/email r value;update hye user e add hbe upore
      setUser(newUserInfo); //user e set kora
    }
  };

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      //jdi newUser true hy ebong ei duita value valid hye thkle checked hye tbei tmr submit ta hbe..amra email ebong pass r value peye state update korci
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user }; //user ekti object so...newuserInfo hcce object
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })

        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user }; //user ekti object so...newuserInfo hcce object
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo); //context ar state ar moddde setLoggedInUsera newUserInfo set kore dialm
          history.replace(from); // log in korer por jekane jete chay sekhne nia jabe
          console.log("Sign in user info", res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault(); //default behaviour avoid krar jnno
  };

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        //user.updateProfile hcce ekta object
        displayName: name,
      })
      .then(function () {
        console.log("user name updated successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const boxDesign = {
    height: "50px",
    width: "300px",
    margin: "15px",
  };

  return (
    <div style={{ textAlign: "center", margin: "15px" }}>
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>
          <h3>Sign Out</h3>
        </button>
      ) : (
        <button onClick={handleSignin}>
          <h3>Sign In</h3>
        </button>
      )}

      {
        (user.isSignedIn = true && (
          <div>
            <h1>Welcome: {user.name}</h1>
            <h1>Email: {user.email}</h1>
            <img src={user.photo} alt="" />
          </div>
        ))
      }

      <h1>Our own authentication</h1>
      {/* !newUser er mane holo aghe jdi newUser ta true thake false koro..false hole true orthat toggle */}
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        in=""
      />
      {/* newUser toggle howa mame tru false true false howa r nicher line gula change howa */}
      <label htmlFor="newUser">new User Sign Up</label>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p>
      {/* form r action hcce onSubmit */}
      <form onSubmit={handleSubmit}>
        {
          //newuser true hlei input field ta dkhaba setNewUser call kore kore true r false kora hcche..
          newUser && (
            <input
              style={boxDesign}
              name="name"
              type="text"
              onBlur={handleBlur}
              placeholder="Your Name"
            />
          )
        }
        <br />
        {/* onchange use kora mane input field tir kno kcu change hle ekta event hbe r event ti holo tar mddhe parameter hisebe thaka handleChange function call kora */}
        <input
          style={boxDesign}
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Your Email Address"
          required
        />
        <br />
        {/* required use kora hyece duti tag e ..use na korle submit hbe na er jnno */}
        <input
          style={boxDesign}
          type="password"
          onBlur={handleBlur}
          name="password"
          id=""
          placeholder="Password"
          required
        />
        <br />
        {/* input hisebe submit puro form ta k puron kore submit nibe..ja btn submit kore na..r eta form tag r vitor hlei kj krbe  */}
        <input
          style={boxDesign}
          type="submit"
          value={newUser ? "Sign Up" : "Sign In"}
        />
      </form>
      <p style={{ color: "red" }}>{user.error}</p>
      {user.success && (
        <p style={{ color: "Green" }}>
          User {newUser ? "Created" : "Loggen In"} Sussessfully
        </p>
      )}
    </div>
  );
}

export default Login;
