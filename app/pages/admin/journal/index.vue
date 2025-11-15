<template>
  <UDashboardPanel id="retreats" v-if="pageContentLoaded">
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

      <div class="flex flex-col mt-25">
          <div
            class="basis-1/3 p-3 border-1 border-solid rounded-md border-gray-300 mb-5"
            v-for="(item, index) in pageContent"
            :key="index"
          >
            <UFormField label="Title">
              <UInput
                size="xl"
                class="w-full"
                v-model="item.data.title[0].text"
                placeholder="Title"
              />
            </UFormField>
            <div class="flex">
              <div class="w-48 mt-5">
                <label for="">Image</label>
                <NuxtImg :src="item.data.cover_image.url" />
              </div>
            </div>
          </div>
        </div>



    </template>
  </UDashboardPanel>
</template>

<script setup>
import { onMounted, watch, computed } from "vue";
definePageMeta({
  layout: "admin",
  //middleware: ["auth"]
});

const langs = ref(["en", "es", "fr"]);
const selectedLang = ref("en");
const route = useRoute();
const page = {
  title: 'Journal',
  endpoint: `/api/journal`
};
const pageContent = ref([]);
const getPageContent = async () => {
  console.log("selectedLang.value ", selectedLang.value);
  const { success, data } = await $fetch(page.endpoint, {
    method: "GET",
    query: {
      lang: selectedLang.value,
    },
  });
  console.log('success ', success)
  if (success) {
    pageContent.value = [...data];
  }
  console.log('pageContent.value ', pageContent.value)
};



///

const uploaders = ref({});
function setUploader(section, el) {
  if (el) uploaders.value[section] = el;
}
const addMainImage = (file, uploaderEl) => {
  console.log("addMainImage", uploaders.value[uploaderEl].getNewImages());
};

/////
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

onMounted(() => {
  getPageContent();
});

const pageContentLoaded = computed(() => pageContent.value.length);
</script>