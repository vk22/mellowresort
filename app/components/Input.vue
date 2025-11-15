<template>
  <div :class="$style.input">
    <label v-if="label" :for="name">{{ label }}</label>

    <input
      :class="$style.inputField"
      :placeholder="asText(placeholder)"
      :type="type"
      :name="name"
      :required="required"
      :value="modelValue"
      @input="updateValue"
    />
  </div>
</template>

<script setup>
import { asText } from '@prismicio/helpers'
const props = defineProps({
  placeholder: { type: [Array, String], default: () => [] },
  type: { type: String, default: 'text' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' } // теперь можно явно управлять label
})

const emit = defineEmits(['update:modelValue'])

// $prismic.asText
// const asText = (val) => {
//   if (Array.isArray(val)) return val.map(i => i.text || '').join(' ')
//   return val
// }

function updateValue(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<style lang="scss" module>
.input {
  width: 100%;
  height: 60px;
  background: #212222;
  border-radius: 10px;
  position: relative;

  label {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    line-height: 1;
    padding: 0 20px;
    box-sizing: border-box;
    color: inherit;

    &[type="date"] {
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
      }
    }
  }
}
</style>
