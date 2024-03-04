<script lang="ts">
import { ref } from "vue";
import ChatLayout from "@/components/Layouts/Chat.vue";
import Navbar from "@/components/Chats/Navbar.vue";
import SendIconSvg from "@/components/SVG/SendIcon.svg.vue";
import db from "@/database";

export default {
    components: { Navbar, SendIconSvg },
    props: { model: String },
    layout: ChatLayout,
    setup: () => ({
        message: ref(""),
        loading: ref(false),
    }),
    methods: {
        resize(el: HTMLTextAreaElement, max: number = 300) {
            el.style.height = "auto";
            const height = el.scrollHeight > max ? max : el.scrollHeight;
            el.style.height = `${height}px`;
        },
        async submit() {
            if (!this.message) return;

            this.loading = true;

            const createdAt = Date.now();

            const chatId = await db.chats.add({
                name: this.message,
                createdAt,
            });

            await db.messages.add({
                chatId,
                createdAt,
                role: "user",
                content: this.message,
            });

            this.message = "";
            this.loading = false;
        },
    },
};
</script>

<template>
    <div class="flex h-full flex-col">
        <Navbar>
            <button class="btn btn-ghost text-xl">{{ model }}</button>
        </Navbar>
        <main class="flex flex-1 items-center justify-center p-4">
            <div
                class="container flex h-full flex-col lg:max-w-2xl xl:max-w-3xl"
            >
                <div
                    class="flex flex-1 items-center justify-center gap-4 text-3xl"
                >
                    <span class="loading loading-ring w-12 text-primary" />
                    How can I help you today?
                </div>
                <form class="relative" @submit.prevent="submit">
                    <textarea
                        v-model="message"
                        @input="resize($event.target as HTMLTextAreaElement)"
                        @keydown.enter.exact.prevent="submit"
                        rows="1"
                        class="textarea textarea-bordered w-full resize-none rounded-xl pr-12"
                        type="text"
                        required
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        class="btn btn-square btn-primary btn-sm absolute bottom-2 right-2"
                        :disabled="loading || !message"
                    >
                        <SendIconSvg class="h-6 fill-current" />
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>
