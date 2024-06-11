import { projectAuth } from "@/firebase/Config"
import { ref } from "vue";

const error = ref(null);

const login = async (email, password) => {
    error.value = null;
    try {
        const response = await projectAuth.signInWithEmailAndPassword(email, password);
        error.value = true;
        console.log('Login successful:', response.user);
        return response.user; 
    } catch (err) {
        alert(err)
        error.value = err    
    }
}
const useLogin = () => {
    return { error, login };
}

export default useLogin;



