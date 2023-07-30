<script setup lang="ts">
import { Color } from "@tschess/shared";

defineProps<{ color: Color }>();
</script>

<template>
  <svg
    viewBox="0 0 237.73 292.27"
    class="piece"
    :class="{
      'piece--black': color === Color.black,
      'piece--white': color === Color.white,
    }"
  >
    <g>
      <path
        d="M118.86,7C97.37,7,80,23.33,80,43.49a35.13,35.13,0,0,0,7.59,21.71c-19,10.22-31.91,29.29-31.91,51.27,0,18.52,9.14,35,23.44,45.89C49.9,172,7,213,7,285.27H230.73c0-72.26-42.9-113.22-72.08-122.9,14.3-10.86,23.44-27.37,23.44-45.89,0-22-12.94-41.06-31.91-51.27a35.13,35.13,0,0,0,7.59-21.71C157.77,23.33,140.36,7,118.86,7Z"
      />
    </g>
  </svg>
</template>

<style scoped>
.piece {
  width: 48px;
  height: 48px;
  fill: purple;
  stroke: blue;
  stroke-linecap: round;
  stroke-width: 12px;
  stroke-linejoin: round;
}

.piece--black {
  fill: black;
  stroke: #cccccc;
}

.piece--white {
  fill: white;
  stroke: #121212;
}
</style>
