import { expect, test } from "vitest";
import { Board } from "../../src/board/board.ts";
import { King } from "../../src/piece/king.ts";
import { Color } from "../../src";
import { pos } from "../../src/position";
import { Bishop, Pawn, Rook } from "../../src/piece/mod";
import { Game } from "../../src";
import {
  AnotherTeamTurnError,
  NoPieceInPositionError,
  PieceMovementNotAllowedError,
} from "../../src/game/errors";

test("Should piece not have moves if team king will be in check", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.black);
  // let moves = game.moves(pos(0, 3));
  // expect(moves.length).toBe(0);
  // board.move(new Rook(Color.black), pos(0, 2));
  // moves = game.moves(pos(0, 3));
  // expect(moves.length).toBe(7);
});

test("Should raise error when get moves from piece out of they team turn", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.black);
  // expect(() => game.moves(pos(5, 5))).toThrow(AnotherTeamTurnError);
});

test("Should raise error when get moves from position that does not have piece", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.black);
  // expect(() => game.moves(pos(7, 7))).toThrow(NoPieceInPositionError);
});

test("Should move piece from origin to destiny", () => {
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

test("Should raise error play piece that is not from the team turn", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.black);
  // expect(() => game.play(pos(0, 6), pos(0, 3))).toThrow(AnotherTeamTurnError);
});

test("Should raise error play when has not piece in origin position", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.black);
  // expect(() => game.play(pos(0, 7), pos(0, 3))).toThrow(NoPieceInPositionError);
});

test("Should raise error play when piece could not move to destiny", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.white);
  // expect(() => game.play(pos(0, 6), pos(1, 3))).toThrow(
  //   PieceMovementNotAllowedError
  // );
});

test("Should play and change turn", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.white);
  // expect(game.turn).toBe(Color.white);
  // game.play(pos(0, 6), pos(0, 7));
  // expect(game.turn).toBe(Color.black);
});

test("Should apply check state", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Bishop(Color.black), pos(0, 3));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.white);
  // game.play(pos(0, 6), pos(0, 3));
  // expect(game.#isCheck).toBe(Color.black);
});

test("Should verify if is checkmate", () => {
  // const board = Board.empty();
  // board.move(new King(Color.white), pos(5, 5));
  // board.move(new King(Color.black), pos(0, 0));
  // board.move(new Rook(Color.black), pos(1, 0));
  // board.move(new Pawn(Color.black), pos(1, 1));
  // board.move(new Pawn(Color.black), pos(0, 4));
  // board.move(new Rook(Color.white), pos(0, 6));
  // const game = new Game(board, Color.white);
  // game.play(pos(0, 6), pos(0, 4));
  // expect(game.#isCheck).toBe(Color.black);
  // expect(game.#isCheckmate).toBe(Color.black);
});
