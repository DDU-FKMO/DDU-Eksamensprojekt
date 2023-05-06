import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import ToastPlugin from "vue-toast-notification";
// Import one of the available themes
import "vue-toast-notification/dist/theme-default.css";

// Import stylesheet
import "./assets/main.css";

const app = createApp(App);

app.use(router);
app.use(ToastPlugin, {
	position: "top-right",
	duration: 5000,
	dismissible: true
});

app.mount("#app");
