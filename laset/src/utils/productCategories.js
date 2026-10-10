export const PRODUCT_CATEGORIES = [
  { value: "insecticide", label: "Insecticides" },
  { value: "public health insecticide", label: "Public Health Insecticides" },
  { value: "herbicides", label: "Herbicides" },
  { value: "fungicides", label: "Fungicides" },
  { value: "seeds", label: "Seeds" },
  { value: "fertilizers", label: "Fertilizers" },
  { value: "foliar feed", label: "Foliar Feed" },
  { value: "organic", label: "Organic" },
  { value: "adjuvant", label: "Adjuvant" },
  { value: "termiticides", label: "Termiticides" },
  { value: "equipment", label: "Equipment" },
  {
    value: "vet-products",
    label: "Vet Products",
    subcategories: [
      { value: "dewormers", label: "Dewormers" },
      { value: "supplements", label: "Supplements" },
      { value: "ethicals", label: "Ethicals" },
      { value: "disinfectants", label: "Disinfectants" },
      { value: "acaricides", label: "Acaricides" },
      { value: "intramammary", label: "Intramammary" },
      { value: "pet-shampoos", label: "Pet shampoos" },
    ],
  },
  {
    value: "equipments",
    label: "Equipments",
    subcategories: [
      { value: "pigs", label: "Pigs" },
      { value: "chicken", label: "Chicken" },
      { value: "cattle", label: "Cattle" },
      { value: "pets", label: "Pets" },
      { value: "fumigation", label: "Fumigation" },
      { value: "farm", label: "Farm" },
    ],
  },
];

export const PRODUCT_NAVIGATION_CATEGORIES = [
  { value: "insecticide", label: "Insecticides", href: "/category/insecticide" },
  {
    value: "public health insecticide",
    label: "Public Health Insecticides",
    href: "/category/public-health-insecticide",
  },
  { value: "herbicides", label: "Herbicides", href: "/category/herbicides" },
  { value: "fungicides", label: "Fungicides", href: "/category/fungicides" },
  { value: "seeds", label: "Seeds", href: "/category/seeds" },
  { value: "fertilizers", label: "Fertilizers", href: "/category/fertilizers" },
  { value: "organic", label: "Organic", href: "/category/organic" },
  { value: "adjuvant", label: "Adjuvant", href: "/category/adjuvant" },
  { value: "termiticides", label: "Termiticides", href: "/category/termiticides" },
];

export const PRODUCT_NAVIGATION_GROUPS = [
  {
    label: "Vet Products",
    items: [
      { value: "vet-products/dewormers", label: "Dewormers", href: "/category/vet-products/dewormers" },
      { value: "vet-products/supplements", label: "Supplements", href: "/category/vet-products/supplements" },
      { value: "vet-products/ethicals", label: "Ethicals", href: "/category/vet-products/ethicals" },
      { value: "vet-products/disinfectants", label: "Disinfectants", href: "/category/vet-products/disinfectants" },
      { value: "vet-products/acaricides", label: "Acaricides", href: "/category/vet-products/acaricides" },
      { value: "vet-products/intramammary", label: "Intramammary", href: "/category/vet-products/intramammary" },
      { value: "vet-products/pet-shampoos", label: "Pet shampoos", href: "/category/vet-products/pet-shampoos" },
    ],
  },
  {
    label: "Equipments",
    items: [
      { value: "equipments/pigs", label: "Pigs", href: "/category/equipments/pigs" },
      { value: "equipments/chicken", label: "Chicken", href: "/category/equipments/chicken" },
      { value: "equipments/cattle", label: "Cattle", href: "/category/equipments/cattle" },
      { value: "equipments/pets", label: "Pets", href: "/category/equipments/pets" },
      { value: "equipments/fumigation", label: "Fumigation", href: "/category/equipments/fumigation" },
      { value: "equipments/farm", label: "Farm", href: "/category/equipments/farm" },
    ],
  },
];

const validCategoryValues = new Set(
  PRODUCT_CATEGORIES.flatMap((category) =>
    category.subcategories
      ? category.subcategories.map(
          (subcategory) => `${category.value}/${subcategory.value}`
        )
      : [category.value]
  )
);

export const isValidProductCategory = (value) =>
  validCategoryValues.has(value);