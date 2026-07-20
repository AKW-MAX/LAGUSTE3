{draftReceipt.items.map((item, index) => (
  <div
    key={`cash-sale-item-${index}`}
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-[2fr_1fr_1fr_auto]
      gap-3
      rounded
      border
      p-4
      items-end
    "
  >
    <div>
      <label className="mb-2 block text-sm font-medium">
        Product
      </label>

      <select
        value={item.productId}
        onChange={(event) =>
          handleItemChange(
            index,
            "productId",
            event.target.value
          )
        }
        className="w-full rounded border px-3 py-2"
      >
        <option value="">Select product</option>

        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name} (Stock: {product.stock ?? 0})
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Quantity
      </label>

      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(event) =>
          handleItemChange(
            index,
            "quantity",
            event.target.value
          )
        }
        className="w-full rounded border px-3 py-2"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-medium">
        Unit Price
      </label>

      <input
        type="number"
        min="0"
        value={item.unitPrice}
        onChange={(event) =>
          handleItemChange(
            index,
            "unitPrice",
            event.target.value
          )
        }
        className="w-full rounded border px-3 py-2"
      />
    </div>

    <button
      type="button"
      onClick={() => removeItemRow(index)}
      disabled={draftReceipt.items.length === 1}
      className="
        w-full
        rounded
        bg-red-600
        px-4
        py-2
        text-white
        disabled:opacity-50
        sm:col-span-2
        lg:col-span-1
      "
    >
      Remove
    </button>
  </div>
))}