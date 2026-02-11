import type { JSX } from "react";

export type CommandResult ={
    output: string | JSX.Element;
    clear?: boolean;
};

export type Command = {
    name: string;
    description: string;
    run: (args: string[]) => CommandResult;
};