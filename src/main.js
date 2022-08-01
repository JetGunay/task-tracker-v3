import { createApp, h } from "vue";
// import Vue from "vue";
import App from "./App.vue";
// import { store } from "./store";

//Datepicker
import DatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
//QuillEditor
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap";
import "./styles/global.scss";

// createApp(store, App).mount("#app");
const app = createApp({
  render: () => h(App),
});

// app.use(store);
app.component("DatePicker", DatePicker);
app.component("QuillEditor", QuillEditor);
app.mount("#app");

// const app = Vue.createApp({});
// app.config.globalProperties.$http = axios;
