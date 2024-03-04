import "@/app.css";
import { progress, resolve, title, ziggy } from "@/setup";
import { createInertiaApp } from "@inertiajs/vue3";
import { createApp, h } from "vue";
import { ZiggyVue, type Config } from "ziggy";

createInertiaApp({
    title,
    resolve,
    progress,
    setup({ el, App, props, plugin }) {
        const ziggyConfig = ziggy(
            props.initialPage.props?.ziggy as Config | undefined,
        );

        console.log("ziggyConfig", ziggyConfig);

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, ziggyConfig)
            .mount(el);

        delete (el as HTMLElement).dataset?.page;
    },
});
