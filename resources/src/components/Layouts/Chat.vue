<script lang="ts">
import { liveQuery } from "dexie";
import { Link } from "@inertiajs/vue3";
import { useObservable } from "@vueuse/rxjs";
import LenginLogoSvg from "@/components/SVG/LenginLogo.svg.vue";
import TrashIconSvg from "@/components/SVG/TrashIcon.svg.vue";
import db, { type Chat } from "@/database";

export default {
    components: {
        Link,
        LenginLogoSvg,
        TrashIconSvg,
    },
    setup() {
        return {
            chats: useObservable<Chat[]>(
                // @ts-expect-error ts(2345)
                liveQuery(() =>
                    db.chats.orderBy("createdAt").reverse().limit(10).toArray(),
                ),
            ),
        };
    },
    methods: {
        deleteChat(chat: Chat) {
            if (!chat.id) return;
            db.chats.delete(chat.id);
            db.messages.where("chatId").equals(chat.id).delete();
        },
        trunc(str: string, num: number) {
            return str.length > num ? str.slice(0, num - 1) + "..." : str;
        },
    },
};
</script>

<template>
    <div class="drawer lg:drawer-open">
        <input id="sidebar" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content min-h-screen">
            <slot />
        </div>
        <div class="drawer-side">
            <label
                for="sidebar"
                aria-label="close sidebar"
                class="drawer-overlay"
            />
            <div
                class="flex min-h-full flex-col gap-4 bg-base-200 p-2 text-base-content"
            >
                <button class="btn-xl btn btn-ghost max-h-none">
                    <LenginLogoSvg class="h-12" />
                </button>
                <ul class="menu w-64 flex-1">
                    <li class="mb-2">
                        <Link
                            :disabled="route().current('chat.index')"
                            class="btn btn-outline btn-sm"
                            :href="route('chat.index')"
                        >
                            + New Chat
                        </Link>
                    </li>
                    <li v-for="chat in chats" :key="chat.id" class="group">
                        <Link
                            :disabled="route().current('chat.show', chat.id)"
                            :href="route('chat.show', chat.id)"
                            class="flex rounded-lg"
                        >
                            <span class="flex-1">
                                {{ trunc(chat.name, 30) }}
                            </span>
                            <button
                                type="button"
                                class="btn btn-square btn-error btn-xs -my-1 -mr-2 hidden items-center justify-center rounded-md group-hover:flex"
                                @click.stop.prevent="deleteChat(chat)"
                            >
                                <TrashIconSvg class="h-4 fill-current" />
                            </button>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
