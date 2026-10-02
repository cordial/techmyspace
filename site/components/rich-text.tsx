export function RichText({ html, className = "" }: { html: string; className?: string }) {
  if (!html) {
    return null;
  }

  return <div className={`richtext ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
