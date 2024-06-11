<template>
    <div class="app-layout">
      <div :class="['sidebar', { open: isSidebarOpen }]">
        <button class="toggle-btn" @click="toggleSidebar">{{ isSidebarOpen ? '✖' : '☰' }}</button>
        <img src="@/assets/logo..png" alt="QuizApp Logo" class="logo" v-if="isSidebarOpen">
        <ul v-if="isSidebarOpen">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/quizzes">Quizzes</router-link></li>
          <li><router-link to="/leaderboard">Leaderboard</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin">Admin Dashboard</router-link></li>
          <li style="margin-bottom: 3rem;"></li>
          <div class="logout-button" v-if="isAuthenticated">
            <button @click="logout">Logout</button>
          </div>
          
        </ul>
      </div>
      <div :class="['main-content', { 'with-sidebar': isSidebarOpen }]">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  import { projectAuth, projectFirestore } from '@/firebase/Config.js';
import signOut from '@/firebase/SignOut.js';
import {getUser} from '@/firebase/getUser'

  
  export default {
    name: 'AppLayout',
    data() {
      return {
        isSidebarOpen: true,
        isAdmin:false
      };
    },
    computed: {
      isAuthenticated() {
        return getUser()
      },
      
    },
    async created(){
        await this.checkAdmin();
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      async logout() {
        await signOut()
        this.$router.push('/');
      },
      async checkAdmin() {
        const user = projectAuth.currentUser;
        if (user) {
          const userDoc = await projectFirestore.collection('Users').doc(user.uid).get();
          if (userDoc.exists) {
            this.isAdmin = userDoc.data().admin;
          }
        }
      }
    }
  };
  </script>

  
  
  <style scoped>
  .app-layout {
    display: flex;
  }
  
  .sidebar {
    width: 250px;
    background-color: #f2f3f6;
    padding: 1rem;
    position: fixed;
    top: 0;
    left: -250px;
    height: 100%;
    transition: left 0.3s ease;
    z-index: 1000;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .toggle-btn {
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: -3rem; /* Position button outside the sidebar */
    transform: rotate(90deg); /* Rotate button for better UX */
  }
  
  .logo {
    width: 100%;
    height: auto;
    margin-bottom: 2rem;
  }
  
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin-bottom: 1rem;
  }
  
  .sidebar ul li a {
    color: #333;
    text-decoration: none;
    font-weight: bold;
    display: block;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .sidebar ul li a:hover {
    background-color: #5c6bc0;
    color: white;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    transition: margin-left 0.3s ease;
  }
  
  .main-content.with-sidebar {
    margin-left: 250px;
  }
  .logout-button {
    position: absolute;
    bottom: 4rem; /* Adjust the distance from the bottom */
    left: 1rem;
    width: calc(100% - 2rem); /* Adjust width to match sidebar */
}
  .logout-button button {
    background-color: #5c6bc0;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  
  .logout-button button:hover {
    background-color: #7986cb;
  }
  </style>
  