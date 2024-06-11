<template>
    <AppLayout>
      <div class="user-profile">
        <h1>User Profile</h1>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label for="displayName">Display Name:</label>
              <input type="text" v-model="displayName" id="displayName" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" v-model="email" id="email" required disabled />
            </div>
            <button type="submit" class="update-button">Update Profile</button>
          </form>
          <div v-if="error" class="error">{{ error }}</div>
          <div v-if="success" class="success">{{ success }}</div>
        </div>
      </div>
    </AppLayout>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { projectFirestore, projectAuth } from '@/firebase/Config';
  import AppLayout from '@/components/AppLayout.vue';
  
  export default {
    components: {
      AppLayout
    },
    setup() {
      const user = projectAuth.currentUser;
      const displayName = ref('');
      const email = ref('');
      const error = ref(null);
      const success = ref(null);
      const loading = ref(true);
  
      const fetchUserData = async () => {
        if (user) {
          try {
            const userDoc = await projectFirestore.collection('Users').doc(user.uid).get();
            if (userDoc.exists) {
              displayName.value = userDoc.data().displayName;
              email.value = userDoc.data().email;
            }
          } catch (err) {
            error.value = 'Failed to load user data';
          } finally {
            loading.value = false;
          }
        }
      };
  
      const updateProfile = async () => {
        error.value = null;
        success.value = null;
        try {
          await projectFirestore.collection('Users').doc(user.uid).update({
            displayName: displayName.value,
          });
          await user.updateProfile({ displayName: displayName.value });
          success.value = 'Profile updated successfully';
        } catch (err) {
          error.value = 'Failed to update profile';
        }
      };
  
      onMounted(() => {
        fetchUserData();
      });
  
      return {
        displayName,
        email,
        error,
        success,
        loading,
        updateProfile,
      };
    },
  };
  </script>
  
  
  <style scoped>
  .user-profile {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  .loading {
    font-size: 18px;
    color: #555;
    text-align: center;
    margin-top: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="email"] {
    width: calc(100% - 20px);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin: 0 auto;
    display: block;
  }
  
  button {
    background-color: #6200EE;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #3700B3;
  }
  
  .error,
  .success {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }
  
  .error {
    background-color: #f44336;
    color: white;
  }
  
  .success {
    background-color: #4caf50;
    color: white;
  }
  </style>
  