export const PRODUCT_CATEGORIES = [
  { value: "insecticide", label: "Insecticides" },
  { value: "public health insecticide", label: "Public Health Insecticides" },
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