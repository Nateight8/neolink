import React from "react";

interface FormattedContentProps {
  content: string;
  onHashtagClick?: (hashtag: string) => void;
  onMentionClick?: (username: string) => void;
}

export function FormattedContent({
  content,
  onHashtagClick,
  onMentionClick,
}: FormattedContentProps) {
  // Split content into paragraphs (groups of text separated by blank lines)
  const paragraphs = content.split(/\n\s*\n/);

  const handleHashtagClick = (hashtag: string) => {
    if (onHashtagClick) {
      onHashtagClick(hashtag.slice(1)); // Remove # from the start
    }
  };

  const handleMentionClick = (mention: string) => {
    if (onMentionClick) {
      onMentionClick(mention.slice(1)); // Remove @ from the start
    }
  };

  return (
    <>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const isLastParagraph = paragraphIndex === paragraphs.length - 1;
        const lines = paragraph.split("\n");

        return (
          <p
            key={paragraphIndex}
            className={`text-sm leading-relaxed text-muted-foreground text-pretty ${
              isLastParagraph ? "mb-0" : "mb-6"
            }`}
          >
            {lines.map((line, lineIndex) => {
              const processedLine = line.split(" ").map((word, wordIndex) => {
                if (word.startsWith("#")) {
                  return (
                    <span
                      key={`${lineIndex}-${wordIndex}`}
                      onClick={() => handleHashtagClick(word)}
                      className="text-cyan-400 hover:text-cyan-300 cursor-pointer hover-glitch"
                    >
                      {word}{" "}
                    </span>
                  );
                } else if (word.startsWith("@")) {
                  return (
                    <span
                      key={`${lineIndex}-${wordIndex}`}
                      onClick={() => handleMentionClick(word)}
                      className="text-cyan-500 hover:text-cyan-400 cursor-pointer hover-glitch"
                    >
                      {word}{" "}
                    </span>
                  );
                }
                return <span key={`${lineIndex}-${wordIndex}`}>{word} </span>;
              });

              // Add a line break between lines within the same paragraph (except last line)
              return (
                <React.Fragment key={`line-${lineIndex}`}>
                  {processedLine}
                  {lineIndex < lines.length - 1 && <br />}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </>
  );
}
