import App from "@/App.vue";
import "@/app.css";
import { createApp } from "vue";
import { head, router } from "./utils";

const el = document.getElementById("app")!;

createApp(App, { ...el.dataset })
    .use(router)
    .use(head)
    .mount(el);
