<template>
  <div class="space-y-4">
    <input type="file" @change="onChange" />
    <button class="admin-sec-btn" @click="uploadFile" :disabled="!file">Загрузить</button>
    <div v-if="progress">Загрузка: {{ progress }}%</div>
    <div v-if="url">Файл загружен: <a :href="url" target="_blank">{{ url }}</a></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { upload } from '@vercel/blob/client';

const file = ref(null);
const url = ref(null);
const progress = ref(0);

const onChange = (e) => {
  const target = e.target;
  file.value = target.files?.[0] || null;
};

const uploadFile = async () => {
  if (!file.value) return;

  const blob = await upload(file.value.name, file.value, {
    access: 'public',
    allowOverwrite: true,
    handleUploadUrl: '/api/blob-upload-url',
    onUploadProgress(p) {
      progress.value = Math.round(p.percentage);
    },
  });

  url.value = blob.url;
};
</script>
