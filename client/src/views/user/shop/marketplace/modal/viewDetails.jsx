import React from "react";
import { Modal, Button } from "flowbite-react";

const ViewDetails = ({ product, onClose }) => {
  const show = !!product;

  // Format description with paragraphs
  const formattedDescription = (product?.description || "No description available.")
    .split("\n\n")
    .map(paragraph => `<p style="margin-bottom: 1rem;">${paragraph}</p>`)
    .join("");

  // --- FIXED PREVIEW LINK LOGIC ---
  const rawLink = product?.previewLink?.trim(); // remove spaces

  const normalizedPreviewLink =
    rawLink && rawLink !== "" &&
    (rawLink.startsWith("http://") || rawLink.startsWith("https://")
      ? rawLink
      : `https://${rawLink}`);

  return (
    <Modal show={show} onClose={onClose} popup>
      <Modal.Header className="bg-gray-800">
        <h2 className="text-lg mobile:text-[16px] font-semibold text-white">
          {product?.name || "Product"} Details
        </h2>
      </Modal.Header>

      <Modal.Body className="bg-gray-800 text-gray-300">
        <div className="flex flex-col gap-4">

          {/* Description */}
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: formattedDescription }}
          />

          {/* Preview Link */}
          {normalizedPreviewLink ? (
            <a
              href={normalizedPreviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
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
            <div className="flex items-center gap-3 mt-2">
              {product?.avatar && (
                <img
                  src={product.avatar}
                  alt={product.seller}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium">{product.seller}</span>
            </div>
          )}

        </div>
      </Modal.Body>

      <Modal.Footer className="justify-end bg-gray-800">
        <Button color="failure" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDetails;
