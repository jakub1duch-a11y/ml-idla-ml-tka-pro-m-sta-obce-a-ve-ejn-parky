import React from 'react';

export default function InlineEditableText({ as: Tag = 'span', value = '', field, editMode = false, onChange, className = '', children }) {
  if (!editMode) return <Tag className={className}>{children ?? value}</Tag>;
  return (
    <Tag
      className={`${className} cursor-text rounded-sm outline-none ring-cyan-400/0 transition hover:ring-2 hover:ring-cyan-400/50 focus:ring-2 focus:ring-cyan-400`}
      contentEditable
      suppressContentEditableWarning
      data-inline-edit={field}
      title="Klikněte a upravte text"
      onBlur={(event) => onChange?.({ field, value: event.currentTarget.textContent || '' })}
      onKeyDown={(event) => {
        if (event.key === 'Escape') event.currentTarget.blur();
      }}
    >
      {value}
    </Tag>
  );
}
