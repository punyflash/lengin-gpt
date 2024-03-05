import "@/app.css";
import { createApp } from "vue";
import { RouterView } from "vue-router";
import { head, router } from "./utils";

const el = document.getElementById("app")!;

createApp(RouterView, { ...el.dataset })
    .use(router)
    .use(head)
    .mount(el);
