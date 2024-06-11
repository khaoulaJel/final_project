// Import necessary modules and components
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Auth from '../views/authView.vue';
import QuizzesView from '@/views/QuizzesView.vue';
import QuizView from '@/views/QuizView.vue'; // Import the QuizView component
import { isLogged, waitForAuthInit } from '@/firebase/getUser'; 
import UserProfile from '@/views/UserProfile.vue';
import AdminDashboard from '@/views/AdminDashboard.vue';
import AddQuiz from '@/components/AddQuiz.vue';
// Define your routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  { path: '/quizzes', name: 'Quizzes', component: QuizzesView },
  // Add the route for the QuizView component
  { 
    path: '/quiz/:id', // Assuming you pass the quiz ID as a parameter
    name: 'Quiz', 
    component: QuizView,
    meta: { requiresAuth: true } // Add any necessary meta fields
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard, // Define the route for AdminDashboard
    meta: { requiresAuth: true, requiresAdmin: true }, // Optionally add metadata for route guards
  },
  {
    path: '/add-quiz', // Define the route for adding a quiz
    name: 'AddQuiz',
    component: AddQuiz,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guards

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  waitForAuthInit().then(() => {
    const isAuthenticated = isLogged();

    if (requiresAuth && !isAuthenticated) {
      next({ path: '/auth' });
    } else {
      next();
    }

  });
});

export default router;