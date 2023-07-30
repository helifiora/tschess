import { Color, type GameDataResult } from "@tschess/shared";
import { Board } from "../board/board.ts";

export class CreateInitialGame {
  async execute(): Promise<GameDataResult> {
    const board = Board.initial();

    return {
      pieces: board.toData(),
      currentTeam: Color.white,
      capturedPieces: [],
      isCheck: null,
      isCheckmate: false,
    };
  }
}
