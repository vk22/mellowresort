<template>
  <div :class="$style.wrap">
    <button :class="$style.btnBig">Нажми меня!</button>
  </div>
</template>

<style lang="scss" module>
.wrap {
  padding: 20px;
  .btnBig {
    font-size: 32px;
    background: #fed32c;
    border: none;
    border-radius: 8px;
    padding: 14px 28px;
    cursor: pointer;
  }
}

</style>