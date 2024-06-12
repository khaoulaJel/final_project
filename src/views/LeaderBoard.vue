<template>
    <div>
      <h1>Leaderboard</h1>
      <ul v-if="!loading && leaderboard">
        <li v-for="(entry, index) in leaderboard" :key="entry.userId">
          {{ entry.displayName }}: {{ entry.totalScore }}
        </li>
      </ul>
      <p v-if="loading">Loading...</p>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { getUserById } from './userData'; 
  
  export default {
    name: 'QuizLeaderboard',
    data(){
        return {
            Quizzes= []
        }
    }
    setup() {
        

      const loading = ref(true);
      const error = ref(null);
      const leaderboard = computed(() => {
        const scores = {};
  
        this.quizzes.forEach(quiz => {
          quiz.useranswers.forEach(answer => {
            if (!scores[answer.userId]) {
              scores[answer.userId] = {
                userId: answer.userId,
                totalScore: 0,
                displayName: '', // Default empty, will fetch later
              };
            }
            scores[answer.userId].totalScore += answer.score;
          });
        });
  
        const sortedScores = Object.values(scores).sort((a, b) => b.totalScore - a.totalScore);
        return sortedScores;
      });
  
      // Fetch display names
      const fetchDisplayNames = async () => {
        try {
          for (const user of Object.values(scores)) {
            const userDetails = await getUserById(user.userId);
            user.displayName = userDetails.displayName; // Assuming getUserById returns an object with displayName
          }
        } catch (e) {
          error.value = 'Failed to fetch user details';
        }
        loading.value = false;
      };
  
      onMounted(async () => {
        await fetchDisplayNames();
      });
  
      return { loading, error, leaderboard };
    }
  };
  </script>