<script setup lang="ts">
import type { Cell, RawPiece } from "@tschess/shared";
import { computed } from "vue";
import Bishop from "@/components/pieces/Bishop.vue";
import King from "@/components/pieces/King.vue";
import Knight from "@/components/pieces/Knight.vue";
import Pawn from "@/components/pieces/Pawn.vue";
import Queen from "@/components/pieces/Queen.vue";
import Rook from "@/components/pieces/Rook.vue";

const props = defineProps<{
  cell: Cell;
  highlighted: boolean;
  origin: boolean;
  value: RawPiece | null;
}>();

const classes = computed(() => {
  if (props.highlighted) {
    return { "app-board__cell-highlighted": true };
  }

  if (props.origin) {
    return { "app-board__cell-origin": true };
  }

  const column = "abcdefgh".indexOf(props.cell[0]);
  const row = Number(props.cell[1]) - 1;

  const [even, odd] =
    column % 2 === 0
      ? ["app-board__cell-black", "app-board__cell-white"]
      : ["app-board__cell-white", "app-board__cell-black"];

  return row % 2 === 0 ? { [even]: true } : { [odd]: true };
});
</script>

<template>
  <button class="app-board__cell" :class="classes">
    <template v-if="value">
      <Bishop v-if="value.type === 'bishop'" :color="value.color" />
      <King v-if="value.type === 'king'" :color="value.color" />
      <Knight v-if="value.type === 'knight'" :color="value.color" />
      <Pawn v-if="value.type === 'pawn'" :color="value.color" />
      <Queen v-if="value.type === 'queen'" :color="value.color" />
      <Rook v-if="value.type === 'rook'" :color="value.color" />
    </template>
  </button>
</template>

<style scoped>
.app-board__cell {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  border: none;
  cursor: pointer;
}

.app-board__cell-white {
  background: pink;
}

.app-board__cell-black {
  background: red;
}

.app-board__cell-highlighted {
  background: blue;
}

.app-board__cell-origin {
  background: darkblue;
}
</style>
