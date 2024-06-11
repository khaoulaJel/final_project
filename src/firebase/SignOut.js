import { projectAuth } from "@/firebase/Config";

const signOut = async () => {
  try {
    await projectAuth.signOut();
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export default signOut;
