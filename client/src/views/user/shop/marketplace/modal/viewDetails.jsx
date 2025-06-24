import React from "react";
import { Modal, Button } from "flowbite-react";

const ViewDetails = ({ product, onClose }) => {
  const show = !!product;

  return (
    <Modal show={show} onClose={onClose} popup>
      <Modal.Header className="bg-gray-800">
        <h2 className="text-lg font-semibold text-white">
          {product?.name || "Product"} Details
        </h2>
      </Modal.Header>

      <Modal.Body className="bg-gray-800 text-gray-300">
        <div className="flex flex-col gap-4">
          {/* Description */}
          <p className="text-sm">{product?.description || "No description available."}</p>

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
