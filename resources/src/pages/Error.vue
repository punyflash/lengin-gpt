<script setup lang="ts">
import { Head } from "@inertiajs/vue3";

defineProps<{
    code: number;
    message: string;
}>();
</script>

<template>
    <Head>
        <title>{{ message }}</title>
    </Head>
    <main
        class="flex min-h-screen items-center justify-center gap-2 bg-base-100 text-base-content antialiased"
    >
        <div
            class="flex items-center justify-center gap-2 text-lg uppercase tracking-wider"
        >
            <div>
                {{ code }}
            </div>
            <div
                class="divider divider-horizontal mx-0 before:bg-base-content/60 after:bg-base-content/60"
            />
            <div>
                {{ message }}
            </div>
        </div>
    </main>
</template>
