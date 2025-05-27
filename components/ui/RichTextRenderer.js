import React from 'react';

const RichTextRenderer = ({ content, className = "" }) => {
  if (!content || !Array.isArray(content)) {
    return null;
  }

  const renderBlock = (block, index) => {
    if (!block || typeof block !== 'object') {
      return null;
    }

    switch (block.type) {
      case 'paragraph':
        return (
          <p key={index} className={`mb-4 text-gray-700 leading-relaxed ${className}`}>
            {renderChildren(block.children)}
          </p>
        );

      case 'list':
        const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
        const listClass = block.format === 'ordered' 
          ? 'list-decimal list-inside space-y-3 text-gray-700 leading-relaxed'
          : 'list-disc list-inside space-y-3 text-gray-700 leading-relaxed';
        
        return (
          <ListTag key={index} className={`${listClass} ${className}`}>
            {block.children?.map((listItem, itemIndex) => (
              <li key={itemIndex} className="mb-3">
                {renderChildren(listItem.children)}
              </li>
            ))}
          </ListTag>
        );

      case 'heading':
        const HeadingTag = `h${block.level || 2}`;
        return React.createElement(
          HeadingTag,
          { 
            key: index, 
            className: `font-display font-semibold text-gray-900 mb-4 ${
              block.level === 1 ? 'text-3xl' :
              block.level === 2 ? 'text-2xl' :
              block.level === 3 ? 'text-xl' :
              'text-lg'
            } ${className}`
          },
          renderChildren(block.children)
        );

      case 'quote':
        return (
          <blockquote key={index} className={`border-l-4 border-spiritual-light pl-4 italic text-gray-600 mb-4 ${className}`}>
            {renderChildren(block.children)}
          </blockquote>
        );

      default:
        // Fallback for unknown block types
        if (block.children) {
          return (
            <div key={index} className={`mb-4 text-gray-700 leading-relaxed ${className}`}>
              {renderChildren(block.children)}
            </div>
          );
        }
        return null;
    }
  };

  const renderChildren = (children) => {
    if (!children || !Array.isArray(children)) {
      return null;
    }

    return children.map((child, index) => {
      if (!child || typeof child !== 'object') {
        return null;
      }

      if (child.type === 'text') {
        let text = child.text || '';
        
        // Apply text formatting
        if (child.bold) {
          text = <strong key={index}>{text}</strong>;
        }
        if (child.italic) {
          text = <em key={index}>{text}</em>;
        }
        if (child.underline) {
          text = <u key={index}>{text}</u>;
        }
        if (child.strikethrough) {
          text = <s key={index}>{text}</s>;
        }
        if (child.code) {
          text = <code key={index} className="bg-gray-100 px-1 rounded">{text}</code>;
        }
        
        return <span key={index}>{text}</span>;
      }

      if (child.type === 'link') {
        return (
          <a 
            key={index} 
            href={child.url} 
            className="text-spiritual-dark hover:text-spiritual-accent underline"
            target={child.url?.startsWith('http') ? '_blank' : '_self'}
            rel={child.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {renderChildren(child.children)}
          </a>
        );
      }

      // Handle nested structures
      if (child.children) {
        return renderChildren(child.children);
      }

      return null;
    });
  };

  return (
    <div className="rich-text-content">
      {content.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default RichTextRenderer; 