<script setup lang="ts">
definePageMeta({
    middleware: ["auth"]
})

const user = useAuthenticatedUser();
</script>

<template>
    <h1>{{ user }}</h1>
</template>