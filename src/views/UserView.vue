<template>
    <div>
        <router-link to="/"> <button>Home</button> </router-link>
        <h1>Welcome user: {{ userID }}</h1>
        <form @submit.prevent="changePassword">
            <input type="password" minlength="6" v-model="newPassword">
            <input type="submit" value="Change Password">

        </form>
        <button class="delete-button" @click="deleteProfile">Delete Profile </button>
        <p> <strong>WARNING! </strong> Instant deletion. No confirmation.</p>
        
    </div>
</template>

<script setup>
    import {ref} from 'vue';
    import store from '@/modules/main';

    let newPassword = ref('');
    const userID = store.getters.userId;

    function changePassword() {
        store.dispatch('changePassword', {
            password: newPassword.value
        });
        newPassword.value = '';
    }

    function deleteProfile() {
        store.dispatch('deleteProfile');
    }
</script>

<style lang="scss">

.delete-button {
    background-color: red;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 50px;
    cursor: pointer;
}
</style>