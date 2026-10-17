import { useParams } from "react-router-dom";
import { useGetAllProductsQuery } from "../../Features/ProductsApi";
import { resolveImageSource, assets } from "../../assets/assets.js";
import { useDispatch } from "react-redux";
import { addToCart } from "../../Features/CartSlice";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getApiBaseUrl } from "../../utils/api";
import {
  buildAnalyticsMetadata,
  getAnalyticsIdentity,
} from "../../utils/analytics";
import { getProductSeo, getProductSlug } from "../../utils/productSeo";

export default function ProductDetails() {
  const { productId, productSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addedToCart, setAddedToCart] = useState(false);

  const {
    data,
    error,
    isLoading,
  } = useGetAllProductsQuery();

  const products = Array.isArray(data)
    ? data
    : Array.isArray(data?.products)
      ? data.products
      : data?.value || [];

  const product = products.find((item) =>
    productSlug
      ? getProductSlug(item) === productSlug
      : item._id?.toString() === productId?.toString()
  );

  const trackAnalyticsEvent = useCallback(async (eventType, metadata = {}) => {
    try {
      const identity = getAnalyticsIdentity();
      const resolvedMetadata = await buildAnalyticsMetadata({
        ...metadata,
        ...identity,
        productId: product?._id || metadata.productId || "",
        productName: product?.name || metadata.productName || "",
      });

      await axios.post(`${getApiBaseUrl()}/api/analytics`, {
        eventType,
        page: window.location.pathname,
        referrer: document.referrer || "",
        ...identity,
        metadata: resolvedMetadata,
      });
    } catch (error) {
      console.warn("Analytics tracking failed", error);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        _id: product._id,
        img: resolveImageSource(
          product.img || product.image || ""
        ),
        name: product.name,
        price: Number(product.price),
      })
    );

    trackAnalyticsEvent("add_to_cart", {
      productId: product._id,
      productName: product.name,
    });

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  useEffect(() => {
    if (!product) return;

    const previousTitle = document.title;
    const previousMeta = new Map();
    const { slug, title, description: descriptionText } = getProductSeo(product);
    const canonicalUrl = `${window.location.origin}/products/${slug}`;
    const rawImage = resolveImageSource(product.img || product.image || "");
    const imageUrl = rawImage ? new URL(rawImage, window.location.origin).href : "";
    const price = Number(product.price);

    const setMeta = (attribute, key, content) => {
      const selector = `meta[${attribute}="${key}"]`;
      let meta = document.head.querySelector(selector);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
        previousMeta.set(meta, null);
      } else if (!previousMeta.has(meta)) {
        previousMeta.set(meta, meta.getAttribute("content"));
      }

      meta.setAttribute("content", content);
    };

    document.title = title;
    setMeta("name", "description", descriptionText);
    setMeta("property", "og:type", "product");
    setMeta("property", "og:title", document.title);
    setMeta("property", "og:description", descriptionText);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", "Agriventure Enterprise");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", document.title);
    setMeta("name", "twitter:description", descriptionText);

    if (imageUrl) {
      setMeta("property", "og:image", imageUrl);
      setMeta("name", "twitter:image", imageUrl);
    }

    if (Number.isFinite(price)) {
      setMeta("property", "product:price:amount", String(price));
      setMeta("property", "product:price:currency", "KES");
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;
    const previousCanonicalUrl = canonical?.getAttribute("href");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    let structuredData = document.getElementById("product-jsonld");
    const createdStructuredData = !structuredData;
    const previousStructuredData = structuredData?.textContent;
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "product-jsonld";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: descriptionText,
      image: imageUrl ? [imageUrl] : undefined,
      sku: product._id,
      category: product.category || undefined,
      brand: {
        "@type": "Brand",
        name: "Agriventure Enterprise",
      },
      offers: Number.isFinite(price)
        ? {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "KES",
            price,
            availability:
              Number(product.stock) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          }
        : undefined,
    };
    structuredData.textContent = JSON.stringify(productSchema).replace(/</g, "\\u003c");

    trackAnalyticsEvent("product_view", {
      productId: product._id,
      productName: product.name,
    });

    return () => {
      document.title = previousTitle;
      previousMeta.forEach((previousContent, meta) => {
        if (previousContent === null) {
          meta.remove();
        } else {
          meta.setAttribute("content", previousContent);
        }
      });

      if (createdCanonical) {
        canonical.remove();
      } else if (previousCanonicalUrl) {
        canonical.setAttribute("href", previousCanonicalUrl);
      }

      if (createdStructuredData) {
        structuredData.remove();
      } else {
        structuredData.textContent = previousStructuredData || "";
      }
    };
  }, [product, trackAnalyticsEvent]);

  if (isLoading) {
    return (
      <p className="p-6 text-center">
        Loading product...
      </p>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-center text-red-600">
        Failed to load product.
      </p>
    );
  }

  if (!product) {
    return (
      <p className="p-6 text-center text-red-600">
        Product not found.
      </p>
    );
  }

  const imageSrc = resolveImageSource(
    product.img || product.image || ""
  );

    const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-5xl rounded-xl bg-white p-4 shadow-md sm:p-6 lg:p-8">

        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* ================= PRODUCT IMAGE ================= */}
            <div
              className="
                relative
                flex
                min-h-[350px]
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                bg-gray-50
                p-6
                sm:min-h-[450px]
                lg:min-h-[550px]
              "
            >
              {/* Product Image */}
              <img
                src={imageSrc}
                alt={product.name}
                className="
                  max-h-[500px]
                  w-full
                  object-contain
                  transition-transform
                  duration-500
                  hover:scale-110
                "
              />

              {/* Logo Watermark */}
              <img
                src={assets.AgriventureLogo1}
                alt="Agriventure watermark"
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-[55%]
                  h-32
                  w-32
                  -translate-x-1/2
                  -translate-y-1/2
                  object-contain
                  opacity-50
                  sm:h-40
                  sm:w-40
                  md:h-48
                  md:w-48
                "
              />
            </div>

          {/* ================= PRODUCT INFORMATION ================= */}
          <div>

            {/* Product Name */}
            <h1 className="
              mb-4
              text-2xl
              font-bold
              text-green-900
              sm:text-3xl
            ">
              {product.name}
            </h1>

            {/* Category */}
            <p className="mb-4 text-base text-gray-700 sm:text-lg">
              Category:{" "}
              <span className="font-medium text-gray-900">
                {product.category || "Uncategorized"}
              </span>
            </p>

            {/* Price */}
            <p className="mb-6 text-2xl font-bold text-green-900">
              Ksh {Number(product.price).toLocaleString()}
            </p>

            {/* ================= DESCRIPTION ================= */}
            <div className="
              mb-6
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-5
            ">

              <h2 className="
                mb-3
                text-xl
                font-bold
                text-green-900
              ">
                Product Description
              </h2>

              <p className="
                whitespace-pre-line
                text-base
                leading-8
                text-gray-600
              ">
                {product.description ||
                  "No description available for this product."}
              </p>

            </div>

            {/* ================= ADD TO CART ================= */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                w-full
                rounded-lg
                bg-green-900
                px-6
                py-3
                
                font-semibold
                text-white
                transition
                duration-300
                hover:bg-green-800
                sm:w-auto
              "
            >
              Add to Cart
            </button>
            <Link to="/">
            <button
             type="button"
             onClick={handleClose}
             className="
            bg-green-900
             px-6 py-3
             rounded-lg
             font-semibold
            hover:bg-green-800
             transition
            text-white
            sm:w-auto
            m-2             "
           >
           Close
           </button>
           </Link>
            {/* Success Message */}
            {addedToCart && (
              <p className="
                mt-3
                font-medium
                text-green-700
              ">
                Product added to cart successfully!
              </p>
            )}

            {/* ================= PRODUCT ID ================= */}
            <div className="
              mt-6
              border-t
              border-gray-200
              pt-4
              text-sm
              text-gray-500
            ">
              <p>
                Product ID: {product._id}
              </p>

              {/* 
              <p>
                Stock: {product.stock ?? "N/A"}
              </p>
              */}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
