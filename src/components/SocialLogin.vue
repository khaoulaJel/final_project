<template>
    <button @click="signInWithProvider('google')">Sign in with Google</button>
    <button @click="signInWithProvider('github')">Sign in with GitHub</button>
    <button @click="signInWithProvider('facebook')">Sign in with Facebook</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { projectAuth, googleProvider, githubProvider, facebookProvider } from '@/firebase/Config';
  
  const router = useRouter();
  const error = ref(null);
  
  const signInWithProvider = async (providerName) => {
    let provider;
    switch (providerName) {
      case 'google':
        provider = googleProvider;
        break;
      case 'github':
        provider = githubProvider;
        break;
      case 'facebook':
        provider = facebookProvider;
        break;
      default:
        throw new Error('Unsupported provider');
    }
  
    try {
      const result = await projectAuth.signInWithPopup(provider);
      console.log(`${providerName} sign-in successful:`, result.user);
      router.push('/home');
    } catch (err) {
      error.value = `Failed to sign in with ${providerName}`;
      console.error(`Error during ${providerName} sign-in:`, err);
    }
  };
  </script>
  
  <style scoped>
  button {
    display: block;
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:nth-of-type(1) {
    background-color: #4285F4;
    color: white;
  }
  
  button:nth-of-type(2) {
    background-color: #333;
    color: white;
  }
  
  button:nth-of-type(3) {
    background-color: #4267B2;
    color: white;
  }
  </style>
  