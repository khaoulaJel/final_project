<template>
    <AppLayout>
      <template v-slot:default>
        <div class="quizzes-view">
          <h1>Available Quizzes</h1>
          <div class="filter-bar">
            <div class="search-bar">
              <input type="text" v-model="searchCategory" placeholder="Search by category" />
            </div>
            <div class="difficulty-filter">
              <select v-model="selectedDifficulty">
                <option value="">Filter by difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div v-if="loading" class="loading">Loading quizzes...</div>
          <div v-else>
            <div v-if="filteredQuizzes.length === 0" class="no-quizzes">No quizzes available.</div>
            <div v-else class="quizzes-list">
              <div v-for="quiz in filteredQuizzes" :key="quiz.id" class="quiz-item">
                <h2>{{ quiz.title }}</h2>
                <router-link :to="'/quiz/'+quiz.id" class="take-quiz-button">take quiz</router-link>
              </div>
            </div>
          </div>
        </div>
      </template>
    </AppLayout>
  </template>
  
  <script>
  import { projectFirestore } from '@/firebase/Config.js';
  import AppLayout from '@/components/AppLayout.vue';
  
  export default {
    name: 'QuizzesView',
    components: {
      AppLayout
    },
    data() {
      return {
        quizzes: [],
        loading: true,
        searchCategory: '',
        selectedDifficulty: ''
      };
    },
    computed: {
      filteredQuizzes() {
        let filtered = this.filterQuizzesByCategory(this.searchCategory);
        if (this.selectedDifficulty) {
          filtered = this.filterQuizzesByDifficulty(filtered);
        }
        return filtered;
      }
    },
    created() {
      this.fetchQuizzes();
    },
    methods: {
      async fetchQuizzes() {
        try {
          const snapshot = await projectFirestore.collection('Quizzes').get();
          this.quizzes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched quizzes:', this.quizzes);
        } catch (error) {
          console.error('Error fetching quizzes:', error);
        } finally {
          this.loading = false;
        }
      },
      filterQuizzesByCategory(category) {
  if (!category) {
    // If no category is provided, return all quizzes
    return this.quizzes;
  }
  return this.quizzes.filter(quiz => {
    if (quiz.category) {
      return quiz.category.toLowerCase().includes(category.toLowerCase());
    } else {
      return false; // Return false if category is undefined
    }
  });
},

filterQuizzesByDifficulty(quizzes) {
  return quizzes.filter(quiz => {
    if (quiz.difficulty) {
      return quiz.difficulty.toLowerCase() === this.selectedDifficulty.toLowerCase();
    } else {
      return false; // Return false if difficulty is undefined
    }
  });
}

    }
  };
  </script>

  
  <style scoped>
  .quizzes-view {
    padding: 2rem;
  }
  
  .quizzes-view h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .loading,
  .no-quizzes {
    font-size: 1.5rem;
    color: #555;
  }
  
  .quizzes-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .quiz-item {
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 5px;
    flex: 1 1 calc(33.333% - 1rem); /* Three columns layout */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .quiz-item h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  .take-quiz-button {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #5c6bc0;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;
  }
  
  .take-quiz-button:hover {
    background-color: #0056b3;
  }
  
  .filter-bar {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .search-bar,
  .difficulty-filter {
    flex: 1;
  }
  
  .search-bar input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .difficulty-filter select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  </style>
  