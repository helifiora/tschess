<script setup lang="ts">
import { Color } from "@tschess/shared";

defineProps<{ color: Color }>();
</script>

<template>
  <svg
    viewBox="0 0 381.71 347.65"
    class="piece"
    :class="{
      'piece--black': color === Color.black,
      'piece--white': color === Color.white,
    }"
  >
    <g>
      <path
        d="M49.39,201.81c89.07-15.72,220.06-15.72,282.93,0l21-125.75L279.93,191.33V44.62L222.29,186.09,190.85,28.9,159.42,186.09,101.78,39.38V191.33L28.43,76.06Z"
      />
      <path
        d="M49.39,201.81c0,21,15.72,21,26.2,41.92,10.48,15.72,10.48,10.48,5.24,36.68-15.72,10.48-10.48,52.39-10.48,52.39,68.11,10.48,172.9,10.48,241,0,0,0,5.24-41.92-10.48-52.39-5.24-26.2-5.24-21,5.24-36.68,10.48-21,26.2-21,26.2-41.92C243.25,186.09,138.46,186.09,49.39,201.81Z"
      />
      <path d="M75.59,243.72c36.68-10.48,193.86-10.48,230.54,0" />
      <path d="M80.83,280.4c62.87-10.48,157.18-10.48,220.06,0" />
      <path d="M48.92,75.11a21,21,0,1,1-21-21A21,21,0,0,1,48.92,75.11Z" />
      <path d="M211.81,28a21,21,0,1,1-21-21A21,21,0,0,1,211.81,28Z" />
      <path d="M374.71,75.11a21,21,0,1,1-21-21A21,21,0,0,1,374.71,75.11Z" />
      <path d="M122.74,38.44a21,21,0,1,1-21-21A21,21,0,0,1,122.74,38.44Z" />
      <path d="M300.88,43.68a21,21,0,1,1-21-21A21,21,0,0,1,300.88,43.68Z" />
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
