<template>
  <div class="container-fluid main">
    <div class="wrapper">
      <!-- <SideBar :title="title" :users="users" /> -->
      <div class="main-panel" style="width: 100%; padding: 10px 25px">
        <!--navbar-->
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <!-- <a class="navbar-brand" href="#">Navbar</a> -->
            <DatePicker
              v-model="datePick"
              :disabledWeekDays="[6, 0]"
              :previewFormat="format"
            />
          </div>
        </nav>

        <!-- <DashBoard
          :title="title"
          :users="users"
          :overdueTasks="overdueTasks"
          :stats="stats"
          :brands="brands"
          :tasks="tasks"
        /> -->
        <InTake :brandFolders="brandFolders" />
        <form method="post" @submit.prevent="addTask">
          <div v-for="wcbrand in wcbrands" :key="wcbrand.index">
            <div v-if="wcbrand.cat.length === 0">
              <input
                type="checkbox"
                :value="wcbrand.childIds[0]"
                v-model="checkedBrands"
              /><label :for="wcbrand.name"> {{ wcbrand.name }} </label>
            </div>
            <div v-else v-for="cat in wcbrand.cat" :key="cat.id">
              <input
                type="checkbox"
                :value="cat.childIds[0]"
                v-model="checkedBrands"
              /><label :for="cat.name">
                {{ wcbrand.name }}: {{ cat.name }}
              </label>
            </div>
          </div>

          <div>
            <ul>
              <li v-for="taskTicket in taskTickets" :key="taskTicket.id">
                <input
                  type="checkbox"
                  multiple
                  :value="taskTicket.id"
                  v-model="taskTicket.checkedTasks"
                /><label :for="taskTicket.name"> {{ taskTicket.name }} </label>
                <!-- <ul>
                  <li v-for="req in taskTicket.req" :key="req.index">
                    <input
                      type="checkbox"
                      :value="req"
                      v-model="checkedReq"
                    /><label :for="req"> {{ req }} </label>
                  </li>
                </ul> -->
              </li>
            </ul>
          </div>

          <div>
            <label for="">Project</label>
            <input type="text" name="" v-model="projTitle" />
            <input type="text" name="" v-model="projOwnerIds" />
            <!-- <input type="text" name="" v-model="taskTitle" /> -->
            <!-- <input type="text" name="" v-model="taskResponsibleIds" /> -->
          </div>
          <QuillEditor ref="myEditor" />

          {{ quill }}

          <!-- {{ checkedBrands }} -->
          <button type="submit">Submit</button>
        </form>

        <!-- This example requires Tailwind CSS v2.0+ -->
        <div>
          <label
            id="listbox-label"
            class="block text-sm font-medium text-gray-700"
          >
            Assigned to
          </label>
          <div class="mt-1 relative">
            <button
              type="button"
              class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
            >
              <span class="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                  class="flex-shrink-0 h-6 w-6 rounded-full"
                />
                <span class="ml-3 block truncate"> Tom Cook </span>
              </span>
              <span
                class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
              >
                <!-- Heroicon name: solid/selector -->
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </button>

            <!--
      Select popover, show/hide based on select state.

      Entering: ""
        From: ""
        To: ""
      Leaving: "transition ease-in duration-100"
        From: "opacity-100"
        To: "opacity-0"
    -->
            <ul
              class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              tabindex="-1"
              role="listbox"
              aria-labelledby="listbox-label"
              aria-activedescendant="listbox-option-3"
            >
              <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
      -->
              <li
                class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
                id="listbox-option-0"
                role="option"
              >
                <div class="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                    class="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
                  <span class="font-normal ml-3 block truncate">
                    Wade Cooper
                  </span>
                </div>

                <!--
          Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600"
        -->
                <span
                  class="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <!-- Heroicon name: solid/check -->
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </li>

              <!-- More items... -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
import moment from "moment";
import DatePicker from "@vuepic/vue-datepicker";
import QuillEditor from "@vueup/vue-quill";
// import "@vuepic/vue-datepicker/dist/main.css";
import { ref } from "vue";

