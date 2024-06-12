import { projectFirestore, projectAuth } from "@/firebase/Config";
import { ref } from "vue";

const error = ref(null);

const signup = async (email, password, displayName) => {
    error.value = null;
    try {
        const response = await projectAuth.createUserWithEmailAndPassword(email, password);

        const newUserData = {
            createdAt: new Date(),
            displayName: displayName,
            email: email,
            admin: false,
            quizResults: [] 
        };
        await projectFirestore.collection('Users').doc(response.user.uid).set(newUserData);

        await response.user.updateProfile({ displayName: displayName });
        error.value = null;
        return response;
    } catch (err) {
        console.log(err);
        error.value = err.message;
        throw err;
    }
};

const useSignup = () => {
    return { error, signup };
};

export default useSignup;
