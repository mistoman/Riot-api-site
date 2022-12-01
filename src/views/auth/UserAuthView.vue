<template>
    <div>
        <p v-if="errorMsg != ''">{{ errorMsg }}</p>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Email" v-model.trim="email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password"
                    v-model.trim="password">
            </div>
            <p v-if="!isFormValid">Please enter a valid email and password (must be at least 6 characters long).</p>
            <button @click="setMode('login')" type="submit" class="btn btn-default">Login</button>
            <button @click="setMode('signup')" class="btn btn-default">Signup</button>
        </form>

    </div>
</template>


<script setup>
    import {
        ref
    } from 'vue';
    import store from '@/modules/main.js';




    let email = ref();
    let password = ref('');
    let isFormValid = ref(true);
    let formMode = ref('login');
    let errorMsg = ref('');

    async function submitForm() {
        isFormValid.value = true;
        console.log(email.value, password.value);
        if (
            email.value === '' || !email.value.includes('@') || password.value.length < 6
        ) {
            isFormValid.value = false;
            return;
        }
        try {
            if (formMode.value === 'login') {
                await store.dispatch('login', {
                    email: email.value,
                    password: password.value

                });
            } else {
                await store.dispatch('signup', {
                    email: email.value,
                    password: password.value
                });
            }
        } catch (error) {
            errorMsg.value = error;
        }

    }

    function setMode(mode) {
        formMode.value = mode;
    }
</script>

<style lang="scss" scoped>
    form {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-control {
        display: block;
        width: 100%;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .form-control:focus {
        color: #495057;
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, .25);
    }

    .btn {
        display: inline-block;
        font-weight: 400;
        color: #212529;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        background-color: transparent;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .btn:focus,
    .btn.focus {
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, .25);
    }

    .btn:hover {
        color: #212529;
        text-decoration: none;
    }

    .btn:not(:disabled):not(.disabled) {
        cursor: pointer;
    }
</style>