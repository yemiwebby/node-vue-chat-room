<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.getLoggedInUser();
  },
  methods: {
    getLoggedInUser() {
      CometChat.getLoggedinUser().then((user) => {
        if (user !== null) {
          this.$router.push({
            name: "chat",
          });
        }
      });
    },
  },
};
</script>

<style>
@import "./lib/cometchat-components/assets/css/style.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
