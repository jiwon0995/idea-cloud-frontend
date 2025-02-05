import React, { ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { createEditor, Descendant, Text } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

function markdownToSlate(markdown: string) {
  return markdown.split("\n").map((line) => {
    return { type: "paragraph", children: [{ text: line }] };
  });
}

const initialValue: Descendant[] = [
  {
    // @ts-ignore
    type: "paragraph",
    children: [
      {
        text: "",
      },
    ],
  },
];

export default function MarkdownEditor({ setBody, body }: { setBody: any; body: string }) {
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  useEffect(() => {
    const newValue = markdownToSlate(body);
    setBody(body);
    editor.children = newValue; // 🔥 에디터의 내부 상태도 동기화
    editor.onChange();
  }, []);

  const decorate = useCallback(([node, path]: any) => {
    const ranges: any = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);
  return (
    <Slate editor={editor} initialValue={initialValue} onChange={(newValue) => setBody(newValue)}>
      <Editable
        className="outline-none"
        decorate={decorate}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        placeholder="회의록을 작성하세요"
      />
    </Slate>
  );
}

const Leaf = ({ attributes, children, leaf }: { attributes: any; children: ReactNode; leaf: any }) => {
  return (
    <span
      {...attributes}
      className={[
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.underlined && "underline",
        leaf.title && "block font-bold text-xl my-5",
        leaf.list && "pl-2 text-xl leading-3",
        leaf.hr && "block text-center border-b-2 border-gray-300",
        leaf.blockquote && "inline-block border-l-2 border-gray-300 pl-2 text-gray-400 italic",
        leaf.code && "font-mono bg-gray-200 px-1 py-0.5",
      ]
        .filter(Boolean) // falsy 값을 제거
        .join(" ")} // 클래스를 공백으로 연결
    >
      {children}
    </span>
  );
};
