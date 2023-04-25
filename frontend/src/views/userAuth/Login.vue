<template>
    
<h2>{{this.signUp ? "Register" : "Login"}}</h2>

<h4 v-if="errorMsg != 'x'" style="color: red">{{ errorMsg }}</h4>
<div class="ctn">
<form @submit.prevent="loginUser" method="post" v-if="!signUp">
   <label for="email"> email: <input type="email" id="email" name="email" v-model="info.email"></label> 
    <label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password"> </label>
 <button type="submit">Sign in</button>
</form>

<form @submit.prevent="registerAcc" method="post" v-else>
    <label for="username"> username: <input type="text" id="username" name="username" v-model="info.username"></label> 
<label for="email"> email: <input type="email" id="email" name="email" v-model="info.email"></label> 
<label for="password"> Password: <input type="password" id="password" name="password" v-model="info.password">
</label>
<button class="sbmt" type="submit">{{!this.signUp ? "Sign in" : "Create account"}}</button>

</form>
</div>
<div class="bottom">
<p class="acc">{{!this.signUp ? "No account?" : "Have an account?"}} <a style="color: blue" @click="signUp = !signUp" href="javascript:void(0);">{{!this.signUp ? "Register" : "Login"}}</a></p>
</div>


</template>

<style>
input {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  
}
form {
    border: 2px solid black;
    padding: 10px;
    margin: 10px;
}
div.ctn{
    width: 40vw;
    
}
.bottom{
    position: fixed;    
    text-align: center;
    left: 42%;
    margin: auto;
    bottom: 5vh;
}
.acc{
     text-align: center;
}
button{
    padding: 10px;
    width: 50%;
    left: 25%;
}
</style>

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
            },
            errorMsg: "x"
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
                    this.errorMsg = err.response.data;
                    console.log(err);
                });
            } catch (err) {
                console.log(err);
                this.errorMsg = "Something went wrong...";
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
                    this.errorMsg = err.response.data;
                    console.log(err);
                    });
            } catch (err) {
                console.log(err);
            }
        }
    }
}
</script>