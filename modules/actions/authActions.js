import { SubmissionError } from "redux-form";
import { closeModal, openModal } from "./modalActions";
import { FETCH_USER, LOGOUT, FORM_ERROR } from "./authConstants";

export const SignIn = ({ firebase }, creds) => {
  return async dispatch => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(creds.email, creds.password)
        .then(user => {
          dispatch(closeModal());
          dispatch(formError(null));
        })
        .catch(error => {
          dispatch(formError(error));
          dispatch(closeModal());
          throw new SubmissionError({
            _error: error.message
          });
        });
    } catch (error) {
      dispatch(openModal("SignInModal"));
      console.log("SignIn Unsuccessful");
    }
  };
};

export const SignUp = ({ firestore, firebase }, user) => async dispatch => {
  try {
    // create the user in auth
    let createdUser = await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password);
    // update the auth profile
    await createdUser.user.updateProfile({
      displayName: user.firstName,
      lastName: user.lastName
    });
    // create a new profile in firestore
    let newUser = {
      displayName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: "",
      country: "",
      createdAt: firestore.FieldValue.serverTimestamp()
    };
    await firestore.set(`users/${createdUser.user.uid}`, { ...newUser });
    dispatch(closeModal());
    dispatch(formError(null));
  } catch (error) {
    console.log("Error inside signup function", error);
    dispatch(formError(error));
  }
};

export const fetchUser = ({ firestore }, user) => {
  return async dispatch => {
    // Get User data
    let userInfo = await firestore
      .collection("users")
      .doc(`${user.uid}`)
      .get()
      .then(doc => {
        return doc.data();
      })
      .catch(error => console.log("firestore userInfo error", error));
    dispatch({ type: FETCH_USER, payload: userInfo });
  };
};

export const updateProfile = ({ firestore, firebase }, values) => {
  return async dispatch => {
    try {
      // Get current user
      const user = firebase.auth().currentUser;
      // Update user profile
      await user.updateProfile({
        displayName: values.displayName,
        lastName: values.lastName
      });
      await firestore
        .collection("users")
        .doc(`${user.uid}`)
        .set(values, { merge: true })
        .then(() => {
          window.location.reload();
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log("This is an update profile error", error);
    }
  };
};

export const logOut = () => {
  return {
    type: LOGOUT
  };
};

export const formError = error => {
  return {
    type: FORM_ERROR,
    payload: error
  };
};
