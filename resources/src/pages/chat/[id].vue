<script setup lang="ts">
import Chat from "@/components/Layouts/Chat.vue";
import { ref, watch, onUnmounted, onMounted } from "vue";
import SendIconSvg from "@/components/SVG/SendIcon.svg.vue";
import db, { type Message } from "@/utils/database";
import { useRoute } from "vue-router";
import { resize } from "@/utils/helpers";
import { chat, type ChatLoading } from "@/utils/api";

const route = useRoute();
const chatId = ref(Number(route.params.id));
const message = ref("");
const loading = ref(undefined as undefined | ChatLoading);
const messages = ref([] as Message[]);
const stream = ref("");

watch(
    () => route.params.id,
    (val) => {
        chatId.value = Number(val);
        useMessages(destroyMessages);
    },
);

const destroyMessages = useMessages();

const handler = async (event: CustomEvent) => {
    const { messageId } = event.detail;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    while (messages.value[messages.value.length - 1]?.id !== messageId) {
        await sleep(10);
    }

    loading.value = chat(messages.value, (res) => (stream.value += res));
    loading.value
        .then(() => {
            db.createMessage({
                chatId: chatId.value,
                content: stream.value,
                role: "assistant",
            });

            stream.value = "";
        })
        .finally(() => (loading.value = undefined));
};

onMounted(() => {
    // @ts-expect-error ts(2769)
    window.addEventListener("message:created", handler);
});

onUnmounted(() => {
    // @ts-expect-error ts(2769)
    window.removeEventListener("message:created", handler);
    destroyMessages && destroyMessages();
});

function useMessages(unsubscribe: () => void = () => {}) {
    unsubscribe && unsubscribe();

    const query = db.getMessages((q) =>
        q.where("chatId").equals(chatId.value).toArray(),
    );

    query.subscribe({
        next: (result) => (messages.value = result),
    });

    // @ts-expect-error ts(2551)
    return query.unsubscribe as () => void;
}

async function submit() {
    if (!message.value) return;

    const messageId = await db.createMessage({
        chatId: chatId.value,
        content: message.value,
        role: "user",
    });

    message.value = "";

    window.dispatchEvent(
        new CustomEvent("message:created", { detail: { messageId } }),
    );
}
</script>

<template>
    <Chat>
        <main class="flex flex-1 items-center justify-center p-4">
            <div
                class="container flex h-full flex-col lg:max-w-2xl xl:max-w-3xl"
            >
                <div class="flex-1">
                    <div
                        v-for="message in messages"
                        :key="message.id"
                        v-bind:class="
                            message.role === 'assistant'
                                ? 'chat-start'
                                : 'chat-end'
                        "
                        class="chat"
                    >
                        <div class="prose chat-bubble">
                            {{ message.content }}
                        </div>
                    </div>
                    <div v-if="loading && stream" class="chat chat-start">
                        <div class="prose chat-bubble">{{ stream }}</div>
                    </div>
                </div>
                <form class="relative flex" @submit.prevent="submit">
                    <textarea
                        v-model="message"
                        @input="resize($event.target as HTMLTextAreaElement)"
                        @keydown.enter.exact.prevent="submit"
                        rows="1"
                        class="textarea textarea-bordered w-full resize-none pr-12"
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
    </Chat>
</template>
