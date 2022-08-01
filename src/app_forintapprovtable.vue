<template>
  <!-- <NavigationItem :devs="devs" /> -->
  <div class="container">
    <nav class="navbar bg-dark">
      <div class="container">
        <a href="/" class="navbar-brand d-flex align-items-center">
          <img src="./assets/elogo.png" alt="" />
        </a>
      </div>
    </nav>
    <div class="main container">
      <div class="row">
        <div class="col-lg-2 col-4" style="display: none">
          <div class="sidebar flex-shrink-0 p-3 bg-white">
            <div class="grp-title">
              <a href="/">Developers</a>
            </div>
            <!--nav-->
            <div class="grp-list">
              <ul>
                <li
                  v-for="dev in devs"
                  :key="dev.index"
                  class="grp-item"
                  :class="{ active: isActive }"
                  @click="
                    [getPostData(dev.id, dev.firstName, dev.lastName), task()]
                  "
                >
                  {{ dev.firstName }} {{ dev.lastName }}
                </li>
              </ul>
            </div>
            <!--nav-->
          </div>
        </div>
        <div class="col-lg-12 col-12">
          <div class="right-header">
            {{ userFName }} {{ userLName }}

            <div class="d-grid gap-2 d-md-block btns-container">
              <select
                :model="users"
                name="users"
                @change="onChangeUsers($event)"
              >
                <option :value="null" selected disabled>All</option>
                <option
                  v-for="dev in devs"
                  :key="dev.index"
                  :value="`${dev.id}`"
                >
                  {{ dev.firstName }}
                </option>
              </select>
              <select
                :model="statuses"
                name="status"
                @change="onChange($event)"
              >
                <option :value="null" selected disabled>Status</option>
                <option
                  class="item"
                  v-for="status in statuses"
                  :key="status.index"
                  :value="`${status}`"
                  @click="toggle($event)"
                >
                  {{ status }}
                </option>
              </select>
            </div>
          </div>
          <div class="task-container">
            <!-- <div v-for="id in ids" :key="id.index"> -->
            <!-- <div :html="newtask">{{ alltasks.title }}</div> -->
            <div id="newtask">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Developer</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in qatasks" :key="task.index">
                    <th scope="row">{{ task.dates.start.slice(0, 10) }}</th>
                    <td>
                      <span v-for="d in task.responsibleIds" :key="d.index">
                        <span v-for="dev in devs" :key="dev.index">
                          <span v-if="d === dev.id">
                            {{ dev.firstName }} {{ dev.lastName }}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>{{ statusName }}</td>
                    <td>
                      <a :href="task.permalink">{{ permalink }}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>{{ foundnone }}</p>
            </div>
            <!-- </div> -->
            <TasksList
              @updateTasks="update"
              :id="id"
              :userFName="userFName"
              :userLName="userLName"
              :qaTasks="qaTasks"
              :statusName="statusName"
              :foundnone="foundnone"
            />
            <!-- :usertasks="usertasks" -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import NavigationItem from "./components/NavigationItem.vue";
import TasksList from "./components/UserTasksList.vue";

