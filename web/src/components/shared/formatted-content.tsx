"use client";
import React from "react";
import { cn } from "@/lib/utils";
import AtMention from "../feed/at-mention";

type AtMentionProps = React.ComponentProps<typeof AtMention>;

interface FormattedContentProps {
  content: string;
  className?: string;
  onHashtagClick?: (hashtag: string) => void;
  users?: Record<string, Omit<AtMentionProps, "handle">>;
}

export function FormattedContent({
  content,
  className,
  onHashtagClick,
  users,
}: FormattedContentProps) {
  // Split content into paragraphs (groups of text separated by blank lines)
  const paragraphs = content.split(/\n\s*\n/);

  const handleHashtagClick = (hashtag: string) => {
    if (onHashtagClick) {
      onHashtagClick(hashtag.slice(1)); // Remove # from the start
    }
  };

  return (
    <>
      <div
        className={cn("break-words w-full text-muted-foreground", className)}
      >
        {paragraphs.map((paragraph, paragraphIndex) => {
          const isLastParagraph = paragraphIndex === paragraphs.length - 1;
          const lines = paragraph.split("\n");
          return (
            <p
              key={paragraphIndex}
              className={cn("text-sm leading-relaxed  text-pretty", {
                "mb-6": !isLastParagraph,
              })}
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
                    const handle = word.slice(1).replace(/[.,!?;:]*$/, "");
                    const punctuation = word.slice(handle.length + 1);
                    const userData = users?.[handle];
                    if (userData) {
                      return (
                        <React.Fragment key={`${lineIndex}-${wordIndex}`}>
                          <AtMention
                            handle={handle}
                            name={userData.name}
                            avatar={userData.avatar}
                            bio={userData.bio}
                            mutualFriends={userData.mutualFriends}
                          />
                          <span>{punctuation} </span>
                        </React.Fragment>
                      );
                    } else {
                      // Fallback: just render a styled span for the mention
                      return (
                        <span
                          key={`${lineIndex}-${wordIndex}`}
                          className="glitch-text cursor-pointer text-cyan-500 hover:text-cyan-300"
                          data-text={`@${handle}`}
                        >
                          @{handle}
                          {punctuation}
                        </span>
                      );
                    }
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
      </div>
    </>
  );
}
