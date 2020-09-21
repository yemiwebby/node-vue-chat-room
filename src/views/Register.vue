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
          <form v-on:submit.prevent="registerAppUser">
            <h3>Create an Account</h3>
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
              placeholder="Enter Password"
              class="formInput"
              required
            />

            <button class="pageButton" type="submit">
              SIGN UP &nbsp;&nbsp;
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
      loader: false,
    };
  },
  methods: {
    registerAppUser() {
      if (this.username && this.password) {
        this.showSpinner = true;
        let data = {
          username: this.username,
          password: this.password,
        };

        this.$http
          .post(`http://localhost:3000/register`, data)
          .then((response) => {
            console.log(response.data.user);
            if (response.data.auth) {
              this.createUserOnCometChat(this.username);
            }
            this.showSpinner = false;
          })
          .catch((error) => {
            console.log(error.response.data.message);
            this.showSpinner = false;
          });
      }
    },
    redirect() {
      window.location.href = "/login";
    },
    async createUserOnCometChat(username) {
      let url = `https://api-us.cometchat.io/v2.0/users`;
      let data = {
        uid: username,
        name: `${username} sample`,
        avatar:
          "https://data-us.cometchat.io/assets/images/avatars/captainamerica.png",
      };

      try {
        const userDetails = await fetch(url, {
          method: "POST",
          headers: new Headers({
            appid: process.env.VUE_APP_COMMETCHAT_APP_ID,
            apikey: process.env.VUE_APP_COMMETCHAT_API_KEY,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        });
        const userJson = await userDetails.json();

        console.log("New User", userJson);
        this.createAuthTokenAndSaveForUser(username);
      } catch (error) {
        console.log("Error", error);
      }
    },
    async createAuthTokenAndSaveForUser(uid) {
      let url = `https://api-us.cometchat.io/v2.0/users/${uid}/auth_tokens`;

      try {
        const tokenDetails = await fetch(url, {
          method: "POST",
          headers: new Headers({
            appid: process.env.VUE_APP_COMMETCHAT_APP_ID,
            apikey: process.env.VUE_APP_COMMETCHAT_API_KEY,
            "Content-Type": "application/json",
          }),
        });
        const tokenJSON = await tokenDetails.json();
        console.log(tokenJSON);
        this.addUserToAGroup(uid);
        this.sendTokenToServer(tokenJSON.data.authToken, tokenJSON.data.uid);
      } catch (error) {
        console.log("Error Token", error);
      }
    },
    async addUserToAGroup(uid) {
      let url = `https://api-us.cometchat.io/v2.0/groups/${process.env.VUE_APP_COMMETCHAT_GUID}/members`;
      let data = {
        participants: [uid],
      };

      try {
        const groupResponse = await fetch(url, {
          method: "POST",
          headers: new Headers({
            appid: process.env.VUE_APP_COMMETCHAT_APP_ID,
            apikey: process.env.VUE_APP_COMMETCHAT_API_KEY,
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(data),
        });
        const groupJson = await groupResponse.json();

        console.log("Added to group", groupJson);
        this.redirect();
      } catch (error) {
        console.log("Error", error);
      }
    },
    sendTokenToServer(token, uid) {
      this.$http
        .post(`http://localhost:3000/update/token`, { token, uid })
        .then((response) => {
          console.log("Token updated successfully", response);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
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
