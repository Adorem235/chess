import { newBoard } from "@/lib/chess/board";
import { COLORS } from "@/lib/chess/constants";
import { createSlice, createSelector, current } from "@reduxjs/toolkit";
import * as GameRules from "@/lib/chess/gameRules";
import { oppositeColor } from "@/lib/chess/piece";
import { convertToChessNotation } from "@/lib/chess/notation";

const initialState = {
  board: newBoard(),
  turn: COLORS.WHITE,
  selected: null, // { row, col } of the selected square
  moveHistory: [],
  status: "playing", // "playing" | "checkmate" | "stalemate"
  pendingPromotion: null, // { from, to } while the player picks a piece
  message: null,
};

// Records a played move and decides what happens next.
// `result` is what GameRules.applyMove returns: { board, move }
function finishMove(state, { board: finalBoard, move }) {
  const opponentColor = oppositeColor(move.color);

  const check = GameRules.isCheck(finalBoard, opponentColor);
  const isCheckmate = GameRules.checkForCheckmate(finalBoard, opponentColor, move);
  const isStalemate = !isCheckmate && GameRules.checkForStalemate(finalBoard, opponentColor, move);

  state.moveHistory.push({ ...move, check, checkmate: isCheckmate });
  state.board = finalBoard;
  state.selected = null;

  if (isCheckmate) {
    state.status = "checkmate";
  } else if (isStalemate) {
    state.status = "stalemate";
  } else {
    state.turn = opponentColor;
  }
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    squareClicked: (state, action) => {
      const { row, col } = action.payload;

      // No moves once the game is over, or while waiting for a promotion choice
      if (state.status !== "playing" || state.pendingPromotion) {
        return;
      }

      state.message = null;

      // Plain copies of the board and last move, so the rule functions work on normal objects instead of Immer drafts
      const board = current(state.board);
      const prevMove = state.moveHistory.length ? current(state.moveHistory[state.moveHistory.length - 1]) : null;
      const clickedPiece = board[row][col];

      // Nothing selected yet: select one of the current player's pieces
      if (!state.selected) {
        if (clickedPiece && clickedPiece.color === state.turn) {
          state.selected = { row, col };
        }
        return;
      }

      const from = { row: state.selected.row, col: state.selected.col };
      const to = { row, col };
      const selectedPiece = board[from.row][from.col];

      // Clicking the selected square again deselects it
      if (from.row === to.row && from.col === to.col) {
        state.selected = null;
        return;
      }

      // Clicking another of your own pieces switches the selection
      if (clickedPiece && clickedPiece.color === state.turn) {
        state.selected = { row, col };
        return;
      }

      if (!GameRules.isValidMove(board, from, to, selectedPiece, prevMove)) {
        state.message = "Invalid move.";
        return;
      }

      if (GameRules.isCheck(GameRules.simulateMove(board, from, to), selectedPiece.color)) {
        state.message = "You can't move into check.";
        return;
      }

      // Wait for the player's choice; promotePawn finishes the move
      if (GameRules.isPromotionMove(selectedPiece, to)) {
        state.pendingPromotion = { from, to };
        state.selected = null;
        return;
      }

      finishMove(state, GameRules.applyMove(board, from, to));
    },

    // payload: the piece type to promote to, e.g. PIECE_TYPES.QUEEN
    promotePawn: (state, action) => {
      if (!state.pendingPromotion) return;

      const { from, to } = current(state.pendingPromotion);
      state.pendingPromotion = null;
      finishMove(state, GameRules.applyMove(current(state.board), from, to, action.payload));
    },

    resetGame: () => initialState,
  },
});

// Selectors receive the root state; the game lives under state.game (see store.js)
export const selectBoard = (state) => state.game.board
export const selectTurn = (state) => state.game.turn
export const selectSelected = (state) => state.game.selected
export const selectStatus = (state) => state.game.status
export const selectMessage = (state) => state.game.message
export const selectPendingPromotion = (state) => state.game.pendingPromotion
export const selectMoveHistory = (state) => state.game.moveHistory

export const selectPrevMove = (state) => {
  const history = selectMoveHistory(state);
  return history.length ? history[history.length - 1] : null;
}

// The side to move is in check if the last move gave check
export const selectInCheck = (state) => {
  const prevMove = selectPrevMove(state);
  return prevMove?.check ? selectTurn(state) : null;
}

// Shared so "nothing selected" always returns the same reference
const NO_MOVES = [];

export const selectLegalMoves = createSelector(
  [selectBoard, selectSelected, selectPrevMove],
  (board, selected, prevMove) => {
    if (!selected) return NO_MOVES;
    const piece = board[selected.row][selected.col];
    return GameRules.getLegalMoves(board, piece, selected, prevMove);
  }
)

// The board to draw: while a promotion is pending, shows the pawn on its final square
export const selectDisplayBoard = createSelector(
  [selectBoard, selectPendingPromotion],
  (board, pendingPromotion) => {
    if (!pendingPromotion) return board;
    return GameRules.applyMove(board, pendingPromotion.from, pendingPromotion.to).board;
  }
)

export const selectNotation = createSelector(
  [selectMoveHistory],
  (moveHistory) => moveHistory.map(convertToChessNotation)
)

// Piece types each color has captured, e.g. { white: ["pawn"], black: [] }
export const selectCapturedPieces = createSelector(
  [selectMoveHistory],
  (moveHistory) => {
    const captured = { [COLORS.WHITE]: [], [COLORS.BLACK]: [] };
    for (const move of moveHistory) {
      if (move.captured) captured[move.color].push(move.captured);
    }
    return captured;
  }
)

export const { squareClicked, promotePawn, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
