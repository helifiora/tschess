// src/cell.ts
var Cell = class _Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.value = `${column}${row}`;
  }
  value;
  toPosition() {
    const x = "abcdefgh".indexOf(this.column);
    const y = 8 - this.row;
    return new Position(x, y);
  }
  static parseRaw(rawRow, rawColumn) {
    if (!isRawColumn(rawColumn) || !isRawRow(rawRow)) {
      throw new Error("Could not parse cell!");
    }
    return new _Cell(rawRow, rawColumn);
  }
  static parseNumber(rowNumber, columnNumber) {
    if (!isRawRow(rowNumber) || columnNumber < 1 || columnNumber > 8) {
      throw new Error("Could not parse cell!");
    }
    const column = "abcdefgh".at(columnNumber - 1);
    return new _Cell(rowNumber, column);
  }
};
function isRawColumn(value) {
  return "abcdefgh".indexOf(value) >= 0;
}
function isRawRow(value) {
  return value >= 1 && value <= 8;
}

// src/position.ts
var Position = class _Position {
  #x;
  #y;
  constructor(x, y) {
    if (Table.isInvalid(x, y)) {
      throw new Error("Invalid Position!");
    }
    this.#x = x;
    this.#y = y;
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  equals(other) {
    return this.#x === other.#x && this.#y === other.#y;
  }
  toString() {
    return `Position[x: ${this.x}, y: ${this.y}]`;
  }
  add(x, y) {
    if (Table.isInvalid(this.#x + x, this.#y + y)) {
      throw new Error("Invalid Position!");
    }
    this.#x += x;
    this.#y += y;
  }
  toAdd(x, y) {
    return new _Position(this.#x + x, this.#y + y);
  }
  toCell() {
    return Cell.parseNumber(8 - this.#y, this.#x + 1);
  }
  canAdd(x, y) {
    return Table.isValid(this.#x + x, this.#y + y);
  }
  clone() {
    return new _Position(this.#x, this.#y);
  }
};
function pos(x, y) {
  return new Position(x, y);
}

// src/board/table.ts
var Table = class _Table {
  static minValue = 0;
  static maxValue = 7;
  #table;
  constructor(value) {
    this.#table = value;
  }
  clone() {
    const data = createData();
    for (const piece of this.generatePiece()) {
      const position = piece.position;
      data[position.y][position.x] = piece.clone();
    }
    return new _Table(data);
  }
  clear(position) {
    this.#table[position.y][position.x] = null;
  }
  exists(position) {
    return this.#table[position.y][position.x] !== null;
  }
  get(position) {
    return this.#table[position.y][position.x];
  }
  put(piece, position) {
    this.#table[position.y][position.x] = piece;
  }
  *generatePiece() {
    for (const position of _Table.generatePosition()) {
      const pieceOrNull = this.#table[position.y][position.x];
      if (pieceOrNull !== null) {
        yield pieceOrNull;
      }
    }
  }
  static isInvalid(x, y) {
    return !_Table.isValid(x, y);
  }
  static isValid(x, y) {
    const validX = x >= _Table.minValue && x <= _Table.maxValue;
    const validY = y >= _Table.minValue && y <= _Table.maxValue;
    return validX && validY;
  }
  static empty() {
    return new _Table(createData());
  }
  static *generatePosition() {
    for (let y = _Table.minValue; y <= _Table.maxValue; y++) {
      for (let x = _Table.minValue; x <= _Table.maxValue; x++) {
        yield new Position(x, y);
      }
    }
  }
};
function createData() {
  return [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ];
}

// src/color.ts
var Color = /* @__PURE__ */ ((Color2) => {
  Color2["black"] = "black";
  Color2["white"] = "white";
  return Color2;
})(Color || {});
function colorInvert(color) {
  switch (color) {
    case "black" /* black */:
      return "white" /* white */;
    case "white" /* white */:
      return "black" /* black */;
  }
}
function colorToDirection(color) {
  switch (color) {
    case "black" /* black */:
      return "bottom" /* bottom */;
    case "white" /* white */:
      return "top" /* top */;
  }
}

// src/piece/piece.ts
var Piece = class {
  color;
  #moveCount;
  #position;
  constructor(color, override = {}) {
    this.color = color;
    this.#moveCount = override.moveCount ?? 0;
    this.#position = override.position ?? null;
  }
  incrementMoveCount(amount = 1) {
    this.#moveCount += amount;
  }
  set position(value) {
    this.#position = value?.clone() ?? null;
  }
  get position() {
    if (this.#position === null) {
      throw new PieceIsNotOnBoardError();
    }
    return this.#position.clone();
  }
  get onboard() {
    return this.#position !== null;
  }
  get moveCount() {
    return this.#moveCount;
  }
  getPosition() {
    return this.#position;
  }
};
var PieceIsNotOnBoardError = class extends Error {
};

// src/movement/movement.ts
var Movement = class {
  constructor(piece, board) {
    this.piece = piece;
    this.board = board;
  }
};

// src/movement/common.ts
function* commonGenerator(board, origin, increment, options = {}) {
  const acceptanceFn = options.acceptanceFn ?? defaultAcceptance;
  const take = options.take ?? null;
  const current = origin.position;
  let count = 1;
  while (true) {
    if (hasTakenAllPieces(take, count)) {
      return;
    }
    try {
      current.add(increment[0], increment[1]);
    } catch (e) {
      return;
    }
    const targetPiece = board.get(current);
    const movementStatus = acceptanceFn(
      board,
      { piece: origin, position: origin.position },
      { piece: targetPiece, position: current }
    );
    if (movementStatus === "stop" /* stop */) {
      return;
    }
    yield current.clone();
    count += 1;
    if (movementStatus === "last" /* last */) {
      return;
    }
  }
}
function hasTakenAllPieces(take, count) {
  return take !== null && take < count;
}
function defaultAcceptance(_, origin, target) {
  if (origin.piece === null || target.piece === null) {
    return "next" /* next */;
  }
  const isDifferentTeam = origin.piece.color !== target.piece.color;
  return isDifferentTeam ? "last" /* last */ : "stop" /* stop */;
}

// src/movement/vertical.ts
var Vertical = class extends Movement {
  #direction;
  #options;
  constructor(piece, board, options = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
    this.#direction = options.direction ?? "both" /* both */;
  }
  *[Symbol.iterator]() {
    switch (this.#direction) {
      case "top" /* top */:
        yield* this.#generateTop();
        return;
      case "bottom" /* bottom */:
        yield* this.#generateBottom();
        return;
      case "both" /* both */:
        yield* this.#generateTop();
        yield* this.#generateBottom();
        return;
    }
  }
  #generateTop() {
    return commonGenerator(this.board, this.piece, [0, -1], this.#options);
  }
  #generateBottom() {
    return commonGenerator(this.board, this.piece, [0, 1], this.#options);
  }
};

// src/movement/diagonal.ts
var Diagonal = class extends Movement {
  #direction;
  #options;
  constructor(piece, board, options = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
    this.#direction = options.direction ?? "both" /* both */;
  }
  *[Symbol.iterator]() {
    switch (this.#direction) {
      case "top" /* top */:
        yield* this.#generateTopLeft();
        yield* this.#generateTopRight();
        return;
      case "bottom" /* bottom */:
        yield* this.#generateBottomLeft();
        yield* this.#generateBottomRight();
        return;
      case "both" /* both */:
        yield* this.#generateTopLeft();
        yield* this.#generateTopRight();
        yield* this.#generateBottomLeft();
        yield* this.#generateBottomRight();
        return;
    }
  }
  #generateTopLeft = () => commonGenerator(this.board, this.piece, [-1, -1], this.#options);
  #generateTopRight = () => commonGenerator(this.board, this.piece, [1, -1], this.#options);
  #generateBottomLeft = () => commonGenerator(this.board, this.piece, [-1, 1], this.#options);
  #generateBottomRight = () => commonGenerator(this.board, this.piece, [1, 1], this.#options);
};

// src/movement/horizontal.ts
var Horizontal = class extends Movement {
  #options;
  constructor(piece, board, options = {}) {
    super(piece, board);
    this.#options = { acceptanceFn: options.acceptanceFn, take: options.take };
  }
  *[Symbol.iterator]() {
    yield* this.#generateLeft();
    yield* this.#generateRight();
  }
  #generateLeft = () => commonGenerator(this.board, this.piece, [-1, 0], this.#options);
  #generateRight = () => commonGenerator(this.board, this.piece, [1, 0], this.#options);
};

// src/movement/lshape.ts
var LShape = class extends Movement {
  *[Symbol.iterator]() {
    const origin = this.piece.position;
    for (const increment of this.#increments()) {
      if (!origin.canAdd(increment[0], increment[1])) {
        continue;
      }
      const next = origin.toAdd(increment[0], increment[1]);
      if (this.#canGenerate(next)) {
        yield next;
      }
    }
  }
  #canGenerate(next) {
    const positionValue = this.board.get(next);
    if (positionValue === null) {
      return true;
    }
    return this.piece.color !== positionValue.color;
  }
  #increments() {
    return [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1]
    ];
  }
};

// src/movement/builder.ts
var MovementBuilder = class {
  #piece;
  #steps;
  constructor(piece) {
    this.#piece = piece;
    this.#steps = [];
  }
  addDiagonal(options = {}) {
    this.#steps.push((board) => new Diagonal(this.#piece, board, options));
    return this;
  }
  addHorizontal(options = {}) {
    this.#steps.push((board) => new Horizontal(this.#piece, board, options));
    return this;
  }
  addLShape() {
    this.#steps.push((board) => new LShape(this.#piece, board));
    return this;
  }
  addVertical(options = {}) {
    this.#steps.push((board) => new Vertical(this.#piece, board, options));
    return this;
  }
  build(board) {
    return generate(this.#steps, board);
  }
};
function createMovementBuilder(piece) {
  return new MovementBuilder(piece);
}
function* generate(movements, board) {
  for (const move of movements) {
    for (const item of move(board)) {
      yield item;
    }
  }
}

// src/piece/bishop.ts
var Bishop = class _Bishop extends Piece {
  movements(board) {
    return createMovementBuilder(this).addDiagonal().build(board);
  }
  clone() {
    return new _Bishop(this.color, { position: this.getPosition(), moveCount: this.moveCount });
  }
};

// src/pipe.ts
function pipe(value, ...operators) {
  return operators.reduce((s, c) => c(s), value);
}

// src/generator.ts
var Generator;
((Generator2) => {
  function filter(predicate) {
    return function* (values) {
      for (const item of values) {
        if (predicate(item)) {
          yield item;
        }
      }
    };
  }
  Generator2.filter = filter;
  function flatMap(mapper) {
    return function* (values) {
      for (const value of values) {
        for (const result of mapper(value)) {
          yield result;
        }
      }
    };
  }
  Generator2.flatMap = flatMap;
  function map(mapper) {
    return function* (values) {
      for (const item of values) {
        yield mapper(item);
      }
    };
  }
  Generator2.map = map;
  function any(predicate) {
    return function(values) {
      for (const item of values) {
        if (predicate(item)) {
          return true;
        }
      }
      return false;
    };
  }
  Generator2.any = any;
  function anyTrue() {
    return (values) => {
      for (const item of values) {
        if (item) {
          return true;
        }
      }
      return false;
    };
  }
  Generator2.anyTrue = anyTrue;
  function allMatch(predicate) {
    return (values) => {
      for (const item of values) {
        if (predicate(item)) {
          return false;
        }
      }
      return true;
    };
  }
  Generator2.allMatch = allMatch;
  function first() {
    return (values) => values.next().value ?? null;
  }
  Generator2.first = first;
  function toObject(mapper) {
    return (values) => {
      const result = Array.from(values).map(mapper);
      return Object.fromEntries(result);
    };
  }
  Generator2.toObject = toObject;
  function toMap(mapper) {
    return (values) => {
      const result = Array.from(values).map(mapper);
      return new Map(result);
    };
  }
  Generator2.toMap = toMap;
  function toArray() {
    return (values) => Array.from(values);
  }
  Generator2.toArray = toArray;
})(Generator || (Generator = {}));

// src/game/check.ts
function isInEnemyMovements(board, piece) {
  return pipe(
    board.getTeamPieces(colorInvert(piece.color)),
    Generator.flatMap((s) => s.movements(board)),
    Generator.any((s) => s.equals(piece.position))
  );
}
function canPieceMoveUndoCheck(board, piece) {
  return pipe(
    piece.movements(board),
    Generator.any((target) => !isMoveCausesCheck(board, piece.position, target))
  );
}
function isMoveCausesCheck(board, origin, target) {
  const clonedBoard = board.clone();
  const piece = clonedBoard.get(origin);
  if (piece === null) {
    return false;
  }
  clonedBoard.move(piece, target);
  const king = clonedBoard.getKing(piece.color);
  return isInEnemyMovements(clonedBoard, king);
}
function isInCheck(board, team) {
  const clonedBoard = board.clone();
  const king = clonedBoard.getKing(team);
  return isInEnemyMovements(clonedBoard, king);
}

// src/piece/king.ts
var King = class _King extends Piece {
  #recursive;
  constructor(color, override = {}) {
    super(color, override);
    this.#recursive = true;
  }
  movements(board) {
    const acceptanceFn = this.#recursive ? _King.#acceptance : void 0;
    return createMovementBuilder(this).addHorizontal({ take: 1, acceptanceFn }).addVertical({ take: 1, acceptanceFn }).addDiagonal({ take: 1, acceptanceFn }).build(board);
  }
  static #acceptance = (board, origin, target) => {
    if (target.piece && target.piece.color === origin.piece.color) {
      return "stop" /* stop */;
    }
    if (isMoveCausesCheck(board, origin.position, target.position)) {
      return "stop" /* stop */;
    }
    return "next" /* next */;
  };
  clone() {
    const cloned = new _King(this.color, {
      moveCount: this.moveCount,
      position: this.getPosition()
    });
    cloned.#recursive = false;
    return cloned;
  }
};

// src/piece/knight.ts
var Knight = class _Knight extends Piece {
  movements(board) {
    return createMovementBuilder(this).addLShape().build(board);
  }
  clone() {
    return new _Knight(this.color, { position: this.getPosition(), moveCount: this.moveCount });
  }
};

// src/piece/pawn.ts
var Pawn = class _Pawn extends Piece {
  movements(board) {
    const direction = colorToDirection(this.color);
    return createMovementBuilder(this).addVertical({
      direction,
      take: this.#take,
      acceptanceFn: _Pawn.#acceptanceVerticalFn
    }).addDiagonal({
      direction,
      take: 1,
      acceptanceFn: _Pawn.#acceptanceDiagonalFn
    }).build(board);
  }
  get #take() {
    return this.moveCount === 0 ? 2 : 1;
  }
  static #acceptanceDiagonalFn = (board, origin, target) => {
    if (target.piece === null || target.piece.color === origin.piece.color) {
      return "stop" /* stop */;
    }
    return "next" /* next */;
  };
  static #acceptanceVerticalFn = (board, origin, target) => {
    if (target.piece !== null) {
      return "stop" /* stop */;
    }
    return "next" /* next */;
  };
  clone() {
    return new _Pawn(this.color, {
      moveCount: this.moveCount,
      position: this.getPosition()
    });
  }
};

