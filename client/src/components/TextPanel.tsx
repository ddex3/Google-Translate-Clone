interface TextPanelProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  maxLength?: number;
}

export default function TextPanel({
  value,
  onChange,
  placeholder,
  readOnly = false,
  maxLength = 5000,
}: TextPanelProps) {
  return (
    <div className="text-panel">
      <textarea
        className="text-area"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        maxLength={readOnly ? undefined : maxLength}
        spellCheck={!readOnly}
      />
      {!readOnly && (
        <div className="char-count">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
}
