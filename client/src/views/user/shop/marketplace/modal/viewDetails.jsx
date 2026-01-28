import React from "react";
import { formatHtmlToPlainText } from "../../../../../components/utils/formatHtmlToReadableText";

const ViewDetails = ({ product, onClose }) => {
  if (!product) return null;

  // Raw HTML from ReactQuill
  const descriptionHTML =
    product?.description?.trim() ||
    "<p>No description available.</p>";

  // Convert HTML → readable text
  const readableDescription = formatHtmlToPlainText(descriptionHTML);

  // Normalize preview link
  const rawLink = product?.previewLink?.trim();
  const normalizedPreviewLink =
    rawLink &&
    (rawLink.startsWith("http://") || rawLink.startsWith("https://")
      ? rawLink
      : `https://${rawLink}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Modal Container */}
      <div className="mobile:w-full tab:w-[712px] max-h-dvh bg-[#fefce8] rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary-600">
          <h2 className="text-lg font-semibold text-secondary">
            {product?.name || "Product"} Details
          </h2>
          <button
            onClick={onClose}
            className="text-secondary text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-secondary space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Description (Readable Text) */}
          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {readableDescription}
          </pre>

          {/* Preview Link */}
          {normalizedPreviewLink ? (
            <a
              href={normalizedPreviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm inline-block"
            >
              🔗 Preview Product
            </a>
          ) : (
            <p className="text-xs text-gray-500">
              No preview link available.
            </p>
          )}

          {/* Seller Info */}
          {product?.seller && (
            <div className="flex items-center gap-3 pt-2">
              {product?.avatar && (
                <img
                  src={product.avatar}
                  alt={product.seller}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-white">
                {product.seller}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 border-t border-primary-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
