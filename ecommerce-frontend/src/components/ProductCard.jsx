const FALLBACK_IMAGE = "./image.png";

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const id = product.id;

  const name = product.name || "No name";
  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : product.price || "N/A";

  // 👉 Decide if backend actually gave us an image URL
  const rawImage =
    (Array.isArray(product.images) && product.images[0]) || product.image || "";

  const hasBackendImage = !!rawImage;
  const primaryImage = hasBackendImage ? rawImage : FALLBACK_IMAGE;

  const handleImgError = (e) => {
    console.log("Image failed, using fallback for:", name);
    e.target.src = FALLBACK_IMAGE;
    e.target.onerror = null;
  };

  return (
    <div className="card">
      <img
        src={primaryImage}
        alt={name}
        className="card-image"
        onError={handleImgError}
      />

      <h3 className="card-title">{name}</h3>
      <p className="card-price">${price}</p>

      {/* Small indicator so we KNOW if backend image is used or not */}
      <p
        style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 0.25rem" }}
      >
        {hasBackendImage ? "Using backend image" : "Using placeholder image"}
      </p>

      <div className="card-footer">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onViewDetails && onViewDetails(id)}
        >
          View Details
        </button>

        {onAddToCart && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
