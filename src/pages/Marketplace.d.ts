/// <reference types="react" />
import { Metadata } from "/hooks/module.js";
export declare const fetchMetaURLSync: (metaURL: string) => Metadata;
export declare const fetchMetaURL: (metaURL: string) => Promise<Metadata>;
export declare const useMetas: (identifiersToMetadataLists: Record<string, string[]>) => any;
export default function (): JSX.Element;
