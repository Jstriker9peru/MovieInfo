import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { Field, reduxForm } from 'redux-form';
import './SignUpModal.scss';

const renderTextField = (
    { input, label, type, meta: { touched, error } }
  ) => {
    return (
    <TextField
      variant="outlined"
      required
      fullWidth
      id={input.name}   
      label={label}
      error={touched && error}
      type={type}
      {...input}
    />
)};

const validate = values => {
    const errors = {};
    const requiredFields = [
     'firstName',
     'lastName',
     'email',
     'password'
    ];
    requiredFields.forEach(field => {
     if (!values[field]) {
       errors[field] = true;
     }
    });
    if (
     values.email &&
     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
     errors.email = true;
    }
    return errors;
 }

const SignUpModal = ({ invalid, handleSubmit, submitting }) => {
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            className="sign-in-modal"
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
         >
            <div className="sign-in-container">
                <div className="sign-in">
                    <Avatar className='lock'>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <form className='sign-in-form'>
                        <Grid className="grid" container spacing={0}>
                            <Grid className="grid-item" item xs={12} sm={6}>
                                <Field name="firstName" label="First Name" component={renderTextField} type="text" />
                            </Grid>
                            <Grid className="grid-item" item xs={12} sm={6}>
                                <Field name="lastName" label="Last Name" component={renderTextField} type="text" />    
                            </Grid>
                            <Grid className="grid-item" item xs={12}>
                                <Field name="email" label="Email Address" component={renderTextField} type="email" />
                            </Grid>
                            <Grid className="grid-item bottom" item xs={12}>
                                <Field name="password" label="Password" component={renderTextField} type="password" />
                            </Grid>
                            <Grid className="grid-item" item xs={12}>    
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className="submit-btn"
                                    disabled={invalid || submitting}
                                >
                                    Sign Up
                                </Button>
                            </Grid>
                            <Grid className="grid-item" item>
                                <Link href="#" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>   
                </div>
            </div>
         </Modal>
    )
}

export default reduxForm({
    form: 'SignUp',
    validate
})(SignUpModal);
