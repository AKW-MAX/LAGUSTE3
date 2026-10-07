import { PRODUCT_CATEGORIES } from "../../utils/productCategories";

export default function ProductCategoryFields({ value, onChange }) {
  const selectedCategory = PRODUCT_CATEGORIES.find(
    (category) =>
      category.value === value ||
      category.subcategories?.some(
        (subcategory) => `${category.value}/${subcategory.value}` === value
      )
  );

  const selectedSubcategory = selectedCategory?.subcategories?.some(
    (subcategory) => `${selectedCategory.value}/${subcategory.value}` === value
  )
    ? value
    : "";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label
          htmlFor="product-category"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="product-category"
          value={selectedCategory?.value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 sm:text-base"
          required
        >
          <option value="" disabled>Select a category</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="product-subcategory"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Subcategory
        </label>
        <select
          id="product-subcategory"
          value={selectedSubcategory}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 disabled:bg-gray-100 sm:text-base"
          disabled={!selectedCategory?.subcategories}
          required={Boolean(selectedCategory?.subcategories)}
        >
          <option value="">
            {selectedCategory?.subcategories
              ? "Select a subcategory"
              : "No subcategories"}
          </option>
          {selectedCategory?.subcategories?.map((subcategory) => (
            <option
              key={subcategory.value}
              value={`${selectedCategory.value}/${subcategory.value}`}
            >
              {subcategory.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}