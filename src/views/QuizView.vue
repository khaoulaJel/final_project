<template>
    <AppLayout>
        <template v-slot:default>
            <div v-if="loading" class="loading">Loading quiz...</div>
            <div v-else-if="error" class="error">{{ error }}</div>
            <div v-else class="quiz-view" v-if="quiz">
                <h1 class="bold-title">{{ quiz.title }}</h1>
                <p>{{ quiz.description }}</p>
                <div class="question-box" v-if="currentQuestion">
                    <h2 class="bold-question">{{ currentQuestion.question }}</h2>
                    <div v-if="currentQuestion.type === 'multiple-choice'">
                        <div v-for="(option, index) in currentQuestion.options" :key="index">
                            <input
                                type="radio"
                                :id="'option-' + index"
                                :value="option"
                                v-model="userAnswers[currentIndex]"
                                :disabled="answerSubmitted"
                            />
                            <label :for="'option-' + index">{{ option }}</label>
                        </div>
                    </div>
                    <div v-else-if="currentQuestion.type === 'true-false'">
                        <input
                            type="radio"
                            id="true"
                            value="true"
                            v-model="userAnswers[currentIndex]"
                            :disabled="answerSubmitted"
                        />
                        <label for="true">True</label>
                        <input
                            type="radio"
                            id="false"
                            value="false"
                            v-model="userAnswers[currentIndex]"
                            :disabled="answerSubmitted"
                        />
                        <label for="false">False</label>
                    </div>
                    <div class="feedback" v-if="answerSubmitted">
                        <p v-if="answerCorrect" class="correct">
                            <span class="green-text">Hooray! Your answer is correct!</span>
                            <i class="fas fa-check-circle"></i>
                        </p>
                        <p v-else class="incorrect">
                            <span class="red-text">Oops! The correct answer is: {{
                                currentQuestion.correctAnswer
                            }}</span>
                            <i class="fas fa-times-circle"></i>
                        </p>
                    </div>
                    <button
                        @click="submitAnswer"
                        class="submit-button"
                        :disabled="answerSubmitted"
                    >
                        Submit
                    </button>
                    <button
                        @click="nextQuestion"
                        class="next-button"
                        :disabled="!answerSubmitted"
                    >
                        {{ isLastQuestion ? 'See Results' : 'Next Question' }}
                    </button>
                </div>
                <div v-if="isQuizCompleted">
                    <QuizResults
                        :userAnswers="userAnswers"
                        :quizQuestions="quiz.questions"
                        @retake-quiz="retakeQuiz"
                    />
                </div>
            </div>
        </template>
    </AppLayout>
</template>

<script>
import { getQuiz } from '@/firebase/getQuiz.js';
import AppLayout from '@/components/AppLayout.vue';
import QuizResults from '@/components/QuizResults.vue';
import { waitForAuthInit, projectAuth, projectFirestore } from '@/firebase/Config';

export default {
    name: 'QuizView',
    components: {
        AppLayout,
        QuizResults,
    },
    data() {
        return {
            quizId: this.$route.params.id,
            quiz: null,
            currentIndex: 0,
            userAnswers: [],
            loading: true,
            error: null,
            answerSubmitted: false,
            answerCorrect: false,
        };
    },
    computed: {
        currentQuestion() {
            return this.quiz?.questions[this.currentIndex];
        },
        isLastQuestion() {
            return this.currentIndex === this.quiz.questions.length - 1;
        },
        isQuizCompleted() {
            const bool = this.answerSubmitted && this.isLastQuestion;
            console.log(bool)
            if (bool) {
                saveQuizResult()
            }
            return bool;
        },
    },
    methods: {
    async fetchQuiz() {
        try {
            const { quiz, error, load } = getQuiz(this.quizId);
            await load();
            this.quiz = quiz.value;
            this.userAnswers = new Array(this.quiz.questions.length).fill(null);
            this.loading = false;
        } catch (error) {
            console.error('Error fetching quiz:', error);
            this.error = error.message;
        }
    },
    submitAnswer() {
        const userAnswer = this.userAnswers[this.currentIndex];
        const correctAnswer = this.currentQuestion.correctAnswer;

        if (userAnswer === correctAnswer) {
            this.answerCorrect = true;
        } else {
            this.answerCorrect = false;
        }

        this.answerSubmitted = true;

        this.saveQuizResult() // Ensure it's being called here
    },
    nextQuestion() {
        if (this.currentIndex < this.quiz.questions.length - 1) {
            if (this.answerSubmitted) {
                this.currentIndex++;
                this.answerSubmitted = false;
            }
        } else {
            console.log('Quiz finished', this.userAnswers);
            this.saveQuizResult(); // Ensure it's being called here too
        }
    },
    retakeQuiz() {
        this.currentIndex = 0;
        this.userAnswers = new Array(this.quiz.questions.length).fill(null);
        this.answerSubmitted = false;
        this.answerCorrect = false;
    },
    async saveQuizResult() {
        console.log('quiz finished');
        await waitForAuthInit();
        const user = projectAuth.currentUser;
        if (user) {
            const userDoc = projectFirestore.collection('Quizzes').doc(this.quizId);
            try {
                const userSnapshot = await userDoc.get();
                if (userSnapshot.exists) {
                    const userData = userSnapshot.data();
                    const usersanswers = userData.usersanswers || [];
                    const newQuizResult = {
                        quizId: this.quizId,
                        date: new Date(),
                        score: this.calculateScore(),
                        answers: this.userAnswers
                    };
                    usersanswers.push(newQuizResult);
                    await userDoc.update({
                        usersanswers: usersanswers
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
    },
},
    mounted() {
        this.fetchQuiz();
    },
};
</script>

<style scoped>
  
  input[type="radio"] {
    margin-right: 10px;
  }
  
  label {
    margin: 0.5rem 0;
    display: block;
    cursor: pointer;
  }
  
  .feedback {
    margin-top: 1rem;
    font-size: 1rem;
    padding: 1rem;
    border-radius: 10px;
  }
  
  .feedback .green-text {
    color: #4caf50;
    
  }
  
  .feedback .red-text {
    color: #f44336;
  }
  
  .loading, .error {
    font-size: 1.5rem;
    text-align: center;
    padding: 2rem;
  }
  
  .loading {
    color: #555;
  }
  
  .error {
    color: red;
  }
  
  .submit-button, .next-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-button:hover, .next-button:hover {
    background-color: #0056b3;
  }
  
  .next-button:disabled {
    background-color: #007bff;
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .question-box h2.bold-question {
    margin: 0 0 1rem 0;
    font-size: 1.5rem; /* Increased font size for questions */
    font-weight: bold; /* Added bold weight */
  }
  
  .bold-title {
    font-size: 1.8rem; /* Increased font size for title */
    font-weight: bold; /* Added bold weight*/
  }

  .quiz-view {

    padding: 2rem;
    font-family: Arial, sans-serif;
    color: #e9dfeb;
    background-color: #2f1c91;
    border-radius: 10px;
    max-width: 800px; /* Increased width for wider question box */
    margin: auto;
    width: 100%;
  }
  
  /* Ensures the quiz view takes up most of the available space */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    min-height: 100vh; /* Set minimum height for the entire page */
    display: flex;
    justify-content: center; /* Center the quiz view horizontally */
    align-items: center; /* Center the quiz view vertically */
  }
  
  .question-box {
    margin-top: 2rem;
    padding: 2rem;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 730px; /* Ensures full width within the quiz container */
    color:black;
  }
  
  
  </style>
  