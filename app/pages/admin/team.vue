<template>
  <UDashboardPanel id="home">
    <!-- <template #header> </template> -->
    <template #body>
      <div class="tools-panel flex justify-between">
        <div class="w-80">
          <h3>{{ page.title }}</h3>
        </div>
        <div class="flex">
          <div class="w-80 flex justify-end align-center">
            <!-- <p class="font-bold text-xs p-3 flex">Select lang</p> -->
            <USelect v-model="selectedLang" :items="langs" />
          </div>
          <UButton
            class="ml-3"
            color="success"
            size="lg"
            icon="i-lucide-folder"
            @click="saveData()"
            >Save</UButton
          >
        </div>
      </div>

      <!-- Block Header -->
      <div class="block mb-5" v-if="pageContent.title">
        <AdminBlockTitle :text="'Header'" />

        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.title[0].text"
            placeholder="Header Title"
          />
        </UFormField>

      </div>


    </template>
  </UDashboardPanel>
</template>

<script setup>
import { onMounted, watch, computed, nextTick } from "vue";
definePageMeta({
  layout: "admin",
  //middleware: ["auth"]
});
import { useAdminStore } from "@/store/admin";
const adminStore = useAdminStore();

const toast = useToast();
const langs = ref(["en", "es", "fr"]);
const selectedLang = ref("en");
const route = useRoute();
const page = {
  title: route.matched[0].components.default.__name,
  endpoint: `/api/${route.matched[0].components.default.__name}`
};
const pageContent = ref({});
const getPageContent = async () => {
  const { success, data } = await $fetch(page.endpoint, {
    method: "GET",
    query: {
      lang: selectedLang.value,
    },
  });
  if (success) {
    pageContent.value = { ...data };
  }
};

/////

const newImages = [];
const uploaders = ref({});

function setUploader(section, el) {
  if (el) uploaders.value[section] = el;
}

const addMainImage = (file, uploaderEl) => {
  console.log("addMainImage", uploaders.value[uploaderEl].getNewImages());
};

////

const uploadImages = async () => {
  for (let element in uploaders.value) {
    console.log("getNewImages ", uploaders.value[element].getNewImages());
    if (uploaders.value[element].getNewImages()) {
      const response = await uploaders.value[element].startUpload();
      console.log("response ", response);
      if (response.success) {
        const findPropInpageContent = response.section
          .split(".")
          .reduce((path, curr) => {
            if (path[curr]) {
              console.log(path[curr]);
              return path[curr];
            }
          }, pageContent.value);
        console.log("pathSplit", findPropInpageContent.url);
        findPropInpageContent.url = response.data[0].url;
      }
    }
  }
};

const saveData = async () => {
  /// upload images
  await uploadImages();
  const body = { ...pageContent.value };
  const { success, message } = await $fetch(page.endpoint, {
    method: "PUT",
    query: {
      lang: selectedLang.value,
    },
    body: body,
  });
  if (success) {
    toast.add({
      title: message,
      // description: message,
      color: "success",
      icon: "i-lucide-circle-check",
    });
  } else {
    toast.add({
      title: message,
      description: message,
      color: "error",
      icon: "i-lucide-triangle-alert",
    });
  }
};

watch(selectedLang, (newValue) => {
  //   console.log('selectedLang watch ', newValue)
  getPageContent();
});

onMounted(async () => {
  await getPageContent();
  console.log("pageContent.value ", pageContent.value);
  for (let element in uploaders.value) {
    console.log("getNewImages ", uploaders.value[element].getNewImages());
  }
});

// console.log("pageContent ", pageContent.value);
</script>

<style lang="scss">
.tools-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  background: #fbfcfd;
  border-bottom: 1px solid #ededed;
  display: flex;
  z-index: 9999;
  padding: 1rem 2rem;
}
</style>