/// <reference types="react" />
import { Metadata } from "/hooks/module.js";
interface ModuleCardProps {
    identifier: string;
    metadata: Metadata;
    metaURL: string;
    setMetaURL: (metaURL: string) => void;
    metaURLList: string[];
    showTags: boolean;
}
export default function ({ identifier, metadata, metaURL, setMetaURL, metaURLList, showTags }: ModuleCardProps): JSX.Element;
export {};
