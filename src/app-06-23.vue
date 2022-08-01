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
              <table class="table table-hover" ref="exportTable">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">{{ title[0] }}</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ticket ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="task in tasks" :key="task.index">
                    <!-- <th scope="row">{{ task.dates.start.slice(0, 10) }}</th> -->
                    <th scope="row">{{ getDate(task.dates.start) }}</th>
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
                      <span
                        v-for="(cId, index) in sortedBrands.filter(
                          (id) => id.id === task.superParentIds[0]
                        )"
                        :key="index"
                        class="status"
                        :id="`${cId.id}`"
                      >
                        <span
                          v-for="br in cId.customFields.filter(
                            (id) => id.id === 'IEADVMHZJUABUJGM'
                          )"
                          :key="br.id"
                        >
                          {{ br.value }}
                        </span>
                      </span>
                      <!-- {{ task.superParentIds[0] }} -->
                    </td>
                    <td>
                      <span
                        v-for="stat in stats.filter(
                          (id) => id.id === task.customStatusId
                        )"
                        :key="stat.id"
                        class="status"
                        :id="`${stat.id}`"
                        :style="`color: ${stat.color}`"
                      >
                        {{ stat.name }}
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
              <button @click="exportExcel('xslx')">Export</button>
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
import moment from "moment";
// import XLSX from "vue-xlsx";
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
      pIds: "",
      cIds: [],
      childIds: [],
      usertasks: [],
      brands2: [],
      qaTasks: {},
      statusName: "",
      newtask: "",
      ids: [],
      id: this.ids,
      userFName: "",
      userLName: "",
      title: "",
      tasks: [],
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
      stats: [],
      userChange: "",
      statusChange: "",
    };
  },
  components: {
    // NavigationItem,
    // TasksList,
  },
  created() {
    var today = new Date().toISOString().slice(0, 10);

    // groups
    axios
      .get(this.uri + "groups/KX724IUQ", {
        headers: {
          Authorization: this.auth,
        },
      })
      .then((response) => {
        const data = response.data.data;
        this.title = data.map((dev) => dev.title);
        this.ids = data.map((arr) => arr.memberIds);
        var arrlen = this.ids[0].flat();

        //get all users in group
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
          this.users = res;
          console.log(this.users);
        });
        Promise.all(PromiseArr).then((uId) => {
          this.ids = uId.map((id) => id.id);
          console.log("res" + uId.map((id) => id.id));

          // tasks of each users
          axios
            .get(
              this.uri +
                "tasks?responsibles=[" +
                this.ids +
                "]&fields=[responsibleIds, parentIds, superParentIds]&scheduledDate=" +
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
              console.log(alltasks);

              console.log("le " + this.tasks.length);

              if (this.tasks.length === 0) {
                this.foundnone = "No task found.";
              } else {
                this.foundnone = "";
              }
              console.log("taskwf length " + this.tasks.length);
              var cStatus = this.tasks.map((cs) => cs.customStatusId);
              console.log(cStatus);

              // status
              axios
                .get(this.uri + "workflows/", {
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

              // brand folders
              axios
                .get(this.uri + "folders/IEADVMHZI4QRILWE/folders", {
                  headers: {
                    Authorization: this.auth,
                  },
                })
                .then((response) => {
                  this.folders = response.data.data;
                  // var chIds = this.folders.map((ch) => ch.childIds);
                  var spIds = this.tasks.map((sp) => sp.superParentIds);
                  var sparr = spIds.flat();
                  console.log(spIds.flat());
                  console.log("brands " + this.brands);
                  const FolderArr = [];
                  for (var s = 0; s < sparr.length; s++) {
                    var url = this.uri + "folders/" + sparr[s];
                    FolderArr.push(
                      axios
                        .get(url, { headers: { Authorization: this.auth } })
                        .then(
                          (response) =>
                            new Promise((resolve) =>
                              resolve(response.data.data[0])
                            )
                        )
                    );
                  }

                  Promise.all(FolderArr).then((res) => {
                    this.childIds = res.flat();
                    console.log(this.childIds.flat());
                  });
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
  },
  computed: {
    sortedBrands() {
      const brands = this.childIds.reduce((p, c) => {
        p[c.id] = c;
        return p;
      }, {});
      return Object.values(brands).sort((a, b) => a.id.localeCompare(b.id));
    },
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
    getDate(datetime) {
      let date = moment(String(datetime)).format("Do MMM YY");
      return date;
    },
    // exportExcel(type, fn, dl) {
    //   var elt = this.$refs.exportTable;
    //   var wb = XLSX.utils.table_to_book(elt, { sheet: "Sheet JS" });
    //   return dl
    //     ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
    //     : XLSX.writeFile(wb, fn || "SheetJSTableExport." + (type || "xslx"));
    // },
  },
};
</script>

<style lang="scss">
@import "./styles/global.scss";
</style>
