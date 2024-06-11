<template>
    <div>
        <nav>
            <img src="@/assets/logo..png" alt="QuizApp Logo" class="logo">
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/quizzes">Quizzes</router-link></li>
              <li><router-link to="/leaderboard">Leaderboard</router-link></li>
              <li><router-link to="/profile">Profile</router-link></li>
              <li v-if="isAdmin"><router-link to="/admin">Admin Dashboard</router-link></li>
              <li v-if="isAuthenticated" @click="logout">Logout</li>
              <li v-else><router-link to="/auth">Login</router-link></li>
            </ul>
          </nav>
          
      <div class="hero">
        <h1>Welcome to the Quiz App!</h1>
        <p class="subtext">Test your knowledge with a variety of quizzes across different topics and difficulty levels.</p>
        <div class="signup-container">
          <p class="signup" @click="goToSignUp">
            <span class="signup-text">Sign up</span>
            to track your progress, compete on leaderboards, and much more!
          </p>
        </div>
        <div class="buttons">
          <router-link to="/quizzes" class="button">Explore Quizzes</router-link>
          <span class="button" @click="scrollToAbout">Learn More About Us</span>
        </div>
      </div>
      <router-view />
      <div class="about" ref="about">
        <h2>About This Project</h2>
        <p>This Quiz Application is the final project for the Specialized Platform Development module. The objective is to develop a web application that allows users to take quizzes and receive instant feedback on their performance.</p>
        <p>The application includes features such as user authentication, quiz creation and management, instant feedback, scoring, and leaderboards. The project leverages Firebase for authentication and data storage, ensuring a secure and responsive user experience across different devices.</p>
      </div>
    </div>
  </template>
  <script>
    import { projectFirestore, projectAuth } from '@/firebase/Config';
  import {getUser} from "@/firebase/getUser";
  import signOut from '@/firebase/SignOut.js';

export default {
  name: 'HomeView',
  data() {
      return {
        isAdmin: false 
      };
    },
  computed: {
    isAuthenticated() {
      return !getUser()
    },
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
      }
  },
  methods: {
    logout() {
        signOut();
      this.$router.push('/auth');
    },
    goToSignUp() {
      this.$router.push('/auth');
    },
    scrollToAbout() {
      this.$refs.about.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
nav {
    background-color: #f2f3f6; 
    padding: 1rem;
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
  }
  
  .logo {
    height: 50px; 
    color: white;
  }
  
  nav ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    gap: 1rem;
  }
  
  nav ul li {
    display: inline;
  }
  
  nav ul li a {
    color: rgb(20, 19, 19);
    text-decoration: none;
    padding: 0.5rem 2rem;
    transition: background-color 0.3s;
  }
  
  nav ul li a:hover {
    background-color: #5c6bc0;
    border-radius: 5px;
  }
  
  
.hero {
  color: white;
  background: url('@/assets/bghero1.jpg') no-repeat center center;
  background-size: cover;
  padding: 5rem 2rem;
  height: 100vh; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); 
}

h1 {
  font-size: 4rem;
  margin: 0 0 1rem 0;
  text-align: left;
}

.subtext {
  font-size: 1.5rem;
  margin: 0 0 1rem 0;
  text-align: left;
}

.signup-container {
  text-align: left;
}

.signup {
  font-size: 1.5rem;
  font-weight: bold;
  color: #5c6bc0;
  margin: 2rem 0;
  cursor: pointer;
}

.signup-text {
  text-decoration: underline;
}

.buttons {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.button {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #5c6bc0;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.about {
  margin-top: 2rem; 
  background-color: rgba(255, 255, 255, 0.9); 
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-size: cover; 
}

.about h2 {
  font-size: 2rem;
  color: #343a40;
  margin-bottom: 1rem;
  text-align: center;
}

.about p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
</style>
