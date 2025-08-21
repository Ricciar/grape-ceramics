import { sanitizeWP } from '../../utils/sanitizeWP';

export function VideoBlock({
  src,
  captionHTML,
  className = '',
}: {
  src: string;
  captionHTML?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div className={className}>
      <video
        key={src}
        src={src}
        controls
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-auto block"
      />
      {captionHTML ? (
        <figcaption
          className="text-center text-sm text-gray-700 py-2"
          dangerouslySetInnerHTML={{ __html: sanitizeWP(captionHTML) }}
        />
      ) : null}
    </div>
  );
}
