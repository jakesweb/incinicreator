<template>
  <div class="manage">
    <form id="initialSetup" @submit.prevent="onSubmit" v-if="!clientSiteConfig">
      <h1 class="title">Create your site</h1>
      <label for="title" class="label">Title</label>
      <input type="text" name="title" id="title" class="input" v-model="title" />
      <label for="customSub" class="label">Custom Subdomain</label>
      <input
        type="text"
        name="customSub"
        id="customSub"
        placeholder="Leave blank to auto-generate. This can be changed later."
        class="input"
        v-model="customSub"
        required
      />
      <label for="content" class="label">What kind of content do you want to share?</label>
      <select id="content" name="content" class="input" v-model="content">
        <option value="blog">Blog</option>
        <option value="art">Art</option>
        <option value="comic">Comic</option>
        <option value="video">Videos</option>
      </select>
      <label for="webMonetization" class="label">Web Monetization Wallet ID</label>
      <input
        type="text"
        id="webMonetization"
        name="webMonetization"
        placeholder="If you are not sure about what this is, please visit the Help link at the tope of the page"
        class="input"
        v-model="webMonetization"
        required
      />
      <input
        type="submit"
        id="submit"
        name="submit"
        value="Select a Template"
        class="button"
        v-on:
      />
    </form>
    <form id="chooseTemplate" v-if="!templateConfig && clientSiteConfig">
      <h1 class="title">Choose your template</h1>
      <label for="test">Test</label>
      <input type="text" id="test" name="test" />
    </form>
  </div>
</template>

<script>
export default {
  name: "Manage",
  data: function() {
    return {
      clientSiteConfig: false,
      templateConfig: false,
      title: "",
      customSub: "",
      content: "",
      webMonetization: "",
      user: this.$auth.user
    };
  },
  created: async function() {
    const token = await this.$auth.getTokenSilently();

    let response = await fetch("http://localhost:3000/api/getsiteconfig", {
      method: "get",
      headers: new Headers({ Authorization: `Bearer ${token}`, Email: this.user.email })
    });

    let clientSite = await response.json();

    if (clientSite.title && clientSite.webMonetization) {
      this.clientSiteConfig = true;
    }
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      const token = await this.$auth.getTokenSilently();

      const submitForm = await fetch("http://localhost:3000/api/setsiteconfig", {
        method: "post",
        headers: {
          Accept: "applicaion/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: this.user.email,
          title: title.value,
          customSub: customSub.value,
          content: content.value,
          webMonetization: webMonetization.value
        })
      });

      const response = await submitForm.json();

      if (response.message) {
        this.clientSiteConfig = true;
      }
    }
  }
};
</script>

<style scoped>
.title {
  margin: 2%;
  padding-top: 2%;
}
form {
  width: 60%;
  margin: 0 auto;
}
form label {
  text-align: left;
  padding-top: 1%;
  margin-bottom: 0 !important;
}
.button {
  margin-top: 2%;
}
</style>
