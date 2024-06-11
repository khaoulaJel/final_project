<template>
    <div class="quiz-results">
      <h2>Quiz Results</h2>
      <p class="score">Your Score: {{ calculateScore }}%</p>
      <div v-for="(question, index) in quizQuestions" :key="index" class="question-result">
        <p>
          Question {{ index + 1 }}: 
          <span :class="{ correct: userAnswers[index] === question.correctAnswer, incorrect: userAnswers[index] !== question.correctAnswer }">
            {{ userAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect' }}
          </span>
        </p>
      </div>
      <button @click="retakeQuiz" class="retake-button">Retake Quiz</button>
    </div>
  </template>
  
  <script>

  import { projectFirestore, projectAuth } from '@/firebase/Config';


export default {
  props: {
    userAnswers: Array,
    quizQuestions: Array,
    quizId: String
  },
  computed: {
    calculateScore() {
      const correctAnswers = this.quizQuestions.filter((question, index) => {
        return this.userAnswers[index] === question.correctAnswer;
      });
      return (correctAnswers.length / this.quizQuestions.length) * 100;
    },
  },
  methods: {
    retakeQuiz() {
      this.$emit('retake-quiz');
    },
    async saveQuizResult() {
  const user = projectAuth.currentUser;
  if (user) {
    const userDoc = projectFirestore.collection('Users').doc(user.uid);
    try {
      const userSnapshot = await userDoc.get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        const quizResults = userData.quizResults || [];
        const newQuizResult = {
          quizId: this.quizId,
          date: new Date(),
          score: this.calculateScore(),
          answers: this.userAnswers
        };
        quizResults.push(newQuizResult);
        await userDoc.update({
          quizResults: quizResults
        });
        console.log('Quiz result saved successfully!');
      } else {
        console.error('User document does not exist');
      }
    } catch (error) {
      console.error('Error saving quiz result: ', error);
    }
  } else {
    console.error('User not authenticated');
  }
}

  },
  async mounted() {
    await this.saveQuizResult();
  }
};

  </script>
  
  <style scoped>
  .quiz-results {
    text-align: center;
  }
  
  .score {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .question-result {
    margin-bottom: 1rem;
    transition: transform 0.3s ease-in-out; 
  }
  
  .correct {
    color: #4caf50;
    transform: scale(1.1);
  }
  
  .incorrect {
    color: #f44336;
    transform: rotate(-5deg); 
  }
  
  .retake-button {
    margin-top: 1.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .retake-button:hover {
    background-color: #0056b3;
  }
  </style>
  