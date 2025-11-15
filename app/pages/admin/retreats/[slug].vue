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

      <!-- Block Header -->
      <div class="block mb-5">
        <AdminBlockTitle :text="'Header'" />
        <UFormField label="Header Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.title[0].text"
            placeholder="Header Title"
          />
        </UFormField>

        <UFormField label="Header Duration">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.duration[0].text"
            placeholder="duration text"
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
              @files-dropped="
                (file) => addMainImage(file, 'uploaderHeaderImage')
              "
              :ref="(el) => setUploader('uploaderHeaderImage', el)"
            ></AdminFileUploader>
            <!-- {{ files }} -->
          </div>
        </div>
      </div>

      <!-- Block Map -->
      <div class="block mb-5">
        <AdminBlockTitle :text="'Map'" />
        <UFormField label="Map Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.map_title[0].text"
            placeholder="Map Title"
          />
        </UFormField>

        <UFormField label="Description">
          <div class="flex mt-5">
            <div
              class="basis-1/2 pr-3"
              v-for="(item, index) in pageContent.map_description"
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

        <UFormField label="Map Location Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.map_location_title[0].text"
            placeholder="Map Location Title"
          />
        </UFormField>

        <UFormField label="Map Coords">
          <div class="flex">
            <UInput
              size="xl"
              class="w-full"
              v-model="pageContent.map_location.latitude"
              placeholder="Map Latitude"
            />
            <UInput
              size="xl"
              class="w-full"
              v-model="pageContent.map_location.longitude"
              placeholder="Map Longitude"
            />
          </div>
        </UFormField>
      </div>


      <!-- Highlights -->
      <div class="block mb-5">
        <AdminBlockTitle :text="'Highlights'" />
        <UFormField label="Highlights Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.highlights_title[0].text"
            placeholder="Highlights Title"
          />
        </UFormField>
        <UFormField label="Highlights Subtitle">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.highlights_subtitle[0].text"
            placeholder="Highlights Title"
          />
        </UFormField>
        <UFormField label="Items">
          <div class="flex flex-col mt-5">
            <div
              class="basis-1/2 mb-3"
              v-for="(item, index) in pageContent.highlights_items"
              :key="index"
            >
              <UTextarea
                class="w-full"
                v-model="item.text"
                placeholder="Item"
              />
            </div>
          </div>
        </UFormField>
        <div class="flex flex-col">
          <div class="w-48 mt-5">
            <label for="">Image</label>
            <NuxtImg :src="pageContent.highlights_image.url" />
          </div>

          <!--- Image Uploader (Header Image) --->
          <div class="w-48 images-zona mt-3">
            <p class="label">Upload Header Image</p>
            <AdminFileUploader
              :page="'home'"
              :section="'highlights_image'"
              :needPreview="false"
              :limit="1"
              :allowedFormat="[
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/webp',
              ]"
              @files-dropped="
                (file) => addMainImage(file, 'uploaderHighlightsImage')
              "
              :ref="(el) => setUploader('uploaderHighlightsImage', el)"
            ></AdminFileUploader>
            <!-- {{ files }} -->
          </div>
        </div>
        <div class="block mt-5">
        <UFormField label="What is included Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.what_is_included_title[0].text"
            placeholder="Highlights Title"
          />
        </UFormField>
        <UFormField label="Highlights Subtitle">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.what_is_included_subtitle[0].text"
            placeholder="Highlights Title"
          />
        </UFormField>
        <UFormField label="Items">
          <div class="flex flex-col mt-5">
            <div
              class="basis-1/2 mb-3"
              v-for="(item, index) in pageContent.what_is_included_items"
              :key="index"
            >
              <UTextarea
                class="w-full"
                v-model="item.text"
                placeholder="Item"
              />
            </div>
          </div>
        </UFormField>
        </div>
      </div>

      <!-- Features -->
       <div class="block mb-5">
        <AdminBlockTitle :text="'Features'" />
        <UFormField label="Features Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.features_title[0].text"
            placeholder="Features Title"
          />
        </UFormField>

        <div class="flex mt-5 border-1 border-solid rounded-md border-gray-300">
          <div
            class="basis-1/3 p-3"
            v-for="(item, index) in pageContent.features"
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
              <p class="label">Upload features Image</p>
              <AdminFileUploader
                :page="'home'"
                :section="`features.${index}.item_image`"
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
                    addMainImage(file, `uploaderFeaturesImage-${index}`)
                "
                :ref="
                  (el) => setUploader(`uploaderFeaturesImage-${index}`, el)
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
const route = useRoute();
definePageMeta({
  layout: "admin",
  //middleware: ["auth"]
});

const langs = ref(["en", "es", "fr"]);
const selectedLang = ref("en");
const page = {
  title: "Our place page",
  endpoint: `/api/retreats/${route.params.slug}`,
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

const pageContentLoaded = computed(() => Object.keys(pageContent.value).length);
</script>