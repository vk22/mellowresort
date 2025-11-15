<template>
  <UApp :toaster="toaster">
    <!-- <AdminDialogWindow />
    <AdminLoading /> 
    <AdminHeader />-->
    <UDashboardGroup unit="rem">
      <AdminSidebar />
      <slot />
    </UDashboardGroup>
  </UApp>
</template>
<script setup>
const toaster = { position: 'bottom-left' }
useHead({
  meta: [
    { name: "description", content: "" },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "noindex" },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
});
</script>

<style lang="scss">
//@use "~/assets/scss/admin.scss";
</style>