export default {
  name: "App",
  data() {
    return {
      auth: "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODIzMzkxNixcImNcIjo0NjMyODc0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTI3NTk5MDl9.PKRcoVPuVgGbvcDwlNPMUQi_HDXtK-uBcbMRaOiL5Wk",
      uri: "https://www.wrike.com/api/v4/",
      devs: null,
      alltasks: "",
      usertasks: [],
      qaTasks: {},
      statusName: "",
      newtask: "",
      ids: "",
      id: "",
      userFName: "",
      userLName: "",
      title: "",
      tasks: "",
      foundnone: "",
      users: "",
      statuses: "",
      ava: "",
      qatasks: [],
      permalink: "",
      isActive: false,
    };
  },
  components: {
    // NavigationItem,
    TasksList,
  },
  created() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((response) => {
        this.devs = response.dev.flat();

        var id = this.devs.map((arr) => arr.id);
        console.log(id);

        var today = new Date().toISOString().slice(0, 10);

        axios
          .get(
            this.uri + "tasks?responsibles=[" + id + "]&scheduledDate=" + today,
            {
              headers: {
                Authorization: this.auth,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            var alltasks = response.data.data;
            var tID = alltasks.map((tID) => tID.id);
            console.log(tID);

            axios
              .get(this.uri + "tasks/" + tID, {
                headers: {
                  Authorization: this.auth,
                },
              })
              .then((response) => {
                this.tasks = response.data.data;
                var resID = this.tasks.map((resID) => resID.responsibleIds);
                var resUser = this.devs.find((item) => item.id === resID);
                console.log(resID);
                console.log(resUser);

                this.qatasks = this.tasks.filter(
                  (stat) => stat.customStatusId === "IEADVMHZJMBRONOY"
                );
                console.log(this.qatasks.map((pl) => pl.permalink));
                var pl = this.qatasks.map((pl) => pl.permalink);
                var url = new URL(pl);
                this.permalink = url.searchParams.get("id");
                console.log(this.permalink);

                if (this.qatasks.length === 0) {
                  this.foundnone = "No task found.";
                } else {
                  this.foundnone = "";
                }
                console.log("taskwf length " + this.tasks.length);

                axios
                  .get(this.uri + "workflows", {
                    headers: {
                      Authorization: this.auth,
                    },
                  })
                  .then((response) => {
                    var wf = response.data.data;
                    var taskwf = wf.filter(
                      (taskwfId) => taskwfId.id === "IEADVMHZK4BRONOE"
                    );
                    var customStatuses = taskwf
                      .map((ct) => ct.customStatuses)
                      .flat();
                    var customTaskwf = customStatuses.filter(
                      (cTaskwf) => cTaskwf.id === "IEADVMHZJMBRONOY"
                    );
                    var statName = customTaskwf.map(
                      (taskName) => taskName.name
                    );
                    this.statusName = statName.toString();
                    console.log(customTaskwf);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(this.uri + "groups/KX724IUQ", {
        headers: {
          Authorization: this.auth,
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
            .get(this.uri + "contacts/" + arrlen[i], {
              headers: {
                Authorization: this.auth,
              },
            })
            .then((response) => {
              let d = response.data;
              let data = d.data;
              // this.devs = data;
              // this.devs = data.map((r) => r.firstName);
              // console.log(Object.assign({}, this.devs));
              console.log(this.data);
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
    onChangeUsers(event) {
      let userId = event.target.value;

      var today = new Date().toISOString().slice(0, 10);
      console.log(today);
      axios
        .get(
          this.uri +
            "tasks?responsibles=[" +
            userId +
            "]&scheduledDate=" +
            today,
          // this.uri + "tasks?responsibles=[" + id + "]&scheduledDate=2022-06-07",
          {
            headers: {
              Authorization: this.auth,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.usertasks = response.data.data;

          var status = this.usertasks.filter(
            (stat) => stat.customStatusId === "IEADVMHZJMBRONOY"
          );

          this.tasks = this.usertasks.filter(
            (stat) => stat.customStatusId === "IEADVMHZJMBRONOY"
          );

          if (this.tasks.length === 0) {
            this.foundnone = "No task found.";
          } else {
            this.foundnone = "";
          }
          console.log("taskwf length " + this.tasks.length);

          axios
            .get(this.uri + "workflows", {
              headers: {
                Authorization: this.auth,
              },
            })
            .then((response) => {
              var wf = response.data.data;
              var taskwf = wf.filter(
                (taskwfId) => taskwfId.id === "IEADVMHZK4BRONOE"
              );
              var customStatuses = taskwf.map((ct) => ct.customStatuses).flat();
              var customTaskwf = customStatuses.filter(
                (cTaskwf) => cTaskwf.id === "IEADVMHZJMBRONOY"
              );
              var statName = customTaskwf.map((taskName) => taskName.name);
              this.statusName = statName.toString();
              console.log(status);
              console.log(customTaskwf);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPostData(id, fName, lName) {
      var today = new Date().toISOString().slice(0, 10);
      console.log(today);
      axios
        .get(
          this.uri + "tasks?responsibles=[" + id + "]&scheduledDate=" + today,
          // this.uri + "tasks?responsibles=[" + id + "]&scheduledDate=2022-06-07",
          {
            headers: {
              Authorization: this.auth,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.usertasks = response.data.data;

          var status = this.usertasks.filter(
            (stat) => stat.customStatusId === "IEADVMHZJMBRONOY"
          );

          this.qaTasks = this.usertasks.filter(
            (stat) => stat.customStatusId === "IEADVMHZJMBRONOY"
          );

          if (this.qaTasks.length === 0) {
            this.foundnone = "No task found.";
          } else {
            this.foundnone = "";
          }
          console.log("taskwf length " + this.qaTasks.length);

          axios
            .get(this.uri + "workflows", {
              headers: {
                Authorization: this.auth,
              },
            })
            .then((response) => {
              var wf = response.data.data;
              var taskwf = wf.filter(
                (taskwfId) => taskwfId.id === "IEADVMHZK4BRONOE"
              );
              var customStatuses = taskwf.map((ct) => ct.customStatuses).flat();
              var customTaskwf = customStatuses.filter(
                (cTaskwf) => cTaskwf.id === "IEADVMHZJMBRONOY"
              );
              var statName = customTaskwf.map((taskName) => taskName.name);
              this.statusName = statName.toString();
              console.log(status);
              console.log(customTaskwf);
            })
            .catch((error) => {
              console.log(error);
            });
          // console.log(this.usertasks.customStatusId);
          console.log(status);
          this.id = id;
          this.userFName = fName;
          this.userLName = lName;
          console.log(id, fName, lName);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    task() {
      document.getElementById("newtask").style.display = "none";
      this.isActive = !this.isActive;
    },
    update(qaTasks) {
      // this.usertasks = usertasks;
      this.qaTasks = qaTasks;
    },
  },
};
</script>

<style lang="scss">
@import "./styles/global.scss";
</style>
