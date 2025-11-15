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

        <UFormField label="Header Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.location_text[0].text"
            placeholder="Location text"
          />
        </UFormField>

        <div class="flex flex-col">
          <div class="w-48 mt-5">
            <label for="">Image</label>
            <NuxtImg :src="pageContent.header.url" />
          </div>

          <!--- Image Uploader (Header Image) --->
          <div class="w-48 images-zona mt-3">
            <p class="label">Upload Header Image</p>
            <AdminFileUploader
              :page="'home'"
              :section="'header'"
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

      <!-- Block Design -->
      <div class="block mb-5" v-if="pageContent.design_title">
        <AdminBlockTitle :text="'Design'" />

        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.design_title[0].text"
            placeholder="Intro Title"
          />
        </UFormField>

        <div class="flex flex-col mt-5">
          <label for="">Description</label>
          <div
            class="basis-full mb-3"
            v-for="(item, index) in pageContent.design_description"
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
            <div class="w-48 mt-5">
              <NuxtImg :src="pageContent.design_image.url" />
            </div>

            <!--- Image Uploader (Intro Images) --->
            <div class="w-48 images-zona mt-3">
              <p class="label">Upload Design Image</p>
              <AdminFileUploader
                :page="'home'"
                :section="`design_image`"
                :needPreview="false"
                :limit="1"
                :allowedFormat="[
                  'image/png',
                  'image/jpeg',
                  'image/jpg',
                  'image/webp',
                ]"
                @files-dropped="
                  (file) => addMainImage(file, `uploaderDesignImage`)
                "
                :ref="(el) => setUploader(`uploaderDesignImage`, el)"
              ></AdminFileUploader>
              <!-- {{ files }} -->
            </div>
          </div>
        </div>
      </div>

      <!-- Block Grid -->
      <div class="block mb-5" v-if="pageContent.grid">
        <div class="block-header">
          <h3>Grid</h3>
        </div>

        <div
          class="flex flex-col mt-5 border-1 border-solid rounded-md border-gray-300"
        >
          <div
            class="basis-1/3 p-3"
            v-for="(item, index) in pageContent.grid"
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
                v-if="item.item_description.length"
                class="w-full"
                v-model="item.item_description[0].text"
                placeholder="Description"
              />
            </UFormField>

            <div class="flex">
              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.image_1.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`grid.image_1`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderGridImage-1`)
                      "
                      :ref="(el) => setUploader(`uploaderGridImage-1`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
              </div>

              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.image_2.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`grid.image_2`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderGridImage-2`)
                      "
                      :ref="(el) => setUploader(`uploaderGridImage-2`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
              </div>

              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.image_3.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`grid.image_3`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderGridImage-3`)
                      "
                      :ref="(el) => setUploader(`uploaderGridImage-3`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
              </div>

              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.image_4.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`grid.image_4`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderGridImage-4`)
                      "
                      :ref="(el) => setUploader(`uploaderGridImage-4`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
              </div>

              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.image_5.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`grid.image_5`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderGridImage-5`)
                      "
                      :ref="(el) => setUploader(`uploaderGridImage-5`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
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


            <!-- Block Grid -->
      <div class="block mb-5" v-if="pageContent.our_environment_title">
        <div class="block-header">
          <h3>Our environment</h3>
        </div>
        <UFormField label="Title">
          <UInput
            size="xl"
            class="w-full"
            v-model="pageContent.our_environment_title[0].text"
            placeholder="Adventures Title"
          />
        </UFormField>

        <div
          class="flex flex-col mt-5 border-1 border-solid rounded-md border-gray-300"
        >
          <div
            class="basis-1/3 p-3"
            v-for="(item, index) in pageContent.our_environment_items"
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
                v-if="item.item_description.length"
                class="w-full"
                v-model="item.item_description[0].text"
                placeholder="Description"
              />
            </UFormField>

            <div class="flex">
              <div class="flex basis-1/5 mr-1">
                <div class="">
                  <label for="">Image</label>
                  <NuxtImg :src="item.item_image.url" />

                  <div class="images-zona mt-3">
                    <p class="label">Upload Image</p>
                    <AdminFileUploader
                      :page="'home'"
                      :section="`our_environment_items.${index}.item_image`"
                      :needPreview="false"
                      :limit="1"
                      :allowedFormat="[
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/webp',
                      ]"
                      @files-dropped="
                        (file) => addMainImage(file, `uploaderEnvironmentItems-${index}`)
                      "
                      :ref="(el) => setUploader(`uploaderEnvironmentItems-${index}`, el)"
                    ></AdminFileUploader>
                  </div>
                </div>
              </div>

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
const toast = useToast();
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

    pageContent.value.grid.map((item) => {
      console.log("item", item.item_description.length);
      if (!item.item_description.length) {
        item.item_description.push({
          type: "paragraph",
          text: "",
          spans: [],
        });
      }
      return item;
    });
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