<template>
<div class="loading" v-if="loading">
    <v-progress-circular
      color="#000"
      indeterminate
    ></v-progress-circular>
</div>
</template>

<script setup>
import { useAdminStore } from "@/store/admin";
const adminStore = useAdminStore();
const loading = computed(() => adminStore.loading);

</script>

<style lang="scss" scoped>


.loading {
    background: rgba($color: #fff, $alpha: 0.5);
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #111;
    font-size: 2rem;

}
</style>