// src/piece/queen.ts
var Queen = class _Queen extends Piece {
  clone() {
    return new _Queen(this.color, { position: this.getPosition(), moveCount: this.moveCount });
  }
  movements(board) {
    return createMovementBuilder(this).addDiagonal().addHorizontal().addVertical().build(board);
  }
};

// src/piece/rook.ts
var Rook = class _Rook extends Piece {
  movements(board) {
    return createMovementBuilder(this).addVertical().addHorizontal().build(board);
  }
  clone() {
    return new _Rook(this.color, { moveCount: this.moveCount, position: this.getPosition() });
  }
};

// src/piece/factory.ts
var PieceFactory = class {
  #team;
  constructor(team) {
    this.#team = team;
  }
  createBishop() {
    return new Bishop(this.#team);
  }
  createKing() {
    return new King(this.#team);
  }
  createKnight() {
    return new Knight(this.#team);
  }
  createPawn() {
    return new Pawn(this.#team);
  }
  createQueen() {
    return new Queen(this.#team);
  }
  createRook() {
    return new Rook(this.#team);
  }
};

// src/board/errors.ts
var BoardNoKingFound = class extends Error {
  constructor() {
    super();
  }
};
var BoardMultipleKingFound = class extends Error {
  constructor(quantity) {
    super();
    this.quantity = quantity;
  }
};

// src/board/board.ts
var Board = class _Board {
  #table;
  #pieces;
  constructor(table) {
    this.#table = table;
    this.#pieces = new Set(this.#table.generatePiece());
  }
  clone() {
    return new _Board(this.#table.clone());
  }
  get(position) {
    return this.#table.get(position);
  }
  getKing(color) {
    const result = pipe(
      this.#pieces,
      Generator.filter(
        (piece) => piece instanceof King && piece.color === color
      ),
      Generator.toArray()
    );
    if (result.length === 0) {
      throw new BoardNoKingFound();
    } else if (result.length > 1) {
      throw new BoardMultipleKingFound(result.length);
    }
    return result.at(0);
  }
  getTeamPieces(color) {
    return pipe(
      this.#pieces,
      Generator.filter((piece) => piece.color === color),
      Generator.toArray()
    );
  }
  isEmpty(position) {
    return !this.#table.exists(position);
  }
  isOccupied(position) {
    return this.#table.exists(position);
  }
  move(piece, position) {
    const removedPiece = this.#removePieceFromPosition(position);
    this.#setPiece(piece, position);
    return removedPiece;
  }
  #clearPiece(piece) {
    this.#pieces.delete(piece);
    this.#table.clear(piece.position);
    piece.position = null;
  }
  #removePieceFromPosition(position) {
    const result = this.#table.get(position);
    if (result === null) {
      return null;
    }
    this.#clearPiece(result);
    return result;
  }
  #setPiece(piece, position) {
    if (!this.#pieces.has(piece)) {
      this.#pieces.add(piece);
    }
    if (piece.onboard) {
      this.#table.clear(piece.position);
    }
    this.#table.put(piece, position);
    piece.position = position;
  }
  static empty() {
    return new _Board(Table.empty());
  }
  static initial() {
    const board = _Board.empty();
    const put = (piece, position) => {
      board.#table.put(piece, position);
      board.#pieces.add(piece);
      piece.position = position;
    };
    const blackTeam = new PieceFactory("black" /* black */);
    const whiteTeam = new PieceFactory("white" /* white */);
    for (let i = 0; i < 8; i++) {
      put(blackTeam.createPawn(), pos(i, 1));
      put(whiteTeam.createPawn(), pos(i, 6));
    }
    put(blackTeam.createRook(), pos(0, 0));
    put(blackTeam.createKnight(), pos(1, 0));
    put(blackTeam.createBishop(), pos(2, 0));
    put(blackTeam.createQueen(), pos(3, 0));
    put(blackTeam.createKing(), pos(4, 0));
    put(blackTeam.createBishop(), pos(5, 0));
    put(blackTeam.createKnight(), pos(6, 0));
    put(blackTeam.createRook(), pos(7, 0));
    put(whiteTeam.createRook(), pos(0, 7));
    put(whiteTeam.createKnight(), pos(1, 7));
    put(whiteTeam.createBishop(), pos(2, 7));
    put(whiteTeam.createKing(), pos(3, 7));
    put(whiteTeam.createQueen(), pos(4, 7));
    put(whiteTeam.createBishop(), pos(5, 7));
    put(whiteTeam.createKnight(), pos(6, 7));
    put(whiteTeam.createRook(), pos(7, 7));
    return board;
  }
};

// src/game/errors.ts
var NoPieceInPositionError = class extends Error {
  constructor(position) {
    super();
    this.position = position;
  }
};
var AnotherTeamTurnError = class extends Error {
  constructor(currentTeam, positionTeam) {
    super();
    this.currentTeam = currentTeam;
    this.positionTeam = positionTeam;
  }
};
var PieceMovementNotAllowedError = class extends Error {
};

// src/game/game.ts
var Game = class _Game {
  #board;
  #currentTeam;
  #capturedPieces;
  constructor(board, currentTeam) {
    this.#board = board;
    this.#currentTeam = currentTeam;
    this.#capturedPieces = [];
  }
  get turn() {
    return this.#currentTeam;
  }
  get isCheckmate() {
    const teamInCheck = this.isCheck;
    if (teamInCheck === null) {
      return null;
    }
    return pipe(
      this.#board.getTeamPieces(teamInCheck),
      Generator.map((piece) => canPieceMoveUndoCheck(this.#board, piece)),
      Generator.anyTrue(),
      (canUndo) => canUndo ? null : teamInCheck
    );
  }
  get isCheck() {
    if (isInCheck(this.#board, this.#currentTeam)) {
      return this.#currentTeam;
    }
    if (isInCheck(this.#board, colorInvert(this.#currentTeam))) {
      return colorInvert(this.#currentTeam);
    }
    return null;
  }
  play(origin, destiny) {
    const originPiece = this.#board.get(origin);
    if (originPiece === null) {
      throw new NoPieceInPositionError(origin);
    }
    if (originPiece.color !== this.#currentTeam) {
      throw new AnotherTeamTurnError(this.#currentTeam, originPiece.color);
    }
    const originMoves = this.#getPieceMoves(originPiece);
    if (!originMoves.some((o) => o.equals(destiny))) {
      throw new PieceMovementNotAllowedError();
    }
    const destinyValue = this.#board.move(originPiece, destiny);
    originPiece.incrementMoveCount();
    if (destinyValue !== null) {
      this.#capturedPieces.push(destinyValue);
    }
    this.#currentTeam = colorInvert(this.#currentTeam);
  }
  moves(position) {
    const piece = this.#board.get(position);
    if (piece === null) {
      throw new NoPieceInPositionError(position);
    }
    if (piece.color !== this.#currentTeam) {
      throw new AnotherTeamTurnError(this.#currentTeam, piece.color);
    }
    return this.#getPieceMoves(piece);
  }
  getPiece(position) {
    return this.#board.get(position);
  }
  get capturedPieces() {
    return this.#capturedPieces;
  }
  #getPieceMoves(piece) {
    return pipe(
      piece.movements(this.#board),
      Generator.filter((p) => !isMoveCausesCheck(this.#board, piece.position, p)),
      Generator.toArray()
    );
  }
  static initial() {
    const board = Board.initial();
    const team = "white" /* white */;
    return new _Game(board, team);
  }
};
export {
  Cell,
  Color,
  Game,
  Position,
  colorInvert
};
