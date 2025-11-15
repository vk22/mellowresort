<template>
  <div :class="$style.scrollPointer" />
</template>

<style lang="scss" module>
.scrollPointer {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  pointer-events: none;
  transform: translateZ(0);
}
</style>
