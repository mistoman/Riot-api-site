import router from '@/router/index.js';

export default {
    async login(context, payload) {
        const respones = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDZOjMZmFI1tCjYWMT8itv0--4URYeix0k',{
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        })
        const responseData = await respones.json();
        if(!respones.ok){
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            throw error;
        }
        context.commit('setUser',{
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: responseData.expiresIn
        });

        router.replace('/');

    },
    async signup(context,payload){
        const respones = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDZOjMZmFI1tCjYWMT8itv0--4URYeix0k',{
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                returnSecureToken: true
            })
        })
        const responseData = await respones.json();
        if(!respones.ok){
            console.log(responseData);
            if(responseData.error.message === 'EMAIL_EXISTS'){
                const error = new Error('This email already exists!');
                throw error;
            }
            else{
            const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
            throw error;
            }
        }
        context.commit('setUser',{
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: responseData.expiresIn
        });
        router.replace('/');


    },
    async changePassword(context,payload){

        const respones = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDZOjMZmFI1tCjYWMT8itv0--4URYeix0k',{
            method: 'POST',
            body: JSON.stringify({
                idToken: context.getters.token,
                password: payload.password,
                returnSecureToken: true


            })
        })
        const responseData = await respones.json();
        if(!respones.ok){
            const error = new Error(responseData.message || 'Failed to change password. Try again later.');
            throw error;
        }
        context.commit('setUser',{
            token: responseData.idToken,
            userId: responseData.localId,
            tokenExpiration: responseData.expiresIn
        });
        router.replace('/user/'+context.getters.userId);
    },
    async deleteProfile(context){

        const respones = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDZOjMZmFI1tCjYWMT8itv0--4URYeix0k',{
            method: 'POST',
            body: JSON.stringify({
                idToken: context.getters.token

            })
        })
        const responseData = await respones.json();
        if(!respones.ok){
            const error = new Error(responseData.message || 'Failed to delete profile. Try again later.');
            throw error;
        }
        context.commit('setUser',{
            token: null,
            userId: null,
            tokenExpiration: null
        });
        router.replace('/auth');
    }


}