<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header="{ collapsed }">
      <div class="admin-sidebar-logo" v-if="!collapsed">
        <h5>mellowresort admin</h5>
      </div>
      <UIcon
        v-else
        name="i-simple-icons-nuxtdotjs"
        class="size-5 text-primary mx-auto"
      />
    </template>

    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="links"
        orientation="vertical"
        tooltip
        popover
      />
    </template>

    <template #footer="{ collapsed }">
      <!-- <UserMenu :collapsed="collapsed" /> -->
    </template>
  </UDashboardSidebar>
</template>

<script setup>
import { ref, defineExpose } from "vue";
const open = ref(false);
const links = [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/admin",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Surfing",
    icon: "i-lucide-inbox",
    to: "/admin/surfing",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Our place",
    icon: "i-lucide-inbox",
    to: "/admin/our-place",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Retreats Standart",
    icon: "i-lucide-inbox",
    to: "/admin/retreats/standart",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "About",
    icon: "i-lucide-inbox",
    to: "/admin/about",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },

    {
    label: "Sustainability",
    icon: "i-lucide-inbox",
    to: "/admin/sustainability",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Giving Back",
    icon: "i-lucide-inbox",
    to: "/admin/giving-back",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Team",
    icon: "i-lucide-inbox",
    to: "/admin/team",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Help Center",
    icon: "i-lucide-inbox",
    to: "/admin/help-center",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Policies",
    icon: "i-lucide-inbox",
    to: "/admin/policies",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
  {
    label: "Journal",
    icon: "i-lucide-inbox",
    to: "/admin/journal",
    // badge: "4",
    onSelect: () => {
      open.value = false;
    },
  },
];
</script>


<style lang="scss" scoped>
</style>
