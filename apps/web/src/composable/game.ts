import { computed, reactive } from "vue";
import type { Cell, GameDataResult, RawPiece } from "@tschess/shared";
import { Color } from "@tschess/shared";
import { CreateInitialGame, GetPieceMoves, MovePiece } from "@tschess/core";

interface GameGateway {
  create(): Promise<GameDataResult>;
  getMoves(origin: Cell): Promise<Cell[]>;
  move(origin: Cell, destiny: Cell): Promise<GameDataResult>;
}

interface GameData {
  capturedPieces: Set<RawPiece>;
  currentTeam: Color;
  error: string | null;
  isCheckmate: boolean;
  isCheck: Color | null;
  pieces: Partial<Record<Cell, RawPiece>>;
  selectedCell: Cell | null;
  selectedPieceMoves: Set<Cell>;
}

export class LocalGameGateway implements GameGateway {
  #data: GameDataResult | null = null;

  async create(): Promise<GameDataResult> {
    const useCase = new CreateInitialGame();
    this.#data = await useCase.execute();
    return this.#data;
  }

  async getMoves(origin: Cell): Promise<Cell[]> {
    if (this.#data === null) {
      throw "there is no game created";
    }

    const useCase = new GetPieceMoves(this.#data);
    const result = await useCase.execute(origin);
    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async move(origin: Cell, destiny: Cell): Promise<GameDataResult> {
    if (this.#data === null) {
      throw "there is no game created";
    }

    const useCase = new MovePiece(this.#data);
    const result = await useCase.execute(origin, destiny);
    if (!result.success) {
      throw result.error;
    }

    this.#data = result.data;
    return this.#data;
  }
}

export class Game {
  #gateway: GameGateway;
  #state: GameData;

  capturedPieces = computed(() => this.#state.capturedPieces);
  currentTeam = computed(() => this.#state.currentTeam);
  error = computed(() => this.#state.error);
  isCheck = computed(() => this.#state.isCheck);
  isCheckmate = computed(() => this.#state.isCheckmate);
  pieces = computed(() => this.#state.pieces);
  selectedCell = computed(() => this.#state.selectedCell);
  selectedPieceMoves = computed(() => this.#state.selectedPieceMoves);

  constructor(gateway: GameGateway) {
    this.#gateway = gateway;
    this.#state = reactive({
      capturedPieces: new Set(),
      currentTeam: Color.white,
      error: null,
      isCheck: null,
      isCheckmate: false,
      pieces: {},
      selectedCell: null,
      selectedPieceMoves: new Set(),
    });
  }

  async move(destiny: Cell): Promise<void> {
    if (this.#state.selectedCell === null) {
      this.#state.error = "There must be an origin!";
      return;
    }

    try {
      const result = await this.#gateway.move(this.#state.selectedCell, destiny);
      this.#updateGameData(result);
      this.clearSelected();
      this.clearError();
    } catch (e) {
      if (typeof e === "string") {
        this.#state.error = e;
      }
    }
  }

  async start(): Promise<void> {
    try {
      const result = await this.#gateway.create();
      this.#updateGameData(result);
    } catch (e) {
      if (typeof e === "string") {
        this.#state.error = e;
      }
    }
  }

  async selectMoves(origin: Cell): Promise<void> {
    try {
      const result = await this.#gateway.getMoves(origin);
      if (result.length === 0) {
        this.clearSelected();
        return;
      }

      this.#state.selectedCell = origin;
      this.#state.selectedPieceMoves = new Set(result);
      this.clearError();
    } catch (e) {
      if (typeof e === "string") {
        this.#state.error = e;
        this.clearSelected();
      }
    }
  }

  clearError(): void {
    this.#state.error = null;
  }

  clearSelected(): void {
    this.#state.selectedCell = null;
    this.#state.selectedPieceMoves = new Set();
  }

  hasSelected(): boolean {
    return this.#state.selectedCell !== null;
  }

  hasMove(target: Cell, includeOrigin = false): boolean {
    if (includeOrigin && this.isSelected(target)) {
      return true;
    }

    return this.#state.selectedPieceMoves.has(target);
  }

  isSelected(cell: Cell): boolean {
    return this.#state.selectedCell === cell;
  }

  #updateGameData(data: GameDataResult): void {
    this.#state.pieces = data.pieces;
    this.#state.isCheck = data.isCheck;
    this.#state.isCheckmate = data.isCheckmate;
    this.#state.currentTeam = data.currentTeam;
    this.#state.capturedPieces = new Set(data.capturedPieces);
  }
}
