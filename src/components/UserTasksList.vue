<template>
  <div class="right-header">
    {{ userFName }} {{ userLName }}

    <!-- <div class="d-grid gap-2 d-md-block btns-container"> -->
    <!-- <div v-for="status in statuses" :key="status.index">
        <button :class="`btn btn-${status}`" @click="getStatus()" type="button">
          {{ status }}
        </button>
      </div> -->
    <!-- <span>Status: {{}}</span> -->
    <!-- <select :model="statuses" name="status" @change="onChange($event)">
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
    </div> -->
  </div>
  <div class="tasks">
    <div v-for="usertask in qaTasks" :key="usertask.id">
      <span style="float: right">{{ usertask.dates.start.slice(0, 10) }}</span>
      <span style="float: left">
        <!-- <span
          v-if="usertask.status === usertask.status"
          :class="`badge bg-${usertask.status}`"
          >{{ usertask.status }}</span
        > -->
        <span class="badge bg-success">
          {{ statusName }}
        </span>
      </span>
      <a :href="usertask.permalink" class="task-link">
        <p class="task-title">&nbsp;{{ usertask.title }}</p>
      </a>
    </div>
    <p>{{ foundnone }}</p>
  </div>
  <!-- {{ tasks }} -->
</template>

<script>
import axios from "axios";

export default {
  name: "TasksList",
  data() {
    return {
      token:
        "eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODIzMzkxNixcImNcIjo0NjMyODc0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTI3NTk5MDl9.PKRcoVPuVgGbvcDwlNPMUQi_HDXtK-uBcbMRaOiL5Wk",
      uri: "https://www.wrike.com/api/v4/",
      mutatedList: this.usertasks,
      statuses: ["Active", "Completed", "Deferred", "Cancelled"],
      emits: ["updatedTasks"],
      // setup(_, { emit }) {
      //   emit("updatedTasks", this.usertasks);
      // },
    };
  },
  props: {
    id: String,
    userFName: String,
    userLName: String,
    // usertasks: Object,
    qaTasks: Object,
    statusName: String,
    foundnone: String,
  },
  methods: {
    onChange(event) {
      let stat = event.target.value;
      console.log(stat);

      if (stat === null) {
        // this.usertasks;
        this.qaTasks;
        console.log(this.mutatedList);
      } else {
        var today = new Date().toISOString().slice(0, 10);
        console.log(today);
        axios
          .get(
            this.uri +
              "tasks?responsibles=[" +
              this.id +
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
            this.mutatedList = response.data.data;
            console.log(this.mutatedList.length);
            this.$emit("updateTasks", this.mutatedList);
            // var status = this.usertasks.filter(
            //   (stat) => stat.status === "Active"
            // );
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    toggle(event) {
      event.target.classList("isActive");
    },
  },
};
</script>

<style></style>
