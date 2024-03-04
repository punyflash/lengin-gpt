import "@/app.css";
import { resolve, title, ziggy } from "@/setup";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString as render } from "@vue/server-renderer";
import { createSSRApp, h } from "vue";
import { ZiggyVue, type Config } from "ziggy";

createServer((page) =>
    createInertiaApp({
        page,
        render,
        title,
        resolve,
        setup({ App, props, plugin }) {
            const ziggyConfig = ziggy(page.props?.ziggy as Config | undefined);

            return createSSRApp({ render: () => h(App, props) })
                .use(ZiggyVue, ziggyConfig)
                .use(plugin);
        },
    }),
);
