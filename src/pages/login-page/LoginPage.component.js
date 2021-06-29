import React, { useState, useEffect } from "react";
import { Modal, Typography, Box, TextField, Button } from "@material-ui/core";
import Alert from "../../components/alert/Alert.component";
import {useAuth} from "../../context/auth-context";
import firebase from "../../firebase/firebase.utils";
import { useHistory } from "react-router";
import { doesPhoneNumberExist } from "../../services/firebase.services";
import useStyles from "./LoginPage.styles";

const SignInPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {currentUser} = useAuth();

  useEffect(()=>{
    if(!currentUser){
      history.push("/login");
    }else{
      history.push("/")
    }
  },[currentUser])

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async(e) => {
    e.preventDefault();
    let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
    const phoneNumberExists = doesPhoneNumberExist(phoneNumber);

    if(phoneNumberExists){
      try {
        setError('');
        setLoading(true);
        await firebase.auth().signInWithPhoneNumber("+91"+phoneNumber, recaptcha).then((e)=>{
              let code = prompt("Enter OTP ", "");
           
              if(code === null)return;
              e.confirm(code).then(function(result){
                  alert("Phone Number verified");
              })
        }).catch(err=>console.log(err))
    
      } catch (error){
        setError("")
        setLoading(false);
      }
      
    }else{
      setError("You don't have an account. Please register")
    }
   
  };
  return (
    <div>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        className={classes.modal}
        // container={() => rootRef.current}
      >
        <div className={classes.paper}>
          <Typography variant="h6" color="primary" className={classes.header}>
            Login with your Phone Number
          </Typography>
          <Box>
            <Alert errorMsg={error}/>
          </Box>
          <form onSubmit={onSubmit}>
            <Box display="flex" justifyContent="center" mt={2}>
            <TextField
            label="Phone Number"
            id="outlined-size-normal"
            variant="outlined"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e.target.value)}
            className={classes.text}
          />
          <Button color="primary" type="submit" className={classes.button}>Sign In</Button>
          </Box>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SignInPage;
