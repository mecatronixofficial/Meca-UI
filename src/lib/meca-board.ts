/**
 * MECA's board: the assistant raises a handwritten board and shakes it when the site opens,
 * then again every `intervalMinutes`. Managed in the admin panel (mec-api settings/meca-board),
 * loaded by getMecaBoard() (src/lib/meca-board.server.ts) and drawn by MecaAssistant.
 */
export interface MecaBoard {
  text: string;
  /** Part of `text` drawn with a highlighter; "" for none. */
  highlight: string;
  /** Site path or full URL the board opens. */
  link: string;
  intervalMinutes: number;
}

export const DEFAULT_MECA_BOARD: MecaBoard = {
  text: "Preview your website for free",
  highlight: "free",
  link: "/preview",
  intervalMinutes: 3,
};

/** `text` split around the first (case-insensitive) match of `highlight`. */
export function splitHighlight(text: string, highlight: string): [before: string, marked: string, after: string] {
  const at = highlight ? text.toLowerCase().indexOf(highlight.toLowerCase()) : -1;
  if (at < 0) return [text, "", ""];
  return [text.slice(0, at), text.slice(at, at + highlight.length), text.slice(at + highlight.length)];
}
