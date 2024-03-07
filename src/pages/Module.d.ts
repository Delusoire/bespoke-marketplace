/// <reference types="react" />
import { Module } from "/hooks/module.js";
export declare const useModule: (identifier: string) => {
    module: Module;
    installed: boolean;
    enabled: boolean;
    outdated: boolean;
    localOnly: boolean;
};
export default function ({ murl }: {
    murl: string;
}): JSX.Element;
