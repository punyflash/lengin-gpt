<script lang="ts">
import { liveQuery } from "dexie";
import { Link } from "@inertiajs/vue3";
import { useObservable } from "@vueuse/rxjs";
import LenginLogoSvg from "@/components/SVG/LenginLogo.svg.vue";
import db, { type Chat } from "@/database";

export default {
    components: {
        Link,
        LenginLogoSvg,
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
    },
};
</script>

<template>
    <div class="drawer lg:drawer-open">
        <input id="sidebar" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
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
                <ul class="menu w-80 flex-1">
                    <li>
                        <Link
                            class="btn btn-outline btn-sm"
                            :href="route('chat.index')"
                        >
                            + New Chat
                        </Link>
                    </li>
                    <li v-for="chat in chats" :key="chat.id" class="join">
                        <Link
                            class="join-item"
                            :href="route('chat.show', chat.id)"
                        >
                            {{ chat.name }}
                        </Link>
                        <button class="join-item" @click="deleteChat(chat)">
                            Delete
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
