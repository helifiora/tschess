<script setup lang="ts">
import AppCell from "@/components/AppCell.vue";
import type { Cell } from "@tschess/shared";
import { Game, LocalGameGateway } from "@/composable/game";
import { onMounted } from "vue";

const game = new Game(new LocalGameGateway());

onMounted(() => game.start());

async function onClick(cell: Cell): Promise<void> {
  if (!game.hasSelected() || !game.hasMove(cell, true)) {
    await game.selectMoves(cell);
    return;
  }

  if (game.isSelected(cell)) {
    game.clearSelected();
    return;
  }

  await game.move(cell);
}

function toCell(value: number): Cell {
  const row = 8 - Math.floor(value / 8);
  const col = "abcdefgh".charAt(Math.floor(value % 8));
  return `${col}${row}` as Cell;
}

const cells = new Array(64).fill(null).map((_, i) => toCell(i));
</script>

<template>
  <main>
    <div class="app-board">
      <AppCell
        v-for="cell of cells"
        :cell="cell"
        :value="game.pieces.value[cell] ?? null"
        :highlighted="game.selectedPieceMoves.value.has(cell)"
        :origin="game.selectedCell.value === cell"
        @click="onClick(cell)"
      />
    </div>

    <div class="app-status">
      <p v-if="game.error.value !== null" class="app-status__error">
        {{ game.error }}
      </p>

      <div v-if="game.isCheck.value !== null">
        <p>{{ game.isCheck }} is in check!</p>
        <p v-if="game.isCheckmate.value">OMG! Is Checkmate</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  gap: 16px;
}

.app-board {
  align-self: flex-start;
  flex-basis: 640px;
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(8, 1fr);
  max-width: 640px;
  aspect-ratio: 1;
  background-color: #fafafa;
  border-radius: 8px;
  gap: 1px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.2);
}

.app-status {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
}

.app-status__error {
  color: red;
  font-size: 20px;
}
</style>
