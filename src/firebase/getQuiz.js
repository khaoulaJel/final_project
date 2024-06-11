import firebase from "firebase/app";
import "firebase/firestore";
import { projectFirestore } from "@/firebase/Config.js";
import { ref } from "vue";

const getQuiz = (id) => {
  const quiz = ref({});
  const error = ref(null);

  const load = async () => {
    try {
      const res = await projectFirestore.collection("Quizzes").doc(id).get(); // Updated collection name to "quizzes"
      if (!res.exists) {
        throw Error("That quiz does not exist");
      }
      quiz.value = { ...res.data(), id: res.id };
    } catch (err) {
      error.value = err.message;
    }
  };

  return { quiz, error, load };
};

const getQuizzesByIds = (ids) => {
  const quizzes = ref([]); // Changed variable name from "quizs" to "quizzes"
  const error = ref(null);

  const load = async () => {
    try {
      const querySnapshot = await projectFirestore
        .collection("Quizzes") // Updated collection name to "quizzes"
        .where(firebase.firestore.FieldPath.documentId(), "in", ids)
        .get();

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      quizzes.value = documents;
    } catch (err) {
      error.value = err.message;
    }
  };

  return { quizzes, error, load };
};

export { getQuiz, getQuizzesByIds };
