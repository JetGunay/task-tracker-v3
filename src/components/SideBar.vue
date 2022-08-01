<template>
  <div class="sidebar-wrapper">
    <div class="logo">
      <a href="/">
        <div class="logo-img">
          <img src="../assets/elogo.png" alt="" />
        </div>
      </a>
    </div>
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <a class="nav-link">
          {{ title[0] }}
        </a>
        <ul class="sub-menu">
          <li class="sub-item" v-for="user in users" :key="user.id">
            <img :src="user.avatarUrl" class="avatar" />
            <span class="userName"
              >{{ user.firstName }} {{ user.lastName }}</span
            >
          </li>
        </ul>
      </li>
    </ul>
    <!-- <span v-for="user2 in users2" :key="user2.id">
      {{ user2.firstName }}
    </span> -->
  </div>
</template>

<script>
export default {
  name: "SideBar",
  data() {
    return {};
  },
  mounted() {},
  props: {
    title: Object,
    users: Object,
  },
  created() {},
  // computed: {
  //   users2() {
  //     return this.$store.state.users2;
  //   },
  // },
};
</script>
