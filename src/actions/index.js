import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import db, { auth, provider, storage } from "../firebase";
import { GET_ARTICLES, SET_LOADING_STATUS, SET_USER } from "./actionType";

export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});

export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  articles: payload,
});

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});

export function signInAPI() {
  return (dispatch) => {
    signInWithPopup(auth, provider)
      .then((payload) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(payload);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = payload.user;
        console.log(payload);
        dispatch(setUser(user));
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        alert(
          "ERROR: " +
            errorCode +
            "\n" +
            errorMessage +
            "\nEmail: " +
            email +
            "\nCredentials: " +
            credential
        );
      });
  };
}

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutAPI() {
  return (dispatch) => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
}

export function postArticleAPI(payload) {
  let docRef = "";
  async function addDBRecord(payload, downloadURL) {
    // Add a new document with a generated id.
    docRef = await addDoc(collection(db, "articles"), {
      actor: {
        description: payload.user.email,
        title: payload.user.displayName,
        date: payload.timestamp,
        image: payload.user.photoURL,
      },
      video: payload.video,
      sharedImg: downloadURL,
      comment: "This is sample comment",
      description: payload.description,
    });
    return docRef;
  }

  return (dispatch) => {
    dispatch(setLoading(true));
    if (payload.image != "") {
      // Create a reference to 'images/mountains.jpg'
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const upload = uploadBytesResumable(storageRef, payload.image);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      upload.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress: ${progress}% done`);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => console.log(error.code),
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          //const downloadURL = await upload.snapshot.ref.getDownloadURL();
          const downloadURL = await getDownloadURL(upload.snapshot.ref);
          // Add a new document with a generated id.
          docRef = await addDBRecord(payload, downloadURL);
          console.log("Document written with ID: ", docRef.id);
          // stop spinning image - after loading process
          dispatch(setLoading(false));
        }
      );
    } else {
      addDBRecord(payload, "").then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        // stop spinning image - after loading process
        dispatch(setLoading(false));
      });
    }
    window.location.reload(false);
  };
}

export function getArticlesAPI() {
  async function getArticlesFromDB() {
    let articles = new Array();

    const q = query(collection(db, "articles"), orderBy("description"));
    await getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        // console.log(payload);
        articles.push(doc.data());
      });
    });
    return articles;
  }

  return (dispatch) => {
    /*

    */
    getArticlesFromDB().then((articleFromDB) => {
      console.log("articlesFromDB");
      console.log(articleFromDB);
      dispatch(getArticles(articleFromDB));
    });
  };
}
