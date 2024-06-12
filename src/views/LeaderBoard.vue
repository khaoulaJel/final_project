<template>
  <AppLayout>
    <div class="leaderboard">
      <h1>Leaderboard</h1>
      <div v-if="loading" class="loading">Loading leaderboard...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in sortedLeaderboard" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ entry.user }}</td>
              <td>{{ entry.score }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { projectFirestore } from '@/firebase/Config.js';
import AppLayout from '@/components/AppLayout.vue';

export default {
  name: 'Leaderboard',
  data() {
    return {
      leaderboard: [],
      loading: true,
      error: null,
    };
  },
  computed: {
    sortedLeaderboard() {
      return this.leaderboard.sort((a, b) => b.score - a.score);
    },
  },
  created() {
    this.fetchLeaderboard();
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const snapshot = await projectFirestore.collection('Quizzes').get();
        let leaderboardData = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.usersanswers) {
            data.usersanswers.forEach(answer => {
              leaderboardData.push({
                user: data.userId,
                score: answer.score,
              });
            });
          }
        });
        this.leaderboard = leaderboardData;
      } catch (error) {
        this.error = 'Failed to load leaderboard';
        console.error('Error fetching leaderboard:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.leaderboard {
  padding: 2rem;
  background-image: url('@/assets/bgMain.png');
}

.leaderboard h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #6A0DAD; 
}

.loading, .error {
  font-size: 1.5rem;
  color: #555;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th, .leaderboard-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.leaderboard-table th {
  background-color: #6A0DAD; 
  color: #fff; 
}

.leaderboard-table td {
  background-color: #D1C4E9; 
}

.leaderboard-table tbody tr:nth-child(even) td {
  background-color: #BBDEFB; 
}
</style>
