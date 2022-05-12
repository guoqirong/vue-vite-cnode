<script setup lang="ts">
defineExpose({
  name: 'PageWrapper',
});
</script>

<template>
  <div class="lift-content">
    <slot></slot>
  </div>
  <div class="right-content">
    <slot name="right"></slot>
  </div>
</template>

<style lang="scss" src="./index.scss"></style>