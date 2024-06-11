<template>
    <button @click="handleSignOut" class="signout-button">Sign Out</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import signOut from '@/firebase/SignOut.js';
  
  const router = useRouter();
  const error = ref(null);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      error.value = 'Failed to sign out';
      console.error('Error during sign out:', err);
    }
  };
  </script>
  
  <style scoped>
  .signout-button {
    background-color: rgb(245, 66, 101);
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  