const FALLBACK_IMAGE = "./image.png";

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const {
    id,
    name = "Unnamed product",
    description,
    price,
    compareAtPrice,
    stock,
  } = product || {};

  const formattedPrice =
    typeof price === "number" ? price.toFixed(2) : price || "N/A";

  const formattedCompareAt =
    typeof compareAtPrice === "number"
      ? compareAtPrice.toFixed(2)
      : compareAtPrice;

  const isOnSale =
    typeof price === "number" &&
    typeof compareAtPrice === "number" &&
    compareAtPrice > price;

  const isOutOfStock = typeof stock === "number" && stock <= 0;

  // Prefer first image from array, then single image field
  const rawImage =
    (Array.isArray(product?.images) && product.images[0]) ||
    product?.image ||
    "";

  const hasBackendImage = !!rawImage;
  const primaryImage = hasBackendImage ? rawImage : FALLBACK_IMAGE;

  const handleImgError = (e) => {
    console.warn("Image failed, using fallback for:", name);
    e.target.src = FALLBACK_IMAGE;
    e.target.onerror = null;
  };

  const handleViewDetails = () => {
    if (onViewDetails && id) onViewDetails(id);
  };

  const handleAddToCart = () => {
    if (onAddToCart && !isOutOfStock) onAddToCart(product);
  };

  return (
    <article
      className="card product-card"
      onClick={handleViewDetails}
      style={{ cursor: onViewDetails ? "pointer" : "default" }}
    >
      <img
        src={primaryImage}
        alt={name}
        className="card-image"
        onError={handleImgError}
      />

      <div className="card-body" onClick={(e) => e.stopPropagation()}>
        {/* Title + optional small badge row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "0.5rem",
            alignItems: "flex-start",
          }}
        >
          <h3 className="card-title">{name}</h3>

          {isOutOfStock ? (
            <span className="badge badge-muted">Out of stock</span>
          ) : (
            stock != null &&
            stock > 0 && <span className="badge badge-success">In stock</span>
          )}
        </div>

        {/* Optional short description */}
        {description && (
          <p className="card-meta">
            {description.length > 80
              ? `${description.slice(0, 80)}…`
              : description}
          </p>
        )}

        {/* Price row with optional compare-at price */}
        <div className="card-price-row">
          <span className="card-price">${formattedPrice}</span>
          {isOnSale && (
            <span className="card-price-compare">${formattedCompareAt}</span>
          )}
        </div>
      </div>

      <div
        className="card-footer"
        onClick={(e) => {
          // prevent card click from firing when pressing buttons
          e.stopPropagation();
        }}
      >
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleViewDetails}
        >
          View Details
        </button>

        {onAddToCart && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
