declare const enum Color {
    black = "black",
    white = "white"
}
declare function colorInvert(color: Color): Color;

type Column = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
declare class Cell {
    readonly row: Row;
    readonly column: Column;
    readonly value: string;
    constructor(row: Row, column: Column);
    toPosition(): Position;
    static parseRaw(rawRow: number, rawColumn: string): Cell;
    static parseNumber(rowNumber: number, columnNumber: number): Cell;
}

declare class Position {
    #private;
    constructor(x: number, y: number);
    get x(): number;
    get y(): number;
    equals(other: Position): boolean;
    toString(): string;
    add(x: number, y: number): void;
    toAdd(x: number, y: number): Position;
    toCell(): Cell;
    canAdd(x: number, y: number): boolean;
    clone(): Position;
}

type PieceOptions = {
    moveCount?: number;
    position?: Position | null;
};
declare abstract class Piece {
    #private;
    readonly color: Color;
    constructor(color: Color, override?: PieceOptions);
    incrementMoveCount(amount?: number): void;
    set position(value: Position | null);
    get position(): Position;
    get onboard(): boolean;
    get moveCount(): number;
    abstract movements(board: Board): Iterable<Position>;
    abstract clone(): Piece;
    protected getPosition(): Position | null;
}

type Options = {
    moveCount?: number;
    position?: Position | null;
};
declare class King extends Piece {
    #private;
    constructor(color: Color, override?: Options);
    movements(board: Board): Iterable<Position>;
    clone(): King;
}

type DataItem = Piece | null;
type DataLine = [
    DataItem,
    DataItem,
    DataItem,
    DataItem,
    DataItem,
    DataItem,
    DataItem,
    DataItem
];
type Data = [
    DataLine,
    DataLine,
    DataLine,
    DataLine,
    DataLine,
    DataLine,
    DataLine,
    DataLine
];
declare class Table {
    #private;
    static minValue: number;
    static maxValue: number;
    constructor(value: Data);
    clone(): Table;
    clear(position: Position): void;
    exists(position: Position): boolean;
    get(position: Position): Piece | null;
    put(piece: Piece, position: Position): void;
    generatePiece(): Generator<Piece>;
    static isInvalid(x: number, y: number): boolean;
    static isValid(x: number, y: number): boolean;
    static empty(): Table;
    static generatePosition(): Generator<Position>;
}

declare class Board {
    #private;
    constructor(table: Table);
    clone(): Board;
    get(position: Position): Piece | null;
    getKing(color: Color): King;
    getTeamPieces(color: Color): Piece[];
    isEmpty(position: Position): boolean;
    isOccupied(position: Position): boolean;
    move(piece: Piece, position: Position): Piece | null;
    static empty(): Board;
    static initial(): Board;
}

declare class Game {
    #private;
    constructor(board: Board, currentTeam: Color);
    get turn(): Color;
    get isCheckmate(): Color | null;
    get isCheck(): Color | null;
    play(origin: Position, destiny: Position): void;
    moves(position: Position): Position[];
    getPiece(position: Position): Piece | null;
    get capturedPieces(): Piece[];
    static initial(): Game;
}

export { Cell, Color, Game, Position, colorInvert };
