<script lang="ts">
import ChatLayout from "@/components/Layouts/Chat.vue";
import Navbar from "@/components/Chats/Navbar.vue";

export default {
    components: { Navbar },
    props: { model: String },
    layout: [ChatLayout],
};
</script>

<template>
    <Navbar>
        <button class="btn btn-ghost text-xl">{{ model }}</button>
    </Navbar>
    <main class="p-4"></main>
</template>
