/**
 * TagInput Component
 * Accessibility: Keyboard navigation (Enter to add, Backspace to remove)
 * Features: Add/remove tags, validation, max tags limit
 */

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "./input";
import { Badge } from "./badge";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

export const TagInput = ({
  tags,
  onTagsChange,
  placeholder = "Add tag and press Enter",
  maxTags = 20,
  className = "",
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (tags.length >= maxTags) {
        return;
      }
      if (!tags.includes(inputValue.trim())) {
        onTagsChange([...tags, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="pl-3 pr-2 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-destructive transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length >= maxTags ? `Max ${maxTags} tags reached` : placeholder}
        disabled={tags.length >= maxTags}
        aria-label="Tag input"
      />
      <p className="text-xs text-muted-foreground mt-1">
        {tags.length}/{maxTags} tags • Press Enter to add • Backspace to remove last
      </p>
    </div>
  );
};
