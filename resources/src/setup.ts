import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import type { DefineComponent } from "vue";
import type { Config } from "ziggy";

export function title(title: string | undefined) {
    if (!title) return import.meta.env.VITE_APP_NAME;
    return `${title} - ${import.meta.env.VITE_APP_NAME}`;
}

export const resolve = (name: string) =>
    resolvePageComponent(
        `./pages/${name}.vue`,
        import.meta.glob<DefineComponent>("./pages/**/*.vue"),
    );

export const progress = undefined;

export function ziggy(config: Config | undefined): Config | undefined {
    return config ? { ...config, location: new URL(config.url) } : undefined;
}
