import React from "react";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: "javascript" | "typescript";
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = "typescript",
}) => {
  return (
    <div className="h-screen flex flex-col">
      <CodeMirror
        value={code}
        height="100vh"
        theme={vscodeDark}
        extensions={[javascript({ typescript: language === "typescript" })]}
        onChange={onChange}
        className="overflow-hidden"
      />
    </div>
  );
};

export default CodeEditor;
