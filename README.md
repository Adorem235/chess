# Chess

A two-player chess game that runs in the browser, built with Next.js, React and Redux Toolkit. Both players share one screen and take turns clicking to move.

## Features

- Full move validation for every piece
- Special moves: castling, en passant and pawn promotion (with a piece picker)
- You can't make a move that leaves your own king in check
- Check, checkmate and stalemate are detected
- Move history in algebraic notation (e.g. `Nf3`, `exd5`, `O-O`, `e8=Q+`)
- Reset button to start a new game

## Getting started

You need [Node.js](https://nodejs.org) 18.18 or later.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server with hot reload      |
| `npm run build` | Build for production                      |
| `npm start`     | Serve the production build                |
| `npm run lint`  | Run ESLint                                |

## How to play

1. Click one of your pieces to select it. White moves first.
2. Click the square you want to move to. If the move isn't legal, nothing happens and the piece stays selected.
3. Click the selected piece again to deselect it, or click another of your pieces to switch.
4. When a pawn reaches the last rank, choose the piece to promote it to.

## Project structure

```
src/
├── app/                  Next.js app router (page, layout, global styles)
├── components/           React components (board, squares, game info, promotion modal)
├── features/game/
│   └── gameSlice.js      Redux slice: game state, reducers and selectors
├── lib/chess/            Chess rules as plain functions, no React or Redux
│   ├── board.js          Starting position
│   ├── constants.js      Colours, piece types, board size, castling squares
│   ├── gameRules.js      Move validation, check/checkmate/stalemate, applying moves
│   ├── notation.js       Converts moves to algebraic notation
│   ├── piece.js          Piece helpers
│   └── pieceMoves.js     How each piece type moves
└── store.js              Redux store
public/piece_icons/       SVG piece images
```

### How state flows

All game state lives in the Redux store under `state.game`. Components don't hold game state themselves:

- Components **read** state with `useSelector` and the selectors exported from `gameSlice.js` (for example `selectDisplayBoard`, `selectTurn`, `selectNotation`).
- Components **change** state by dispatching actions: `squareClicked({ row, col })`, `promotePawn(pieceType)` and `resetGame()`.
- The reducers call the pure rule functions in `src/lib/chess/` to decide whether a move is legal and what the board looks like afterwards.

Keeping the rules in `lib/chess` separate from React and Redux means they can be tested or reused (for example by a computer opponent) without touching the UI.

## Roadmap

- [ ] **Look and feel:** polish the board, side panel and overall layout
- [ ] **Home page:** a start screen for choosing a game mode
- [ ] **Timer:** a chess clock for each player
- [ ] **Drag and drop:** move pieces by dragging as well as by clicking
- [ ] **Move hints:** highlight the selected piece and the squares it can legally move to
- [ ] Show check, checkmate, stalemate and invalid-move messages in the UI (the game already tracks these)
- [ ] Show captured pieces
- [ ] Disambiguate notation when two identical pieces can reach the same square (e.g. `Nbd2`)

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) with [React 19](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org) and [React Redux](https://react-redux.js.org)
- [Tailwind CSS 4](https://tailwindcss.com)
