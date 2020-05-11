<template>
  <div class="manage">
    <h1 class="title">Create your site</h1>
    <form>
      <label for="title" class="label">Title</label>
      <input type="text" name="title" id="title" class="input" />
      <label for="customSub" class="label">Custom Subdomain</label>
      <input
        type="text"
        name="customSub"
        id="customSub"
        placeholder="Leave blank to auto-generate. This can be changed later."
        class="input"
        required
      />
      <label for="content" class="label">What kind of content do you want to share?</label>
      <select id="content" name="content" class="input">
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
        required
      />
      <input type="submit" id="submit" name="submit" value="Select a Template" class="button" />
    </form>
  </div>
</template>

<script>
export default {
  name: "Manage"
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
