<template>
  <div class="block-title">
    {{ text }}
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>


.block-title {
  background: #464950;
  color: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 1rem;

  > * {
    margin: 0;
    padding: 0;
  }
}


@media (min-width: 1024px) {
}
</style>
