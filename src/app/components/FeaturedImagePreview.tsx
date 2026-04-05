import { useState } from "react";

type FeaturedImagePreviewProps = {
  readonly src: string;
  readonly title: string;
};

function FeaturedImagePreview({ src, title }: FeaturedImagePreviewProps) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [isPreviewFailed, setIsPreviewFailed] = useState(false);

  return (
    <div className="mb-4 w-full">
      <div className="relative min-h-32 w-full overflow-hidden rounded-lg border border-stone-300 dark:border-stone-700">
        {!isPreviewFailed && (
          <img
            src={src}
            alt={title}
            className={`w-full object-cover transition-opacity ${isPreviewLoading ? "opacity-0" : "opacity-100"}`}
            onLoad={() => setIsPreviewLoading(false)}
            onError={() => {
              setIsPreviewLoading(false);
              setIsPreviewFailed(true);
            }}
            loading="lazy"
            width={800}
            height={400}
          />
        )}

        {isPreviewLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-200 dark:bg-stone-800">
            <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-stone-400/40 border-t-stone-600 dark:border-stone-500/40 dark:border-t-stone-200" />
          </div>
        )}

        {!isPreviewLoading && isPreviewFailed && (
          <div className="flex min-h-32 w-full items-center justify-center bg-stone-200 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            Preview unavailable
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedImagePreview;
