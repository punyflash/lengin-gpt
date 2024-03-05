<script setup lang="ts">
import Chat from "@/components/Layouts/Chat.vue";
import { ref, watch, onUnmounted } from "vue";
import SendIconSvg from "@/components/SVG/SendIcon.svg.vue";
import db, { type Message } from "@/utils/database";
import { useRoute } from "vue-router";
import { resize } from "@/utils/helpers";

const route = useRoute();
const chatId = ref(Number(route.params.id));
const message = ref("");
const loading = ref(false);
const messages = ref([] as Message[]);

watch(
    () => route.params.id,
    (val) => {
        chatId.value = Number(val);
        useMessages(destroyMessages);
    },
);

const destroyMessages = useMessages();

onUnmounted(() => {
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

    loading.value = true;

    await db.createMessage({
        chatId: chatId.value,
        content: message.value,
        role: "user",
    });

    message.value = "";
    loading.value = false;
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
