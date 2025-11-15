<template>
  <div :class="[$style.checkBox]">
    <input
      :class="$style.field"
      type="checkbox"
      :id="name"
      :name="name"
      :required="required"
      :checked="modelValue"
      @change="onChange"
    />
    <div :class="$style.box"></div>
    <label :class="$style.label" :for="name">
      {{ asText(label) }}
    </label>
  </div>
</template>

<script setup>
import { asText } from '@prismicio/helpers'
const props = defineProps({
  label: { type: [Array, String], default: () => [] },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  emit('update:modelValue', e.target.checked)
}
</script>

<style lang="scss" module>
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.checkBox {
  width: 100%;
  font-size: 14px;
  position: relative;
  display: flex;
  align-items: flex-start;

  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    cursor: pointer;

    &:checked ~ .box {
      background: currentColor;
    }
  }

  .box, .label {
    position: relative;
    z-index: 0;
  }

  .box {
    width: 12px;
    height: 12px;
    border: 1px solid currentColor;
    box-sizing: border-box;
    margin-right: 10px;
    transform: translateY(6px);
    transition: background 1s $curve;
  }

  .label {
    display: inline-block;
  }
}
</style>
