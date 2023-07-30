import { expect, test } from "vitest";
import { GetPieceMoves, MovePiece } from "../../src";
import { Color, GameData } from "@tschess/shared";

test("Should piece not have moves if team king will be in check", async () => {
  const initial: GameData = {
    pieces: {
      a1: { type: "king", color: Color.black },
      a4: { type: "bishop", color: Color.black },
      f6: { type: "king", color: Color.white },
      a7: { type: "rook", color: Color.white },
    },
    currentTeam: Color.black,
    capturedPieces: [],
  };

  const getMoves = new GetPieceMoves(initial);
  const result = await getMoves.execute("a4");

  if (!result.success) {
    throw new Error(`Error: ${result.error}`);
  }

  expect(result.data.length).toBe(0);
});

test("Should piece not have moves if team king will be in check 2", async () => {
  const initial: GameData = {
    pieces: {
      a1: { type: "king", color: Color.black },
      c5: { type: "bishop", color: Color.black },
      a7: { type: "king", color: Color.white },
      b6: { type: "rook", color: Color.white },
    },
    currentTeam: Color.white,
    capturedPieces: [],
  };

  const getMoves = new GetPieceMoves(initial);
  const result = await getMoves.execute("b6");

  if (!result.success) {
    throw new Error(`Error: ${result.error}`);
  }

  expect(result.data.length).toBe(0);
});

test("Should raise error when get moves from piece out of they team turn", async () => {
  const initial: GameData = {
    pieces: {
      a1: { type: "king", color: Color.black },
      a7: { type: "king", color: Color.white },
      b6: { type: "rook", color: Color.white },
    },
    currentTeam: Color.black,
    capturedPieces: [],
  };

  const getMoves = new GetPieceMoves(initial);
  const result = await getMoves.execute("a7");

  if (result.success) {
    throw new Error(`There could be an error! Another team turn`);
  }

  expect(result.error).toBe("Another turn team!");
});

test("Should raise error when get moves from piece out of they team turn 2", async () => {
  const initial: GameData = {
    pieces: {
      a1: { type: "king", color: Color.black },
      a7: { type: "king", color: Color.white },
      b6: { type: "rook", color: Color.black },
    },
    currentTeam: Color.white,
    capturedPieces: [],
  };

  const getMoves = new GetPieceMoves(initial);
  const result = await getMoves.execute("b6");

  if (result.success) {
    throw new Error(`There could be an error! Another team turn`);
  }

  expect(result.error).toBe("Another turn team!");
});

test("Should raise error when get moves from position that does not have piece", async () => {
  const initial: GameData = {
    pieces: {
      a5: { type: "king", color: Color.black },
    },
    currentTeam: Color.white,
    capturedPieces: [],
  };

  const getMoves = new GetPieceMoves(initial);
  const result = await getMoves.execute("b6");

  if (result.success) {
    throw new Error(`There could be an error! No piece in position!`);
  }

  expect(result.error).toBe("No piece in position!");
});

test("Should move piece from origin to destiny", async () => {
  const initial: GameData = {
    capturedPieces: [],
    currentTeam: Color.white,
    pieces: {
      a1: { type: "king", color: Color.black },
      a4: { type: "bishop", color: Color.black },
      a7: { type: "rook", color: Color.white },
      f6: { type: "king", color: Color.white },
    },
  };

  const useCase = new MovePiece(initial);
  const result = await useCase.execute("a7", "a4");

  if (!result.success) {
    throw new Error("Should move!");
  }

  expect(result.data.pieces.a4).toEqual({
    type: "rook",
    color: Color.white,
    moveCount: 1,
  });
  expect(result.data.capturedPieces[0]).toEqual({
    type: "bishop",
    color: Color.black,
    moveCount: 0,
  });

  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const expectedPiece = board.get(pos(0, 6));
  // const game = new Game(board, Color.white);
  // game.play(pos(0, 6), pos(0, 3));
  // const captured = game.capturedPieces.at(0) ?? null;
  // expect(captured?.color).toBe(Color.black);
  // expect(captured instanceof Bishop).toBe(true);
  // expect(game.getPiece(pos(0, 3))).toEqual(expectedPiece);
  // expect(game.getPiece(pos(0, 6))).toBeNull();
});
//
// test("Should raise error play piece that is not from the team turn", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Bishop(Color.black), pos(0, 3));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.black);
//   // expect(() => game.play(pos(0, 6), pos(0, 3))).toThrow(AnotherTeamTurnError);
// });
//
// test("Should raise error play when has not piece in origin position", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Bishop(Color.black), pos(0, 3));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.black);
//   // expect(() => game.play(pos(0, 7), pos(0, 3))).toThrow(NoPieceInPositionError);
// });
//
// test("Should raise error play when piece could not move to destiny", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Bishop(Color.black), pos(0, 3));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.white);
//   // expect(() => game.play(pos(0, 6), pos(1, 3))).toThrow(
//   //   PieceMovementNotAllowedError
//   // );
// });
//
// test("Should play and change turn", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Bishop(Color.black), pos(0, 3));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.white);
//   // expect(game.turn).toBe(Color.white);
//   // game.play(pos(0, 6), pos(0, 7));
//   // expect(game.turn).toBe(Color.black);
// });
//
// test("Should apply check state", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Bishop(Color.black), pos(0, 3));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.white);
//   // game.play(pos(0, 6), pos(0, 3));
//   // expect(game.#isCheck).toBe(Color.black);
// });
//
// test("Should verify if is checkmate", () => {
//   // const board = Board.empty();
//   // board.move(new King(Color.white), pos(5, 5));
//   // board.move(new King(Color.black), pos(0, 0));
//   // board.move(new Rook(Color.black), pos(1, 0));
//   // board.move(new Pawn(Color.black), pos(1, 1));
//   // board.move(new Pawn(Color.black), pos(0, 4));
//   // board.move(new Rook(Color.white), pos(0, 6));
//   // const game = new Game(board, Color.white);
//   // game.play(pos(0, 6), pos(0, 4));
//   // expect(game.#isCheck).toBe(Color.black);
//   // expect(game.#isCheckmate).toBe(Color.black);
// });
