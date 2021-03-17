import React, { useState } from 'react';
import './App.css'; // Basic styling
import './content.css'; // Styling for Formbox & Databox components
import './login.css'; // Styling for the Login component

import Formbox from './Formbox';
import Databox from './Databox';
import { useForm } from "react-hook-form"; // Form validation module
import logo from './UEF_logo.jpg'; 

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

/*
  Login component contains the login page and the *dummy* logic for loggin in.
  App component sends the needed parameters to child components and renders the main components.
*/

function Login({ Email, setEmail }) {
  const { register, handleSubmit } = useForm();

  let [passwrd, setPasswrd] = useState('');
  let history = useHistory();

  const onSubmit = data => {
    data.passwrd = passwrd;
    Email = Email.substring(0, Email.indexOf('@')); // Get username from email
    data.Email = Email;
    setEmail(Email);    
    history.push('/') // Navigate to the main page
  }

  return (
    <div className="logincontainer">

      <div className="logotitle">
        <img className="logo" src={logo} alt=""></img>
        <h4 className="title">Kansanterveystieteen perusteet -Unipäiväkirja</h4>
      </div>

      <div className="loginbox">        
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Käyttäjätunnus:</label>
            <br></br>
            <input
              placeholder="@UEF.fi-sähköposti"
              name="Email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
              ref={register({ required: true },{ name: 'Email', value: Email })}   
              
            ></input>
            <br></br>
            <label>Salasana:</label>
            <br></br>
            <input
              name="passwrd"
              type="password"
              onChange={(e) => setPasswrd(e.target.value)}
              value={passwrd}
              ref={register({ required: true },{ name: 'passwrd', value: passwrd })}              
              
            ></input>
            <br></br>
            <button className="buttonstyling" type="submit">Kirjaudu</button>
          </form>
     
      </div>
    </div>
  );
}

function App() {

  let [isupdated, setIsupdated] = useState(false); // For the components (Formbox & Databox) to know if the data has been updated
  let [modifiedId, setModifiedId] = useState(); // For the components to know what observation would the user want to modify
  let [Email, setEmail] = useState(''); // For the components to know the username of who is using the app.

  return (
    <Router>
      <Switch>
        <Route path='/login'>
          <Login Email={Email} setEmail={setEmail} />
        </Route>
        <Route path='/'>
          <div className="container">
            <div className="header">
              <h2 className="headertext">Kansanterveystieteen perusteet -Unipäiväkirja</h2>            
              <Link to="/login" className="logoutbtn">Kirjaudu ulos</Link>
            </div>
            <div className="content">
              <Formbox setIsupdated={setIsupdated} modifiedId={modifiedId} Email={Email} />
              <Databox isupdated={isupdated} setModifiedId={setModifiedId} Email={Email} />
            </div> 
          </div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
