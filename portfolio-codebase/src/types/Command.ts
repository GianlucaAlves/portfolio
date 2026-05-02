import type { JSX } from "react";

export type GameName = "snake" | "pacman" | "pokemon";

export type CommandResult = {
  output: string | JSX.Element;
  clear?: boolean;
  launchGame?: GameName;
};

export type Command = {
  name: string;
  description: string;
  run: (args: string[]) => CommandResult;
};
