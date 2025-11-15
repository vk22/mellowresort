<template>
  <div>
    <draggable
      class="gallery-preview-list"
      v-model="images"
      item-key="filename"
      handle=".gallery-item"
      @start="dragging = true"
      @end="draggEnd()"
    >
      <div
        class="gallery-item-wrap"
        v-for="(image, index) in images"
        :key="index"
      >
        <div class="gallery-item-actions" v-if="image.file">
          <div
            class="remove-icon"
            @click="deleteGalleryItem(image)"
            alt="remove"
          >
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                y="14.3154"
                width="20.2454"
                height="2.38181"
                rx="1.1909"
                transform="rotate(-45 0 14.3154)"
                fill="white"
              ></rect>
              <rect
                x="1.68555"
                width="20.2454"
                height="2.38181"
                rx="1.1909"
                transform="rotate(45 1.68555 0)"
                fill="white"
              ></rect>
            </svg>
          </div>
        </div>
        <div class="gallery-item" v-if="image.file">
          <span v-if="image.file">
            <img :src="image.file.url" v-if="image.file.type.split('/')[0] === 'image'" />
            <video muted playsinline="" loop="" controls v-if="image.file.type.split('/')[0] === 'video'">
              <source :src="event.file.url" :type="event.file.type" />
            </video>
            <div class="icon-pdf" v-if="image.file.type === 'application/pdf'">
                <svg width="74" height="100" viewBox="0 0 74 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.260315 60.7912V95.8778C0.260315 97.7888 1.81021 99.3387 3.72122 99.3387H70.1667C72.0778 99.3387 73.6277 97.7888 73.6277 95.8778V60.7912C49.0983 53.1066 24.6415 53.0594 0.260315 60.7912Z" fill="#2A2A2A"/>
                <path d="M73.6277 60.7911V20.6861C63.7114 15.5413 56.8478 8.90272 53.4912 0.549561H3.72122C1.81021 0.549561 0.260315 2.09945 0.260315 4.01047V60.7911H73.6277Z" fill="#E9E9E0"/>
                <path d="M73.6277 20.6861H56.6447C54.9027 20.6861 53.4911 19.2745 53.4911 17.5325V0.549561L73.6277 20.6861Z" fill="#D9D7CA"/>
                <path d="M22.8018 69.3496H16.2773C15.3674 69.3496 14.6309 70.0872 14.6309 70.9961V81.8124V89.2194C14.6309 90.1282 15.3674 90.8659 16.2773 90.8659C17.1873 90.8659 17.9238 90.1282 17.9238 89.2194V83.4589H22.8018C25.4274 83.4589 27.5634 81.3228 27.5634 78.6972V74.1123C27.5634 71.4856 25.4274 69.3496 22.8018 69.3496ZM24.2705 78.6962C24.2705 79.5051 23.6119 80.1648 22.8018 80.1648H17.9238V72.6415H22.8018C23.6119 72.6415 24.2705 73.3012 24.2705 74.1112V78.6962Z" fill="#F9F9F9"/>
                <path d="M38.1613 90.8648H31.9573C31.0474 90.8648 30.3109 90.1271 30.3109 89.2183V70.9961C30.3109 70.0872 31.0474 69.3496 31.9573 69.3496H38.1613C40.9636 69.3496 43.2434 71.6294 43.2434 74.4318V85.7826C43.2434 88.5849 40.9636 90.8648 38.1613 90.8648ZM33.6038 87.5718H38.1613C39.147 87.5718 39.9505 86.7694 39.9505 85.7826V74.4318C39.9505 73.4461 39.1481 72.6426 38.1613 72.6426H33.6038V87.5718Z" fill="#F9F9F9"/>
                <path d="M57.6107 69.3496H47.9711C47.0622 69.3496 46.3246 70.0872 46.3246 70.9961V89.2183C46.3246 90.1271 47.0622 90.8648 47.9711 90.8648C48.8799 90.8648 49.6176 90.1271 49.6176 89.2183V81.7531H54.2837C55.1926 81.7531 55.9302 81.0155 55.9302 80.1066C55.9302 79.1978 55.1926 78.4602 54.2837 78.4602H49.6176V72.6415H57.6107C58.5195 72.6415 59.2572 71.9039 59.2572 70.995C59.2572 70.0861 58.5195 69.3496 57.6107 69.3496Z" fill="#F9F9F9"/>
                </svg>
            </div>
          </span>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script setup>
const emit = defineEmits(["delete-gallery-item", "drag-end"]);
const props = defineProps({
  images: { type: Array },
  imagesType: { type: String },
});

const imagesUpdated = ref([]);

const images = computed({
  get() {
    return props.images;
  },
  set(newValue) {
    imagesUpdated.value = newValue;
  },
});

console.log('images ', images.value)

const draggEnd = async () => {
  const data = {
    images: imagesUpdated,
    type: props.imagesType,
  };
  emit("drag-end", data);
};

const deleteGalleryItem = async (image) => {
    emit("delete-gallery-item", image);
};
</script>

<style lang="scss">
.gallery-preview-list {
  display: flex;
  flex-wrap: wrap;
}

.gallery-item-wrap {
  position: relative;
  width: 100px;
  display: inline-flex;
  margin: 0.25rem;

  .gallery-item-actions {
    position: absolute;
    top: -4px;
    right: -4px;
    display: flex;

    .remove-icon {
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      position: relative;
      width: 20px;
      height: 20px;
      background: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 99px;
      transition: all 0.15s ease;

      svg {
        transform: scale(0.5);
        transition: all 0.15s ease;
      }

      &:hover {
        background: #ba0000;
        svg {
          transform: scale(0.6);
        }
      }
    }
  }

  .gallery-item {
    width: 100%;
    cursor: move;
    display: inline-flex;
    margin: 0.25rem;
  }
}
</style>
