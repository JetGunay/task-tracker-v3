// import Vue from "vue";
// import Vuex from "vuex";
import axios from "axios";
import { createStore } from "vuex";

// Vue.use(Vuex);

const store = createStore({
  state: {
    auth: "Bearer eyJ0dCI6InAiLCJhbGciOiJIUzI1NiIsInR2IjoiMSJ9.eyJkIjoie1wiYVwiOjM4NDYzOTMsXCJpXCI6ODIzMzkxNixcImNcIjo0NjMyODc0LFwidVwiOjk1OTM4MTIsXCJyXCI6XCJVU1wiLFwic1wiOltcIldcIixcIkZcIixcIklcIixcIlVcIixcIktcIixcIkNcIixcIkRcIixcIk1cIixcIkFcIixcIkxcIixcIlBcIl0sXCJ6XCI6W10sXCJ0XCI6MH0iLCJpYXQiOjE2NTI3NTk5MDl9.PKRcoVPuVgGbvcDwlNPMUQi_HDXtK-uBcbMRaOiL5Wk",
    uri: "https://www.wrike.com/api/v4/",
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
    users2: [],
  },
  mutations: {
    SET_USERS(state, users2) {
      state.users2 = users2;
    },
  },
  actions: {
    getUsers({ commit }) {
      var urlParam = new URLSearchParams(window.location.search);
      var group = urlParam.get("group");
      var grpId = this.state.groups
        .filter((grp) => grp.group === group)
        .map((id) => id.id);

      var grpUri = this.state.uri + "groups/" + grpId;
      axios
        .get(grpUri, {
          headers: { Authorization: this.state.auth },
        })
        .then((r) => {
          const data = r.data.data;
          const mIds = data.map((arr) => arr.memberIds).flat();
          for (let u = 0; u < mIds.length; u++) {
            var cntctUri = this.state.uri + "contacts/" + mIds[u];
            return new Promise((resolve, reject) => {
              axios
                .get(cntctUri, {
                  headers: { Authorization: this.state.auth },
                })
                .then((r) => r.data.data)
                .then((users2) => {
                  console.log(users2);
                  commit("SET_USERS", users2);
                  resolve();
                })
                .catch((e) => {
                  console.error(e);
                  reject();
                });
            });
          }
        });
    },
  },
});
export default store;
