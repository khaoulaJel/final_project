<template>
    <AppLayout>
      <div class="edit-quiz">
        <h1>Edit Quiz</h1>
        <form @submit.prevent="editQuiz">
          <div>
            <label for="title">Quiz Title:</label>
            <input type="text" v-model="title" id="title" required />
          </div>
          <div>
            <label for="category">Category:</label>
            <input type="text" v-model="category" id="category" required />
          </div>
          <div>
            <label for="description">Description:</label>
            <textarea v-model="description" id="description" required></textarea>
          </div>
          <div>
            <label for="difficulty">Difficulty:</label>
            <select v-model="difficulty" id="difficulty" required>
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div v-for="(question, index) in questions" :key="index" class="question">
            <label>Question {{ index + 1 }}:</label>
            <input type="text" v-model="question.text" placeholder="Question text" required />
            <label>Question Type:</label>
            <select v-model="question.type">
              <option value="multiple">Multiple Choice</option>
              <option value="truefalse">True/False</option>
            </select>
            <template v-if="question.type === 'multiple'">
              <label>Possible Answers:</label>
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input type="text" v-model="question.options[optionIndex]" :placeholder="'Option ' + (optionIndex + 1)" required />
              </div>
              <label>Correct Answer:</label>
              <select v-model="question.answer">
                <option v-for="(option, optionIndex) in question.options" :key="optionIndex" :value="option">{{ option }}</option>
              </select>
            </template>
            <template v-else-if="question.type === 'truefalse'">
              <label>Correct Answer:</label>
              <select v-model="question.answer">
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </template>
            <button type="button" @click="removeQuestion(index)">Remove</button>
          </div>
          <button type="button" @click="addQuestion">Add Question</button>
          <button type="submit">Save Changes</button>
          <div v-if="error">{{ error }}</div>
          <div v-if="success">{{ success }}</div>
        </form>
      </div>
    </AppLayout>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { projectFirestore } from '@/firebase/Config';
  import AppLayout from '@/components/AppLayout.vue';
  
  export default {
    components: {
      AppLayout,
    },
    props: {
      quizId: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const title = ref('');
      const category = ref('');
      const description = ref('');
      const questions = ref([{ text: '', type: 'multiple', options: ['', ''], answer: '' }]);
      const difficulty = ref('');
      const error = ref(null);
      const success = ref(null);
  
      const fetchQuiz = async () => {
        const doc = await projectFirestore.collection('Quizzes').doc(props.quizId).get();
        if (doc.exists) {
          const data = doc.data();
          title.value = data.title;
          category.value = data.category;
          description.value = data.description;
          difficulty.value = data.difficulty;
          questions.value = data.questions;
        } else {
          error.value = 'Quiz not found';
        }
      };
  
      const addQuestion = () => {
        questions.value.push({ text: '', type: 'multiple', options: ['', ''], answer: '' });
      };
  
      const removeQuestion = (index) => {
        questions.value.splice(index, 1);
      };
  
      const editQuiz = async () => {
        error.value = null;
        success.value = null;
        try {
          await projectFirestore.collection('Quizzes').doc(props.quizId).update({
            title: title.value,
            category: category.value,
            description: description.value,
            difficulty: difficulty.value,
            questions: questions.value,
          });
          success.value = 'Quiz updated successfully';
        } catch (err) {
          error.value = 'Failed to update quiz';
        }
      };
  
      fetchQuiz();
  
      return {
        title,
        category,
        description,
        questions,
        difficulty,
        error,
        success,
        addQuestion,
        removeQuestion,
        editQuiz,
      };
    },
  };
  </script>
  
  <style scoped>
  .edit-quiz {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  form div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  
  button {
    background-color: #5c6bc0;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin-top: 10px;
    margin-right: 10px;
  }
  
  button:hover {
    background-color: #3700B3;
  }
  
  .question {
    margin-bottom: 15px;
  }
  
  .question button {
    background-color: #5c6bc0;
  }
  
  .question button:hover {
    background-color: #D50000;
  }
  </style>
  