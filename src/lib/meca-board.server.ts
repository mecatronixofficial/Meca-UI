import "server-only";
import { cache } from "react";
import { fetchContent } from "./content";
import { DEFAULT_MECA_BOARD, type MecaBoard } from "./meca-board";

interface ApiMecaBoard {
  enabled?: boolean;
  text?: string;
  highlight?: string;
  link?: string;
  interval_minutes?: number;
}

const SAFE_LINK = /^(\/(?!\/)[\w\-./?=&#%~]*|https?:\/\/[^\s]+)$/;

/**
 * MECA's board from the admin panel (mec-api GET settings/meca-board), cached under the "meca"
 * tag. null when an admin turned it off; the default board when the API is unavailable.
 */
export const getMecaBoard = cache(async (): Promise<MecaBoard | null> => {
  const data = await fetchContent<ApiMecaBoard>("settings/meca-board", "meca");
  if (!data) return DEFAULT_MECA_BOARD;
  if (data.enabled === false) return null;
  const text = data.text?.trim();
  const link = data.link?.trim();
  const minutes = Number(data.interval_minutes);
  return {
    text: text || DEFAULT_MECA_BOARD.text,
    highlight: text ? (data.highlight?.trim() ?? "") : DEFAULT_MECA_BOARD.highlight,
    link: link && SAFE_LINK.test(link) ? link : DEFAULT_MECA_BOARD.link,
    intervalMinutes: Number.isFinite(minutes) && minutes >= 1 ? Math.min(60, Math.round(minutes)) : DEFAULT_MECA_BOARD.intervalMinutes,
  };
});
