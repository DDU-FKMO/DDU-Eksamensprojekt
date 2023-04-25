<template>
    <br />
<h3>{{this.signUp ? "Register" : "Login"}}</h3>


<form @submit.prevent="loginUser" method="post" v-if="!signUp">
   <label for="email"> email: <input type="email" id="email" name="email" v-model="info.email"></label> <br />
    <label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password"> </label><br />
 <button type="submit">Sign in</button>
</form>

<form @submit.prevent="registerAcc" method="post" v-else>
<label for="email"> email: <input type="text" id="email" name="email" v-model="info.email"></label> <br />
<label for="username"> username: <input type="text" id="username" name="username" v-model="info.username"></label> <br />
<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password">
</label><br />
<button type="submit">Sign in</button>

</form>

<br>
<br>
<p>{{!this.signUp ? "No account?" : "Have an account?"}} <u style="color: blue" @click="signUp = !signUp">{{!this.signUp ? "Register" : "Login"}}</u></p>

</template>

<script>
import axios from 'axios'
export default{
    data(){
        return{
            signUp: false,
            info: {
                email: "",
                username: "",
                password: "",
            }
        }
    },
    mounted() {
        if (localStorage.getItem("user") != null){ // logged in
            localStorage.removeItem("user");
            this.$emit("login");
        }
    },
    methods: {
        async loginUser(){
            try  {
                await axios.post('/node/login', this.info)
                .then((res) => {
                    let token = res.data.token;
                    //console.log(token);
                    localStorage.setItem("user", token);
                    this.$emit("login");
                    this.$router.push("/");
                }).catch((err) => {
                    console.log(err);
                });
            } catch (err) {
                console.log(err);
            }
        },
        async registerAcc(){
            try {
                await axios.post('/node/register', this.info)
                    .then((res) => {
                        let token = res.data.token;
                        
                        localStorage.setItem("user", token);
                        this.$emit("login");
                        this.$router.push("/");
                    }).catch((err) => {
                        console.log(err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>