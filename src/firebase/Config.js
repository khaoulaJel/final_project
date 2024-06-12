import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2Yiu2oQs_Ai85i6qpQ_5Is0PovFCdWkw",
  authDomain: "js-project-a0dca.firebaseapp.com",
  projectId: "js-project-a0dca",
  storageBucket: "js-project-a0dca.appspot.com",
  messagingSenderId: "507313056295",
  appId: "1:507313056295:web:35b5f45435f1f8fd317c02",
  measurementId: "G-DP2T91WC56"
};


firebase.initializeApp(firebaseConfig);

const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const waitForAuthInit = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = projectAuth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();

export { projectAuth, projectFirestore, googleProvider, githubProvider, facebookProvider,waitForAuthInit };
