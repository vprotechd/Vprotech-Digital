import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const isSettingValue = useRef(false);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: placeholder || "Write your blog content here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ["bold", "italic", "underline", "strike"],

          [{ list: "ordered" }, { list: "bullet" }],

          [{ indent: "-1" }, { indent: "+1" }],

          [{ align: [] }],

          ["blockquote", "code-block"],

          ["link", "image"],

          [{ color: [] }, { background: [] }],

          ["clean"],
        ],
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "indent",
        "align",
        "blockquote",
        "code-block",
        "link",
        "image",
        "color",
        "background",
      ],
    });

    quillRef.current = quill;

    if (value) {
      isSettingValue.current = true;
      quill.root.innerHTML = value;
      isSettingValue.current = false;
    }

    const handleChange = () => {
      if (isSettingValue.current) return;

      onChange(quill.root.innerHTML);
    };

    quill.on("text-change", handleChange);

    return () => {
      quill.off("text-change", handleChange);
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;

    if (!quill) return;

    const currentHTML = quill.root.innerHTML;

    if (value !== currentHTML) {
      isSettingValue.current = true;

      if (!value) {
        quill.setText("");
      } else {
        quill.root.innerHTML = value;
      }

      isSettingValue.current = false;
    }
  }, [value]);

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorRef} />
    </div>
  );
};

export default RichTextEditor;