// import SideBar from "./components/SideBar.vue";
// import DashBoard from "./components/DashBoard.vue";
import InTake from "./components/InTake.vue";
import { HTTP } from "./http-common";

export default {
  name: "App",
  data() {
    return {
      auth: "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODIzMzkxNixcImNcIjo0NjMyODc0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTI3NTk5MDl9.PKRcoVPuVgGbvcDwlNPMUQi_HDXtK-uBcbMRaOiL5Wk", //jet
      // auth: "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODI4NDk5MCxcImNcIjo0NjMzNzEzLFwidVwiOjk1NjkzMTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTY2NDU5NTF9.kXdkJT70HaKAg4Px1pNMHjSAkmT16pDx0aRSZGYdmgw", //chin
      urls: {
        default: "https://www.wrike.com/api/v4/",
        contacts: "https://www.wrike.com/api/v4/contacts/",
        workflows: "https://www.wrike.com/api/v4/workflows/",
        tasks:
          "https://www.wrike.com/api/v4/tasks?&fields=[responsibleIds,parentIds,superParentIds]&",
        activeTasks:
          "https://www.wrike.com/api/v4/tasks?&fields=[responsibleIds,parentIds,superParentIds]&status=[Active]&",
      },
      groups: [
        {
          id: "KX724M6Y",
          group: "res",
        },
        {
          id: "KX724M6Z",
          group: "pm",
        },
        {
          id: "KX724IUQ",
          group: "dev",
        },
        {
          id: "KX724M7I",
          group: "des",
        },
        {
          id: "KX724M7F",
          group: "mtn",
        },
      ],
      fields: `[responsibleIds,parentIds,superParentIds]`,
      title: [],
      users: [],
      show: false,
      overdueTasks: [],
      resID: "",
      datePick: null,
      stats: [],
      statuses: "Active, Completed, Deferred, Cancelled",
      tasks: [],
      ids: [],
      brands: [],
      today: new Date().toISOString().slice(0, 10),
      yesterday: moment().subtract(1, "day").format("YYYY-MM-DD"),
      projTitle: "",
      projOwnerIds: "",
      taskTitle: "",
      folders: [],
      brandFolders: [],
      wcbrands: [
        {
          id: "IEADVMHZI43SR33T",
          name: "Brand 1",
          cat: [],
          childIds: ["IEADVMHZI43SR4T2"],
        },
        {
          id: "IEADVMHZI43SR33T",
          name: "Brand 2",
          cat: [
            {
              id: "IEADVMHZI43SR46Z",
              name: "Sub Brand 1",
              childIds: ["IEADVMHZI43SR5EB"],
            },
            {
              id: "IEADVMHZI43TEAFQ",
              name: "Sub Brand 2",
              childIds: ["IEADVMHZI43TEAH3"],
            },
          ],
        },
        {
          id: "IEADVMHZI43SR6IH",
          name: "Brand 3",
          cat: [
            {
              id: "IEADVMHZI43SR6NQ",
              name: "Sub Brand 1",
              childIds: ["IEADVMHZI43SR6QN"],
            },
          ],
        },
      ],
      taskTickets: [],
      subtaskDes: [],
      checkedBrands: [],
      checkedTasks: [],
      checkedReq: [],
      taskTick: [],
      qlEditor: "",
      // taskResponsibleIds: "",
    };
  },
  components: {
    // SideBar,
    // DashBoard,
    InTake,
    DatePicker,
    QuillEditor,
  },
  setup() {
    const customdate = ref(new Date());

    const format = (customdate) => {
      const day = String(customdate.getDate()).padStart(2, "0");
      const month = String(customdate.getMonth() + 1).padStart(2, "0");
      const year = customdate.getFullYear();

      return `${year}-${month}-${day}`;
    };
    return {
      customdate,
      format,
    };
  },
  created() {
    var urlParam = new URLSearchParams(window.location.search);
    var grpCode = urlParam.get("group");
    var grpId = this.groups
      .filter((grp) => grp.group === grpCode)
      .map((id) => id.id);
    console.log(grpId);

    //groups
    HTTP.get(`groups/` + grpId).then((response) => {
      const data = response.data.data;
      this.title = data.map((title) => title.title);
      this.ids = data.map((arr) => arr.memberIds);
      var arrlen = this.ids[0].flat();
      console.log(this.ids[0].flat());

      //users in group
      const UserArr = [];
      for (let i = 0; i < arrlen.length; i++) {
        // var cntctUri = this.urls.contacts + arrlen[i];
        UserArr.push(
          HTTP.get(`contacts/` + arrlen[i]).then(
            (response) =>
              new Promise((resolve) => resolve(response.data.data[0]))
          )
        );
      }

      Promise.all(UserArr).then((res) => {
        this.users = res;
        console.log(this.users);
      });
      Promise.all(UserArr).then((id) => {
        this.ids = id.map((id) => id.id);

        //overdue tasks
        var endDate = decodeURIComponent(`{'end':${this.yesterday}}`);
        this.getTasks(this.ids, this.fields, "Active", "dueDate", endDate).then(
          (r) => {
            this.overdueTasks = r.sort(
              (a, b) => new Date(b.dates.due) - new Date(a.dates.due)
            );
          }
        );

        //task today
        this.getTasks(
          this.ids,
          this.fields,
          this.statuses,
          "scheduledDate",
          this.today
        ).then((r) => {
          this.tasks = r.sort(
            (a, b) => new Date(a.dates.due) - new Date(b.dates.due)
          );
          console.log(this.tasks);

          if (this.tasks.length === 0) {
            this.foundnone = "No task found.";
          } else {
            this.foundnone = "";
          }

          // brand folders
          // var brId = "IEADVMHZI4QRILWE";
          this.getAllFolders("IEADVMHZI4QRILWE").then((r) => {
            this.folders = r;

            var parentId = this.tasks.map((sp) => sp.superParentIds).flat();
            const FolderArr = [];
            for (var f = 0; f < parentId.length; f++) {
              FolderArr.push(
                this.getFolders(parentId[f]).then(
                  (r) => new Promise((resolve) => resolve(r[0]))
                )
              );
            }
            Promise.all(FolderArr).then((res) => {
              this.brands = res.flat();
            });
          });
        });
      });
    });

    //status
    HTTP.get(`workflows`)
      .then((r) => {
        var wf = r.data.data;
        Promise.all(wf.map((cs) => cs.customStatuses)).then((r) => {
          console.log((this.stats = r.flat()));
          this.stats = r.flat();
        });
      })
      .catch((e) => {
        console.error(e);
      });

    //created for intake

    this.getFolders("IEADVMHZI43OLZOR").then((r) => {
      this.childFolders = r.map((childIds) => childIds.childIds).flat();
      console.log(this.childFolders.length);
      console.log(this.childFolders);

      const ChildFolderArr = [];
      for (var c = 0; c < this.childFolders.length; c++) {
        ChildFolderArr.push(
          this.getFolders(this.childFolders[c]).then(
            (r) => new Promise((resolve) => resolve(r[0]))
          )
        );
      }
      Promise.all(ChildFolderArr).then((r) => {
        this.brandFolders = r.flat();
        console.log(this.brandFolders);
      });
    });

    fetch("./data.json")
      .then((r) => r.json())
      .then((r) => {
        this.taskTickets = r.tasks.flat();
        this.revTicket = r.rev.flat();
      });

    console.log(this.datePick);
  },
  computed: {
    selected() {
      return this.taskTickets.filter((id) => id.checkedTasks);
    },
    selectedTaskRev() {
      return this.revTicket.filter((id) => id.checkedTasks);
    },
    quill() {
      return this.qlEditor;
    },
  },
  mounted() {},
  methods: {
    async getTasks(id, fields, status, dateParams, date) {
      try {
        const r = await HTTP.get(
          `tasks?fields=${fields}&responsibles=[${id}]&status=[${status}]&${dateParams}=${date}`
        );
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async getAllFolders(folderId) {
      try {
        const r = await HTTP.get(`folders/${folderId}/folders`);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async getFolders(id) {
      try {
        const r = await HTTP.get(`folders/${id}`);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async addFolder(folderId, data) {
      try {
        const r = await HTTP.post(`folders/${folderId}/folders`, data);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async addTasktoProject(projectId, data) {
      try {
        const r = await HTTP.post(`folders/${projectId}/tasks`, data);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async updateTask(taskId, data) {
      try {
        const r = await HTTP.post(`folders/${taskId}/tasks`, data);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    async updateProject(projectId, data) {
      try {
        const r = await HTTP.put(`folders/${projectId}`, data);
        return r.data.data;
      } catch (e) {
        console.error(e);
      }
    },
    dropdown() {
      this.show = !this.show;
    },
    dateFormat(datetime) {
      let date = moment(String(datetime)).format("Do MMM YY");
      return date;
    },
    //methods for intake
    addTask() {
      var datePicked = moment(this.datePick).format("YYYY-MM-DD");
      console.log(datePicked);
      var info = {
        title: this.projTitle,
        project: {
          ownerIds: [this.projOwnerIds],
          endDate: datePicked,
        },
      };
      var selectedBrands = this.checkedBrands;

      for (let s = 0; s < selectedBrands.length; s++) {
        // var folderUri =
        //   this.urls.default + `folders/${selectedBrands[s]}/folders`;
        // var folderUri = this.urls.default + "folders/IEADVMHZI43SOLPS/folders";
        this.addFolder(selectedBrands[s], info).then((r) => {
          let projectId = r.map((id) => id.id);

          var tasksDes = this.$refs.myEditor.getHTML();
          var updateInfo = {
            description: `<p>${tasksDes}</p>`,
          };

          this.updateProject(projectId, updateInfo).then((r) => console.log(r));

          // var taskTicketId = this.checkedTasks;
          var taskId = this.selected.map((id) => id.id);
          // console.log("check " + taskTicketId);

          for (let t = 0; t < taskId.length; t++) {
            var selectedTaskTicket = this.taskTickets.filter(
              (id) => id.id === taskId[t]
            );

            var parentTitle = selectedTaskTicket
              .map((name) => name.name)
              .toString();
            var taskReq = this.selected.map((req) => req.req);
            // for (let tr = 0; tr < taskReq.length; tr++) {
            //   this.taskReqInput = `<input type="checkbox" value="${taskReq[tr]}"><label>${taskReq[tr]}</label><br>`;
            // }
            var datas = {
              title: parentTitle,
              description: `<p><input type="checkbox" value="${taskReq}"><label>${taskReq}</label><br>Start date: ${datePicked}</b></p>`,
              // dates: {
              //   start: datePicked,
              // },
              // responsibleIds: [this.taskResponsibleIds],
            };

            this.addTasktoProject(projectId, datas).then((r) => {
              console.log("task ticket " + r.map((id) => id.id).flat());
              this.taskticketIds = r.map((id) => id.id);

              var taskSubtasks = this.selected.map((sub) => sub.sub);
              for (let sub = 0; sub < taskSubtasks[t].length; sub++) {
                var subtasksData = {
                  title: taskSubtasks[t][sub],
                  superTasks: [this.taskticketIds],
                };

                console.log("ticket " + this.taskticketIds);
                this.addTasktoProject(projectId, subtasksData).then((r) => {
                  console.log(r);
                });
              }
            });

            var taskRev = selectedTaskTicket.map((rev) => rev.rev).flat();
            for (let st = 0; st < taskRev.length; st++) {
              var taskRevData = {
                title: taskRev[st],
              };

              this.addTasktoProject(projectId, taskRevData).then((r) => {
                console.log(r);
              });
            }
          }
        });
      }
    },
  },
};
</script>
