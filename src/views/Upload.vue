<template>
  <form id="content-upload" class="form" @submit.prevent="onSubmit">
    <label for="title" class="label">Title</label>
    <input type="text" name="title" id="title" class="input" placeholder="Title of the piece" />
    <label for="description" class="label">Description</label>
    <input
      type="textarea"
      name="description"
      id="description"
      class="textarea"
      placeholder="The description of the piece"
    />
    <label for="premium" class="checkbox label"
      >Monetized?
      <input type="checkbox" name="premium" id="premium" class="move-right checkbox" />
    </label>
    <label for="fileType" class="dropdown label fileselect">
      Contet Type to Upload
      <select id="fileType" name="fileType" class="input" v-model="fileType" @change="onChange">
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="text">Text</option>
      </select>
    </label>
    <div class="file has-name" v-if="setFileType">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @change="onFileChange" />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">
            Choose a file…
          </span>
        </span>
        <span class="file-name">
          {{ fileName }}
        </span>
      </label>
    </div>
    <input type="submit" name="submit" id="submit" class="button is-primary" value="Upload" />
  </form>
</template>

<script>
export default {
  name: "Upload",
  data: function() {
    return {
      fileName: "",
      fileType: "",
      setFileType: false
    };
  },
  methods: {
    onFileChange(e) {
      this.fileName = e.target.files[0].name;
    },
    async onSubmit(e) {
      const token = await this.$auth.getTokenSilently();
      const file = e.target.files;
      const formData = new FormData(e.target);

      fetch(`http://localhost:3000/api/upload${this.fileType.toLowerCase()}`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          alert("Success: ", data);
        });
    },
    onChange(e) {
      this.setFileType = true;
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 60%;
  margin: 0 auto;
}
form label {
  text-align: left;
  padding-top: 1%;
  margin-bottom: 0 !important;
}
.fileselect {
  display: block;
  align: left;
  padding-top: 1%;
  margin-bottom: 10px !important;
}
.move-right {
  margin-left: 1%;
}
.button {
  margin-top: 2%;
}
</style>
