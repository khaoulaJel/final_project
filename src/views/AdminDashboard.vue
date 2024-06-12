<template>
  <AppLayout>
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div v-if="quizzes.length === 0" class="no-quizzes">
        <p>No quizzes available.</p>
      </div>
      <div v-else>
        <div v-for="quiz in quizzes" :key="quiz.id" class="quiz-item">
          <h2>{{ quiz.title }}</h2>
          <p>{{ quiz.description }}</p>
          <div>
            <button @click="deleteQuiz(quiz.id)" class="delete-btn">Delete</button>
            <router-link :to="{ name: 'EditQuiz', params: { id: quiz.id } }" class="edit-btn">Edit</router-link>
          </div>
        </div>
      </div>
      <router-link v-if="isAdmin" to="/add-quiz" class="add-quiz-link">Add Quiz</router-link>
    </div>
  </AppLayout>
</template>

<script>
import { projectFirestore, projectAuth } from '@/firebase/Config';
import AppLayout from '@/components/AppLayout.vue';

export default {
  components: {
    AppLayout,
  },
  data() {
    return {
      quizzes: [],
      isAdmin: false,
    };
  },
  async created() {
    await this.fetchQuizzes();
  },
  methods: {
    async fetchQuizzes() {
      const snapshot = await projectFirestore.collection('Quizzes').get();
      this.quizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const user = projectAuth.currentUser;
      if (user) {
        const userDoc = await projectFirestore.collection('Users').doc(user.uid).get();
        if (userDoc.exists) {
          this.isAdmin = userDoc.data().admin;
        }
      }
    },
    async deleteQuiz(quizId) {
      try {
        await projectFirestore.collection('Quizzes').doc(quizId).delete();
        this.quizzes = this.quizzes.filter(quiz => quiz.id !== quizId);
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #210647;
}

.quiz-item {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}

.delete-btn, .edit-btn {
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  margin-right: 10px;
}

.delete-btn:hover, .edit-btn:hover {
  background-color: #3700B3;
}

.add-quiz-link {
  display: inline-block;
  margin-top: 20px;
  color: #6200EE;
  text-decoration: none;
  font-size: 18px;
}

.no-quizzes {
  font-size: 20px;
  color: #555;
  text-align: center;
}
</style>
