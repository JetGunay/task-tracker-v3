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
        <div class="col-lg-12 col-12">
          <div class="right-header">
            <!-- {{ userFName }} {{ userLName }} -->
            <div class="d-grid gap-2 d-md-block btns-container">
              <select
                :model="users"
                name="users"
                @change="onChangeUsers($event)"
              >
                <option :value="null" selected disabled>All</option>
                <option
                  v-for="user in users"
                  :key="user.index"
                  :ref="userChange"
                  :value="`${user.id}`"
                >
                  {{ user.firstName }} {{ user.lastName }}
                </option>
              </select>
              <select
                :model="statuses"
                :ref="statusChange"
                name="status"
                @change="onChangeStatus($event)"
              >
                <option value="All">Status</option>
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
            <div id="newtask">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">{{ title[0] }}</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in tasks" :key="task.index">
                    <th scope="row">{{ task.dates.start.slice(0, 10) }}</th>
                    <td>
                      <span v-for="d in task.responsibleIds" :key="d.index">
                        <span v-for="user in users" :key="user.index">
                          <span v-if="d === user.id">
                            <!-- {{ user.firstName }} {{ user.lastName }} -->
                            <div class="tooltip">
                              <img :src="user.avatarUrl" class="avatar" />
                              <span class="tooltiptext ava"
                                >{{ user.firstName }} {{ user.lastName }}</span
                              >
                            </div>
                          </span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span v-for="stat in stats" :key="stat.index">
                        <span
                          v-if="task.customStatusId === stat.id"
                          class="status"
                          :style="`color: ${stat.color}`"
                        >
                          {{ stat.name }}
                        </span>
                      </span>
                    </td>
                    <td>
                      <div class="tooltip">
                        <a :href="task.permalink">
                          {{
                            task.permalink.split("/open.htm?id=").slice(-1)[0]
                          }}
                        </a>
                        <span class="tooltiptext td">
                          {{ task.title }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>{{ foundnone }}</p>
            </div>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import NavigationItem from "./components/NavigationItem.vue";
// import TasksList from "./components/UserTasksList.vue";

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
      ids: [],
      id: this.ids,
      userFName: "",
      userLName: "",
      title: "",
      tasks: "",
      foundnone: "",
      statuses: ["Active", "Completed", "Deferred", "Cancelled"],
      ava: "",
      isActive: false,
      users: [],
      number: "",
      userId: "",
      userFirstName: "",
      userLastName: "",
      userAvatar: "",
      permalinks: "",
      qatasks: [],
      stats: "",
      userChange: "",
      statusChange: "",
    };
  },
  components: {
    // NavigationItem,
    // TasksList,
  },
  created() {
    fetch("./data.json")
      .then((response) => response.json())
      .then((response) => {
        this.devs = response.dev.flat();

        // var id = this.devs.map((arr) => arr.id);
        // console.log("fetch " + id);

        var today = new Date().toISOString().slice(0, 10);

        axios
          .get(this.uri + "groups/KX724M7I", {
            headers: {
              Authorization: this.auth,
            },
          })
          .then((response) => {
            const data = response.data.data;
            this.title = data.map((dev) => dev.title);
            this.ids = data.map((arr) => arr.memberIds);
            var arrlen = this.ids[0].flat();
            // const devlen = [];
            const PromiseArr = [];
            for (let i = 0; i < arrlen.length; i++) {
              var url = this.uri + "contacts/" + arrlen[i];
              PromiseArr.push(
                axios
                  .get(url, { headers: { Authorization: this.auth } })
                  .then(
                    (response) =>
                      new Promise((resolve) => resolve(response.data.data[0]))
                  )
              );
            }

            Promise.all(PromiseArr).then((res) => {
              // return res;
              this.users = res;
            });
            Promise.all(PromiseArr).then((uId) => {
              // return res;
              this.ids = uId.map((id) => id.id);
              console.log("res" + uId.map((id) => id.id));

              axios
                .get(
                  this.uri +
                    "tasks?responsibles=[" +
                    this.ids +
                    "]&scheduledDate=" +
                    today,
                  {
                    headers: {
                      Authorization: this.auth,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
                  var alltasks = response.data.data;
                  var taskId = alltasks.map((taskId) => taskId.id);

                  axios
                    .get(this.uri + "tasks/" + taskId, {
                      headers: {
                        Authorization: this.auth,
                      },
                    })
                    .then((response) => {
                      this.tasks = response.data.data;
                      var resId = this.tasks.map(
                        (resId) => resId.responsibleIds
                      );
                      var resUser = this.devs.find((item) => item.id === resId);
                      console.log(resId);
                      console.log(resUser);
                      console.log("le " + this.tasks.length);

                      if (this.tasks.length === 0) {
                        this.foundnone = "No task found.";
                      } else {
                        this.foundnone = "";
                      }
                      console.log("taskwf length " + this.tasks.length);
                      var cStatus = this.tasks.map((cs) => cs.customStatusId);
                      console.log(cStatus);

                      axios
                        .get(this.uri + "workflows", {
                          headers: {
                            Authorization: this.auth,
                          },
                        })
                        .then((response) => {
                          var wf = response.data.data;
                          console.log(wf.length);
                          var l = [];
                          for (var s = 0; s < wf.length; s++) {
                            l.push(wf.map((x) => x.customStatuses));
                            Promise.all(l).then((res) => {
                              console.log(res[s]);
                            });
                          }
                          Promise.all(wf.map((x) => x.customStatuses)).then(
                            (result) => {
                              var p = result;
                              this.stats = p.flat();
                            }
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
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
  },
  methods: {
    onChangeUsers(event) {
      this.userId = event.target.value;
      console.log(this.$refs.userChange);

      var today = new Date().toISOString().slice(0, 10);
      console.log(today);
      axios
        .get(
          this.uri +
            "tasks?responsibles=[" +
            this.userId +
            "]&scheduledDate=" +
            today,
          {
            headers: {
              Authorization: this.auth,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          this.tasks = response.data.data;

          var alltasks = response.data.data;
          var taskId = alltasks.map((taskId) => taskId.id);

          axios
            .get(this.uri + "tasks/" + taskId, {
              headers: {
                Authorization: this.auth,
              },
            })
            .then((response) => {
              this.tasks = response.data.data;
              var resId = this.tasks.map((resId) => resId.responsibleIds);
              var resUser = this.devs.find((item) => item.id === resId);
              console.log(resId);
              console.log(resUser);
              console.log("le " + this.tasks.length);

              if (this.tasks.length === 0) {
                this.foundnone = "No task found.";
              } else {
                this.foundnone = "";
              }
              console.log("taskwf length " + this.tasks.length);
              var cStatus = this.tasks.map((cs) => cs.customStatusId);
              console.log(cStatus);

              axios
                .get(this.uri + "workflows", {
                  headers: {
                    Authorization: this.auth,
                  },
                })
                .then((response) => {
                  var wf = response.data.data;
                  console.log(wf.length);
                  var l = [];
                  for (var s = 0; s < wf.length; s++) {
                    l.push(wf.map((x) => x.customStatuses));
                    Promise.all(l).then((res) => {
                      console.log(res[s]);
                    });
                  }
                  Promise.all(wf.map((x) => x.customStatuses)).then(
                    (result) => {
                      var p = result;
                      this.stats = p.flat();
                    }
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onChange(event) {
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
    onChangeStatus(event) {
      let stat = event.target.value;
      console.log(stat);
      console.log("id " + this.ids);
      var today = new Date().toISOString().slice(0, 10);
      console.log(today);

      if (stat === "All") {
        axios
          .get(
            this.uri +
              "tasks?responsibles=[" +
              this.ids +
              "]&scheduledDate=" +
              today,
            {
              headers: {
                Authorization: this.auth,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            this.tasks = response.data.data;

            if (this.tasks.length === 0) {
              this.foundnone = "No task found.";
            } else {
              this.foundnone = "";
            }
            var taskId = this.tasks.map((taskId) => taskId.id);

            axios
              .get(this.uri + "tasks/" + taskId, {
                headers: {
                  Authorization: this.auth,
                },
              })
              .then((response) => {
                this.tasks = response.data.data;

                axios
                  .get(this.uri + "workflows", {
                    headers: {
                      Authorization: this.auth,
                    },
                  })
                  .then((response) => {
                    var wf = response.data.data;
                    console.log(wf.length);
                    var l = [];
                    for (var s = 0; s < wf.length; s++) {
                      l.push(wf.map((x) => x.customStatuses));
                      Promise.all(l).then((res) => {
                        console.log(res[s]);
                      });
                    }
                    Promise.all(wf.map((x) => x.customStatuses)).then(
                      (result) => {
                        var p = result;
                        this.stats = p.flat();
                      }
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        axios
          .get(
            this.uri +
              "tasks?responsibles=[" +
              this.ids +
              "]&status=" +
              stat +
              "&scheduledDate=" +
              today,
            {
              headers: {
                Authorization: this.auth,
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            this.tasks = response.data.data;

            if (this.tasks.length === 0) {
              this.foundnone = "No task found.";
            } else {
              this.foundnone = "";
            }
            var taskId = this.tasks.map((taskId) => taskId.id);

            axios
              .get(this.uri + "tasks/" + taskId, {
                headers: {
                  Authorization: this.auth,
                },
              })
              .then((response) => {
                this.tasks = response.data.data;

                axios
                  .get(this.uri + "workflows", {
                    headers: {
                      Authorization: this.auth,
                    },
                  })
                  .then((response) => {
                    var wf = response.data.data;
                    console.log(wf.length);
                    var l = [];
                    for (var s = 0; s < wf.length; s++) {
                      l.push(wf.map((x) => x.customStatuses));
                      Promise.all(l).then((res) => {
                        console.log(res[s]);
                      });
                    }
                    Promise.all(wf.map((x) => x.customStatuses)).then(
                      (result) => {
                        var p = result;
                        this.stats = p.flat();
                      }
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style lang="scss">
@import "./styles/global.scss";
</style>
