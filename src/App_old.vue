<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  <NavigationItem />
  <p>{{ title[0] }}</p>
  <div v-for="id in ids" :key="id.id">
    {{ id }}
  </div>
  <div v-for="dev in devs" :key="dev.index">
    <p @click="getPostData(dev.id)">{{ dev.firstName }} {{ dev.lastName }}</p>
  </div>
  <!-- <div>{{ tasks }}</div> -->
  <TasksList :tasks="tasks" />
</template>

<script>
import axios from "axios";
// import HelloWorld from "./components/HelloWorld.vue";
import NavigationItem from "./components/NavigationItem.vue";
import TasksList from "./components/UserTasksList.vue";

export default {
  name: "App",
  data() {
    return {
      token:
        "eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODIzMzkxNixcImNcIjo0NjMyODc0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTI3NTk5MDl9.PKRcoVPuVgGbvcDwlNPMUQi_HDXtK-uBcbMRaOiL5Wk",
      devs: [],
      ids: [],
      tasks: [],
      title: "",
    };
  },
  components: {
    // HelloWorld,
    NavigationItem,
    TasksList,
  },
  created() {
    // const arr = ["one two", "three four"];
    // const result = arr.flatMap((str) => str.split(" "));
    // console.log(result);
    axios
      .get("https://www.wrike.com/api/v4/groups/KX724IUQ", {
        headers: {
          Authorization: "Bearer " + this.token,
        },
      })
      .then((response) => {
        const data = response.data.data;
        this.title = data.map((dev) => dev.title);
        // console.log(this.title);
        // let arr = [];
        this.ids = data.map((arr) => arr.memberIds);
        // console.log(this.ids[0].flat().length);
        // console.log("id" + ids.flat().length);
        var arrlen = this.ids[0].flat();
        // const devlen = [];
        for (var i = 0; i < arrlen.length; i++) {
          console.log(arrlen);
          axios
            .get("https://www.wrike.com/api/v4/contacts/" + arrlen[i], {
              headers: {
                Authorization: "Bearer " + this.token,
              },
            })
            .then((response) => {
              let d = response.data.data;
              this.devs = d;
              // this.devs = data.map((r) => r.firstName);
              // console.log(Object.assign({}, this.devs));
              console.log(this.devs);
              const de = {
                mid: data.map((md) => md.id),
                fname: data.map((fn) => fn.firstName),
                lname: data.map((ln) => ln.lastName),
              };
              // console.log(JSON.parse(JSON.stringify(de)));
              this.dev = JSON.parse(JSON.stringify(de));
              // return de;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getPostData(id) {
      console.log(id);
      axios
        .get(
          "https://www.wrike.com/api/v4/tasks?responsibles=[" +
            id +
            "]&dueDate=2022-05-20",
          {
            headers: {
              Authorization: "Bearer " + this.token,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.tasks = response.data;
        });
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
