import cuid from 'cuid';

export const uploadProfileImage = ({ firestore, firebase }, file) => async (
    dispatch,
    getState,
  ) => {
    console.log('This is image action firebase', firebase);
    const imageName = cuid();
    const user = firebase.auth().currentUser;
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(`${user.uid}/user_image/${imageName}`);
    // const path = `${user.uid}/user_images`;
    // const options = {
    //   name: imageName
    // };
  
    try {
      // upload the file to firebase storage
      // let uploadedFile = await firebase.uploadFile(path, file, null, options);
      // get url of image
      // let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
      // get userdoc
      let uploadFile = await imageRef.put(file[0]).then(snapshot => {
        console.log('this is uploadFile snapshot', snapshot);
        return snapshot.ref;
      });
      let downloadURL = await uploadFile.getDownloadURL();
      let userDoc = await firestore.get(`users/${user.uid}`);

      // check if user has photo, if not update profile with new image
      if (!userDoc.data().photoURL || userDoc.data().photoURL === '') {
        await firebase.updateProfile({
          photoURL: downloadURL
        });
        await user.updateProfile({
          photoURL: downloadURL
        });
      }
      // add the new photo to photos collection
      await firestore.add(
        {
          collection: "users",
          doc: user.uid,
          subcollections: [{ collection: "photos" }]
        },
        {
          name: imageName,
          url: downloadURL
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


  export const setMainPhoto = ({ firestore, firebase }, url) => async (
    dispatch,
    getState
  ) => {
    const user = firebase.auth().currentUser;
    console.log('This is setMainPhoto', url);
    try {
      await firebase.updateProfile({
        photoURL: url
      })

      await user.updateProfile({
        photoURL: url
      });

      
      await firestore
            .collection('users')
            .doc(`${user.uid}`)
            .set({ photoURL: url }, { merge: true })
  
    } catch (error) {
      console.log(error);
    }
  };

  export const deletePhoto = ({ firestore, firebase }, photoInfo, isMain) => async (
    dispatch,
    getState
  ) => {
    const storageRef = firebase.storage().ref();
    const user = firebase.auth().currentUser;
    const imageRef = storageRef.child(`${user.uid}/user_image/${photoInfo.name}`);
    try {
      await firebase.deleteFile(`${user.uid}/user_image/${photoInfo.name}`);
      // await imageRef.delete();
      if (isMain) {
        await firestore.set({
          collection: "users",
          doc: user.uid
        }, { photoURL: '' }, { merge: true })
      }

      await firestore.delete({
        collection: "users",
        doc: user.uid,
        subcollections: [
          {
            collection: "photos",
            doc: photoInfo.id
          }
        ]
      });
    } catch (error) {
      console.log(error);
      throw new Error("Problem deleting the photo");
    }
  };