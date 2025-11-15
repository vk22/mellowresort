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

        <div class="flex flex-col">
          <div class="w-48 mt-5">
            <label for="">Image</label>
            <NuxtImg :src="pageContent.header_image.url" />
          </div>

        <!--- Image Uploader (Header Image) --->
        <div class="w-48 images-zona mt-3">
          <p class="label">Upload Header Image</p>
          <AdminFileUploader
            :page="'home'"
            :section="'header_image'"
            :needPreview="false"
            :limit="1"
            :allowedFormat="[
              'image/png',
              'image/jpeg',
              'image/jpg',
              'image/webp',
            ]"
            @files-dropped="(file) => addMainImage(file, 'uploaderHeaderImage')"
            :ref="(el) => setUploader('uploaderHeaderImage', el)"
          ></AdminFileUploader>
          <!-- {{ files }} -->
        </div>

        </div>


      </div>

      <!-- Block Adventures -->
      <div class="block mb-5" v-if="pageContent.adventures_title">
        <div class="block-header">
          <h3>Adventures</h3>
        </div>
        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.adventures_title[0].text"
            placeholder="Adventures Title"
          />
        </UFormField>
        <div class="flex mt-5 border-1 border-solid rounded-md border-gray-300">
          <div
            class="basis-1/3 p-3"
            v-for="(item, index) in pageContent.adventures"
            :key="index"
          >
            <UFormField label="Title">
              <UInput
                size="xl"
                class="w-full"
                v-model="item.title[0].text"
                placeholder="Title"
              />
            </UFormField>
            <UFormField label="Description">
              <UTextarea
                class="w-full"
                v-model="item.description[0].text"
                placeholder="Title"
              />
            </UFormField>
            <UFormField label="Link">
              <UInput
                size="xl"
                class="w-full"
                v-model="item.link.slug"
                placeholder="Link"
              />
            </UFormField>
            <div class="flex">
              <div class="w-48 mt-5">
                <label for="">Image</label>
                <NuxtImg :src="item.image.url" />
              </div>
            </div>

            <!--- Image Uploader (Header Image) --->
            <div class="images-zona mt-3">
              <p class="label">Upload Adventures Image</p>
              <AdminFileUploader
                :page="'home'"
                :section="`adventures.${index}.image`"
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
                    addMainImage(file, `uploaderAdventuresImage-${index}`)
                "
                :ref="
                  (el) => setUploader(`uploaderAdventuresImage-${index}`, el)
                "
              ></AdminFileUploader>
              <!-- {{ files }} -->
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
          <label for="">Images</label>
          <div class="flex">
            <div
              class="w-48 mr-3"
              v-for="(item, index) in pageContent.intro_images"
              :key="index"
            >
              <NuxtImg :src="item.image.url" />

              <!--- Image Uploader (Intro Images) --->
              <div class="images-zona mt-3">
                <p class="label">Upload Adventures Image</p>
                <AdminFileUploader
                  :page="'home'"
                  :section="`intro_images.${index}.image`"
                  :needPreview="false"
                  :limit="1"
                  :allowedFormat="[
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/webp',
                  ]"
                  @files-dropped="
                    (file) => addMainImage(file, `uploaderIntroImages-${index}`)
                  "
                  :ref="(el) => setUploader(`uploaderIntroImages-${index}`, el)"
                ></AdminFileUploader>
                <!-- {{ files }} -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Block Video -->
      <div class="block mb-5" v-if="pageContent.title">
        <AdminBlockTitle :text="'Video'" />
        <div class="flex">
          <div class="w-48 mt-5">
            <label for="">Video cover</label>
            <NuxtImg :src="pageContent.video_cover.url" />

            <!--- Image Uploader (Intro Images) --->
            <div class="images-zona mt-3">
              <p class="label">Upload Video Cover</p>
              <AdminFileUploader
                :page="'home'"
                :section="`video_cover`"
                :needPreview="false"
                :limit="1"
                :allowedFormat="[
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/webp',
                ]"
                @files-dropped="
                  (file) => addMainImage(file, `uploaderVideoCover`)
                "
                :ref="(el) => setUploader(`uploaderVideoCover`, el)"
              ></AdminFileUploader>
              <!-- {{ files }} -->
            </div>
          </div>
        </div>
      </div>

      <!-- Block Our Place -->
      <div class="block mb-5" v-if="pageContent.our_place_title">
        <AdminBlockTitle :text="'Our Place'" />
        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.our_place_title[0].text"
            placeholder="Intro Title"
          />
        </UFormField>

        <div class="mt-5">
          <label for="">Images</label>
          <div class="flex">
            <div
              class="w-48 mr-3"
              v-for="(item, index) in pageContent.our_place_images"
              :key="index"
            >
              <NuxtImg :src="item.image.url" />

              <!--- Image Uploader (Intro Images) --->
              <div class="images-zona mt-3">
                <p class="label">Upload Our Place Image</p>
                <AdminFileUploader
                  :page="'home'"
                  :section="`our_place_images.${index}.image`"
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
                      addMainImage(file, `uploaderOurPlaceImages-${index}`)
                  "
                  :ref="
                    (el) => setUploader(`uploaderOurPlaceImages-${index}`, el)
                  "
                ></AdminFileUploader>
                <!-- {{ files }} -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="tools-panel">
        <div class="relative w-full">
          <div class="flex justify-end relative p-4 w-full">
            <UButton
              color="success"
              size="lg"
              icon="i-lucide-folder"
              @click="saveData()"
              >Save</UButton
            >
          </div>
        </div>
      </div> -->
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
  console.log("uploaders.value ", uploaders.value);
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