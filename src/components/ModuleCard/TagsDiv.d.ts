/// <reference types="react" />
interface TagsDivProps {
    tags: string[];
    importantTags: string[];
    showTags: boolean;
}
export default function ({ tags, importantTags, showTags }: TagsDivProps): JSX.Element;
export {};
