<template>
  <UDashboardPanel id="home">
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
        <UFormField label="Header Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.title[0].text"
            placeholder="Header Title"
          />
        </UFormField>
        <UFormField label="Description">
          <div
            class="flex mt-5"
          >
            <div
              class="basis-1/2 pr-3"
              v-for="(item, index) in pageContent.description"
              :key="index"
            >
              <UTextarea
                class="w-full"
                v-model="item.text"
                placeholder="Title"
              />
            </div>
          </div>
        </UFormField>

        <div class="mt-5">
          <label for="">Images</label>
          <div class="flex">
            <div
              class="w-48 mr-3"
              v-for="(item, index) in pageContent.header_images"
              :key="index"
            >
              <NuxtImg :src="item.image.url" />

              <!--- Image Uploader (Intro Images) --->
              <div class="images-zona mt-3">
                <p class="label">Upload Our Place Image</p>
                <AdminFileUploader
                  :page="'home'"
                  :section="`header_images.${index}.image`"
                  :needPreview="false"
                  :limit="1"
                  :allowedFormat="[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/webp',
                  ]"
                  @files-dropped="
                    (file) =>
                      addMainImage(file, `uploaderHeaderImages-${index}`)
                  "
                  :ref="
                    (el) => setUploader(`uploaderHeaderImages-${index}`, el)
                  "
                ></AdminFileUploader>
                <!-- {{ files }} -->
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Block Intro -->
      <div class="block mb-5" v-if="pageContent.intro_title">
        <AdminBlockTitle :text="'Intro'" />

        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.intro_title[0].text"
            placeholder="Intro Title"
          />
        </UFormField>

        <div class="flex flex-col mt-5">
          <label for="">Description</label>
          <div
            class="basis-full mb-3"
            v-for="(item, index) in pageContent.intro_description"
            :key="index"
          >
            <UFormField label="">
              <UTextarea
                class="w-full"
                v-model="item.text"
                placeholder="Description"
              />
            </UFormField>
          </div>
        </div>

        <div class="mt-5">
          <label for="">Image</label>
          <div class="flex flex-col">

              <NuxtImg :src="pageContent.intro_image.url" />

              <!--- Image Uploader (Intro Images) --->
              <div class="images-zona mt-3">
                <p class="label">Upload Intro Image</p>
                <AdminFileUploader
                  :page="'home'"
                  :section="`intro_image`"
                  :needPreview="false"
                  :limit="1"
                  :allowedFormat="[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/webp',
                  ]"
                  @files-dropped="
                    (file) => addMainImage(file, `uploaderIntroImage`)
                  "
                  :ref="(el) => setUploader(`uploaderIntroImage`, el)"
                ></AdminFileUploader>
                <!-- {{ files }} -->
              </div>

          </div>
        </div>
      </div>

      <!-- Block slides_intro_title -->
      <div class="block mb-5" v-if="pageContent.slides_intro_title">
        <AdminBlockTitle :text="'Slides Intro'" />

        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.slides_intro_title[0].text"
            placeholder="Intro Title"
          />
        </UFormField>
        
        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.slides_scroll_text[0].text"
            placeholder="Intro Text"
          />
        </UFormField>

        <div class="mt-5">
          <label for="">Image</label>
          <div class="flex flex-col">

              <NuxtImg :src="pageContent.slides_intro_image.url" />

              <!--- Image Uploader (Intro Images) --->
              <div class="images-zona mt-3">
                <p class="label">Upload slides_intro_image Image</p>
                <AdminFileUploader
                  :page="'home'"
                  :section="`slides_intro_image`"
                  :needPreview="false"
                  :limit="1"
                  :allowedFormat="[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/webp',
                  ]"
                  @files-dropped="
                    (file) => addMainImage(file, `uploaderSlidesIntroImage`)
                  "
                  :ref="(el) => setUploader(`uploaderSlidesIntroImage`, el)"
                ></AdminFileUploader>
                <!-- {{ files }} -->
              </div>

          </div>
        </div>


        <div class="flex mt-5 border-1 border-solid rounded-md border-gray-300">
          <div
            class="basis-1/3 p-3"
            v-for="(item, index) in pageContent.slides"
            :key="index"
          >
            <UFormField label="Title">
              <UInput
                size="xl"
                class="w-full"
                v-model="item.item_title[0].text"
                placeholder="Title"
              />
            </UFormField>
            <UFormField label="Description">
              <UTextarea
                class="w-full"
                v-model="item.item_description[0].text"
                placeholder="Title"
              />
            </UFormField>
            <div class="flex">
              <div class="w-48 mt-5">
                <label for="">Image</label>
                <NuxtImg :src="item.item_image.url" />
              </div>
            </div>

            <!--- Image Uploader (Header Image) --->
            <div class="images-zona mt-3">
              <p class="label">Upload Adventures Image</p>
              <AdminFileUploader
                :page="'home'"
                :section="`slides.${index}.item_image`"
                :needPreview="false"
                :limit="1"
                :allowedFormat="[
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/webp',
                ]"
                @files-dropped="
                  (file) =>
                    addMainImage(file, `uploaderSlidesImage-${index}`)
                "
                :ref="
                  (el) => setUploader(`uploaderSlidesImage-${index}`, el)
                "
              ></AdminFileUploader>
              <!-- {{ files }} -->
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
  title: route.matched[0].components.default.__name,
  endpoint: `/api/${route.matched[0].components.default.__name}`
};
const pageContent = ref({});
const getPageContent = async () => {
  console.log("selectedLang.value ", selectedLang.value);
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
</script>