<template>
  <div :class="[$style.arrowButton]" data-cursor-pointer>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 31">
      <path d="M10.13 10.155c0-2.796-.74-4.317-.74-6.743h.116c2.027 4.81 4.286 6.579 6.624 8.141L18 9.251C13.91 6.907 11.61 4.44 9.701 0H8.338C6.428 4.44 4.09 6.907 0 9.25l1.91 2.303c2.298-1.562 4.558-3.33 6.583-8.14h.117c0 2.425-.74 3.946-.74 6.742V31h2.26V10.155Z" />
    </svg>
  </div>
</template>

<script setup>

</script>

<style lang="scss" module>
@use "sass:math";
@use "sass:map";
@use "sass:meta";
@use "~/assets/sass/util/_fonts.scss" as *;
@use "~/assets/sass/util/_mixins.scss" as *;
@use "~/assets/sass/util/_variables.scss" as *;
@use "~/assets/sass/util/_breakpoints.scss" as *;
.arrowButton {
  width: 60px;
  height: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    border: 1px solid currentColor;
    border-radius: 50%;
    box-sizing: border-box;
    opacity: 0;
    transition: transform 1s $curve, opacity 1s $curve;
  }
  svg {
    width: 26%;
    fill: currentColor;
    position: relative;
    z-index: 1;
  }
  &:hover {
    &::before {
      transform: scale(1.1);
      opacity: 1;
    }
  }
  @include respond-to('desktop') {
    width: 40px;
    height: 40px;
  }
}
</style>
