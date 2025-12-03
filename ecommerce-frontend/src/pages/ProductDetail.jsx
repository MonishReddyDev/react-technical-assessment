// src/pages/ProductDetail.jsx - Revised for smaller, more compact UI
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

// --- MUI Components ---
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// ----------------------

// Public folder asset: always referenced with a leading slash
const FALLBACK_DETAIL_IMAGE = "/image.png";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load product by id
  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError("");

    try {
      const res = await getProduct(id);
      const body = res.data;
      const item = body?.data?.product || body?.data || body?.product || body;
      setProduct(item);
    } catch (err) {
      console.error("Error fetching product detail:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load product detail.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!product?.id) return;

    try {
      await addToCart(product.id, 1);
      showToast(`${product.name || "Product"} added to cart.`, "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      const msg =
        err.response?.data?.message ||
        "Could not add this item to your cart. Please try again.";
      showToast(msg, "error");
    }
  };

  // --- DATA PROCESSING ---
  const name = product?.name || "No name";
  const description = product?.description || "No description available.";

  const price =
    typeof product?.price === "number"
      ? product.price.toFixed(2)
      : product?.price || "N/A";

  const stock =
    typeof product?.stock === "number"
      ? product.stock
      : product?.stock || "N/A";

  const rawImage =
    (Array.isArray(product?.images) && product.images[0]) ||
    product?.image ||
    "";

  const imageUrl = rawImage || FALLBACK_DETAIL_IMAGE;

  const handleImgError = (e) => {
    e.target.src = FALLBACK_DETAIL_IMAGE;
    e.target.onerror = null;
  };

  // --- RENDERING STATES ---

  const BackButton = () => (
    <Button
      variant="outlined"
      // Reduced size to small
      size="small"
      onClick={() => navigate(-1)}
      startIcon={<ArrowBackIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      Back
    </Button>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <BackButton />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Product Detail
        </Typography>
        <CircularProgress size={30} />
        <Typography sx={{ mt: 2 }}>Loading product...</Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ p: 3 }}>
        <BackButton />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Product Detail
        </Typography>
        <Alert severity="error">{error || "No product found."}</Alert>
      </Box>
    );
  }

  // --- RENDER COMPONENT ---
  return (
    <Box sx={{ mt: 1 }}>
      <BackButton />

      <Paper
        elevation={4}
        sx={{
          // Reduced padding significantly: from 5/3 to 3/2
          p: { xs: 2, md: 3 },
          borderRadius: 3, // Slightly smaller border radius
        }}
      >
        <Grid
          container
          // Reduced spacing between image and details
          spacing={{ xs: 2, md: 4 }}
          alignItems="stretch"
        >
          {/* LEFT: Image */}
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              onError={handleImgError}
              sx={{
                width: "100%",
                maxHeight: 350, // Reduced max height for image
                objectFit: "cover",
                borderRadius: 2, // Slightly smaller image border radius
                bgcolor: "grey.100",
              }}
            />
          </Grid>

          {/* RIGHT: Info */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                // Reduced size from h4 to h5
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 600, mb: 1.5 }}
              >
                {name}
              </Typography>

              {/* Meta Section */}
              <Box
                sx={{
                  // Reduced margins/paddings
                  my: 1.5,
                  py: 1.5,
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: "grey.300",
                  display: "flex",
                  gap: 3, // Reduced gap
                  alignItems: "center",
                }}
              >
                <Typography
                  // Reduced size from h5 to h6
                  variant="h6"
                  color="primary"
                  component="span"
                  sx={{ fontWeight: 700 }}
                >
                  ${price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock:
                  <Box
                    component="span"
                    sx={{
                      ml: 0.5,
                      fontWeight: 600,
                      color: stock > 0 ? "success.main" : "error.main",
                    }}
                  >
                    {stock}
                  </Box>
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                // Reduced size from body1 to body2
                variant="body2"
                sx={{ lineHeight: 1.6, mb: 2, color: "text.primary" }}
              >
                {description}
              </Typography>

              {/* Actions */}
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  // Reduced size from large to medium
                  size="medium"
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCartIcon />}
                  disabled={stock <= 0}
                  sx={{
                    borderRadius: 50,
                    py: 1, // Reduced vertical padding
                    minWidth: 160,
                  }}
                >
                  {stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProductDetail;
