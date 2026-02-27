"use client";

interface RichStepContentProps {
  content: string;
}

interface ContentToken {
  type: "text" | "codeBlock";
  value: string;
}

function tokenizeContent(content: string): ContentToken[] {
  const tokens: ContentToken[] = [];
  const codeBlockRegex = /```(?:[\w-]+)?\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [fullMatch, code] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      tokens.push({
        type: "text",
        value: content.slice(lastIndex, startIndex),
      });
    }

    tokens.push({
      type: "codeBlock",
      value: code.trimEnd(),
    });

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < content.length) {
    tokens.push({
      type: "text",
      value: content.slice(lastIndex),
    });
  }

  return tokens;
}

function renderInlineCode(text: string, keyPrefix: string) {
  const inlineParts = text.split(/`([^`\n]+)`/g);

  return inlineParts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (index % 2 === 1) {
      return (
        <code
          key={key}
          className="mx-0.5 rounded border border-sky-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[0.9em] text-sky-200"
        >
          {part}
        </code>
      );
    }

    const stringParts = part.split(/"([^"\n]+)"/g);

    return (
      <span key={key} className="whitespace-pre-wrap">
        {stringParts.map((stringPart, stringIndex) => {
          const stringKey = `${key}-str-${stringIndex}`;

          if (stringIndex % 2 === 1) {
            return (
              <span
                key={stringKey}
                className="mx-0.5 rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[0.9em] text-amber-900"
              >
                {"\""}
                {stringPart}
                {"\""}
              </span>
            );
          }

          return <span key={stringKey}>{stringPart}</span>;
        })}
      </span>
    );
  });
}

function renderTextContent(text: string, keyPrefix: string) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, lineIndex) => {
        const trimmedLine = line.trim();
        const commandOnlyMatch = trimmedLine.match(/^`([^`\n]+)`$/);
        const key = `${keyPrefix}-line-${lineIndex}`;

        if (commandOnlyMatch) {
          return (
            <pre
              key={key}
              className="w-full overflow-x-auto rounded-lg border bg-gray-900 p-3 text-xs text-gray-100"
            >
              <code>{commandOnlyMatch[1]}</code>
            </pre>
          );
        }

        if (trimmedLine.length === 0) {
          return <div key={key} className="h-1" />;
        }

        return (
          <div key={key} className="whitespace-pre-wrap">
            {renderInlineCode(line, key)}
          </div>
        );
      })}
    </div>
  );
}

export default function RichStepContent({ content }: RichStepContentProps) {
  const tokens = tokenizeContent(content);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {tokens.map((token, index) => {
        if (token.type === "codeBlock") {
          return (
            <pre
              key={`code-${index}`}
              className="overflow-x-auto rounded-lg border bg-gray-900 p-3 text-xs text-gray-100"
            >
              <code>{token.value}</code>
            </pre>
          );
        }

        return (
          <div key={`text-${index}`}>
            {renderTextContent(token.value, `inline-${index}`)}
          </div>
        );
      })}
    </div>
  );
}
