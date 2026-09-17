import { useState, useRef, useEffect } from "react";

export const PromptCard = ({ title, icon, prompt, note }) => {
  const [state, setState] = useState("idle");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const hints = { idle: "Copy", copied: "Copied", failed: "Copy failed" };

  const copyWithTextarea = text => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    if (!ok) throw new Error("copy command failed");
  };

  const writeClipboard = async text => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      copyWithTextarea(text);
    }
  };

  const copy = async () => {
    try {
      await writeClipboard(prompt);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  };

  const onKeyDown = event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copy();
    }
  };

  return (
    <div
      className="prompt-card"
      data-state={state}
      role="button"
      tabIndex={0}
      aria-label={`Copy prompt: ${title}`}
      onClick={copy}
      onKeyDown={onKeyDown}
    >
      <Card title={title} icon={icon}>
        “{prompt}”{note ? ` ${note}` : ""}
        <span className="prompt-card-hint" aria-live="polite">
          {hints[state]}
        </span>
      </Card>
    </div>
  );
};
