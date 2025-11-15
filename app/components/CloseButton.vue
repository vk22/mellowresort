<template>
  <button
    :class="$style.closeButton"
    data-cursor-pointer
    @click="emit('click')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M14.69 15.228.77 1.308l.538-.537 13.92 13.92-.538.537Z" clip-rule="evenodd"/>
      <path fill-rule="evenodd" d="M.437 14.354 14.356.435l1.21 1.21-13.92 13.92-1.21-1.21Z" clip-rule="evenodd"/>
    </svg>
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])
</script>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.closeButton {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $black;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: $white;
    border-radius: 50%;
    transition: transform 1s $curve;
  }

  svg {
    width: 26%;
    height: 26%;
    fill: currentColor;
    position: relative;
    z-index: 1;
  }

  &:hover::before {
    transform: scale(1.1);
  }

  @include respond-to('desktop-extra-large') {
    width: toVW(60);
    height: toVW(60);
  }

  @include respond-to('desktop') {
    width: 40px;
    height: 40px;
  }
}
</style>
