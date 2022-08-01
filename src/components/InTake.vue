<template>
  <div class="row">
    <!-- <select name="brands">
      <option
        v-for="brandFolder in brandFolders"
        :key="brandFolder.id"
        :id="brandFolder.id"
      >
        {{ brandFolder.title }}
      </option>
    </select> -->
  </div>
</template>

<script>
// import moment from "moment";

export default {
  name: "InTake",
  data() {
    return {};
  },
  props: {
    brandFolders: Object,
  },
  computed: {},
  methods: {},
};
</script>
