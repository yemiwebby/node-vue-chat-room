<template>
  <div>
    <div id="nav">
      <router-link to="/login">Login</router-link>|
      <router-link to="/register">Register</router-link>|
      <router-link to="/chat">Chat</router-link>
    </div>

    <div class="light">
      <div class="pageWrapper" v-if="!loader">
        <div class="input-form">
          <form v-on:submit.prevent="authLoginAppUser">
            <h3>Hello!</h3>
            <p>
              Welcome to our little Vue demo powered by CometChat. Login with the
              username "superhero1" or "superhero2" and test the chat out. To
              create your own user, see
              <a
                href="https://prodocs.cometchat.com/reference#createuser"
              >our documentation</a>
            </p>
            <input
              id="username"
              name="username"
              v-model="username"
              type="text"
              placeholder="Enter your UID here"
              class="formInput"
            />

            <input
              id="password"
              name="password"
              v-model="password"
              type="password"
              placeholder="******"
              class="formInput"
              required
            />

            <button class="pageButton" type="submit">
              Login &nbsp;&nbsp;
              <span v-if="loader" class="fa fa-spin fa-spinner"></span>
            </button>
          </form>
        </div>
      </div>
      <Loader v-else-if="loader" />
    </div>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
import Loader from "../lib/cometchat-components/components/Loader";
export default {
  components: {
    Loader,
  },
  data() {
    return {
      username: "",
      password: "",
      showSpinner: false,
      token: "",
      loader: false,
    };
  },
  methods: {
    authLoginAppUser() {
      let userData = {
        username: this.username,
        password: this.password,
      };
      this.showSpinner = true;

      if (this.username && this.password) {
        this.$http
          .post(`http://localhost:3000/login`, userData)
          .then((response) => {
            this.logUserInToCometChat(response.data.user.token);
            this.showSpinner = false;
          })
          .catch((error) => {
            alert(error.response.data.message);
            console.log(error.response.data.message);
            this.showSpinner = false;
          });
      } else {
        alert("Please check your credentials");
      }
    },
    logUserInToCometChat(token) {
      CometChat.login(token).then(
        () => {
          console.log("successfully login user");
          window.location.href = "/home";
        },
        (error) => {
          this.showSpinner = false;
          alert(
            "Whops. Something went wrong. This commonly happens when you enter a username that doesn't exist. Check the console for more information"
          );
          console.log("Login failed with error:", error.code);
        }
      );
    },
  },
};
</script>

<style>
.pageWrapper {
  padding-top: 50px;
  text-align: center;
  display: flex;
}

.input-form {
  margin: 0 auto;
  width: 400px;
}

.formInput {
  border: 2px solid #aaa;
  width: 100%;
  padding: 10px;
  font-weight: 550;
  color: #555;
  margin-bottom: 30px;
}

p {
  margin: auto;
  padding: 10px;
}

.pageButton {
  color: white;
  padding: 10px;
  text-align: center;
  background: #333;
  width: 100%;
}

.pageButton:hover {
  cursor: pointer;
  color: white;
  background: #333333;
}
</style>
