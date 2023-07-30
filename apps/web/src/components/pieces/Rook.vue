<script setup lang="ts">
import { Color } from "@tschess/shared";

defineProps<{ color: Color }>();
</script>

<template>
  <svg
    viewBox="0 0 296.93 328.37"
    class="piece"
    :class="{
      'piece--black': color === Color.black,
      'piece--white': color === Color.white,
    }"
  >
    <g>
      <path d="M7,321.37H289.93V289.93H7Z" />
      <path d="M38.44,289.93V248H258.5v41.92Z" />
      <path d="M28,59.39V7H69.87V28h52.39V7h52.39V28h52.39V7H269V59.39" />
      <path d="M237.54,221.82,253.26,248H43.68l15.72-26.2" />
      <path d="M237.54,90.83V217.51H59.39V90.83" />
      <path d="M269,59.39,237.54,90.83H59.39L28,59.39" />
      <path d="M28,59.39H269" />
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
