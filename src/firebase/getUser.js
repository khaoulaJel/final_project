import { ref } from 'vue';
import { projectFirestore, projectAuth } from "@/firebase/Config";

const user = ref(projectAuth.currentUser);
let authInitialized = false;
let authResolve;

const authReady = new Promise(resolve => {
  authResolve = resolve;
});

projectAuth.onAuthStateChanged(_user => {
  console.log('User state change. Current user is:', _user);
  user.value = _user;
  authInitialized = true;
  authResolve(); 
});

const getUser = () => {
  return user;
}

const isLogged = () => {
  return !!user.value;
}

const waitForAuthInit = () => {
  if (authInitialized) {
    return Promise.resolve();
  }
  return authReady;
}

const getUserRole = async () => {
  await waitForAuthInit(); 
  const currentUser = getUser();
  if (currentUser) {
    const userData = await projectFirestore.collection('Users').doc(currentUser.uid).get();
    return userData.data().role;
  } else {
    return null;
  }
};

export { getUser, isLogged, waitForAuthInit, getUserRole };
