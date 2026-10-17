const NILZAN_SEO = {
  title: "Nilzan Super Suspension | Broad-Spectrum Livestock Dewormer",
  description:
    "Shop Nilzan Super Suspension dewormer for cattle, sheep, and goats. High-strength control of liver flukes, roundworms, and lungworms fortified with cobalt.",
};

export const getProductSlug = (product) => {
  const value = String(product?.slug || product?.name || "");

  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getProductSeo = (product) => {
  const slug = getProductSlug(product);
  const normalizedName = String(product?.name || "").toLowerCase();
  const isNilzan =
    slug === "nilzan-super-suspension" ||
    (normalizedName.includes("nilzan") &&
      normalizedName.includes("super suspension"));

  const generatedDescription = product?.description
    ? String(product.description)
    : `Shop ${product?.name || "quality farm supplies"} from Agriventure Enterprise for your farm and livestock needs.`;

  return {
    slug,
    title:
      product?.seoTitle ||
      (isNilzan
        ? NILZAN_SEO.title
        : `${product?.name || "Product"} | Agriventure Enterprise`),
    description: String(
      product?.seoDescription ||
        (isNilzan ? NILZAN_SEO.description : generatedDescription)
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160),
  };
};