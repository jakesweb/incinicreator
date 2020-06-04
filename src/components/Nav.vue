<template>
  <nav class="navbar container" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <p class="navbar-item"><strong class="is-size-4">Incinicreator</strong></p>
    </div>
    <div class="navbar">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Home</router-link>
        <router-link to="/about" class="navbar-item">About</router-link>
        <router-link v-if="$auth.isAuthenticated" to="/manage" class="navbar-item"
          >Manage My Site</router-link
        >
        <router-link v-if="$auth.isAuthenticated" to="/upload" class="navbar-item"
          >Upload</router-link
        >
        <router-link v-if="$auth.isAuthenticated" to="/help" class="navbar-item">Help</router-link>
      </div>
    </div>
    <div class="navbar-end">
      <div v-if="!$auth.loading" class="navbar-item">
        <a v-if="!$auth.isAuthenticated" @click="login" class="button is-dark">
          <strong>Sign In</strong>
        </a>
        <a v-if="$auth.isAuthenticated" @click="logout" class="button is-dark">
          <strong>Log Out</strong>
        </a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav",
  methods: {
    login() {
      // login for user
      this.$auth.loginWithRedirect();
    },
    logout() {
      // logout for user
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  margin-top: 3%;
  margin-bottom: 5%;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #d88d00;
    }
  }
}
</style>
