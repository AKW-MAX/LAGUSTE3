import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";
import AgriventureLogo from "../../assets/AgriventureLogo.png";

const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const buildSupplierInvoiceHtml = (invoice) => {
  const rows = (invoice.items || [])
    .map(
      (item) => `
        <tr>
          <td style="border:1px solid #cbd5e1;padding:8px;">${item.name || ""}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;">${item.quantity || 0}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;">KSh ${item.unitPrice || 0}</td>
          <td style="border:1px solid #cbd5e1;padding:8px;">KSh ${item.lineTotal || 0}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Supplier Invoice ${invoice.invoiceNumber || ""}</title>
  </head>
  <img class="hover:bg-green-800 bg-black w-20 h-15 p-1 rounded cursor-pointer"
            src="${AgriventureLogo || AgriventureLogo}"
            alt="company logo" />
  <body style="font-family: Arial, sans-serif; color: #0f172a; padding: 24px;">
    <div style="max-width: 900px; margin: 0 auto;">
      <h1>AGRIVENTUTE ENTREPRISES</h1>
      <p style="margin: 4px 0;">P.O. Box 100, Nairobi, Kenya</p>
      <p style="margin: 4px 0;">Phone: +254 704519867</p>
      <p style="margin: 4px 0;">Email: info@agriventure.com</p>
      <h2 style="margin-bottom: 8px;">Supplier Stock-In Invoice</h2>
      <p style="margin: 4px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber || "—"}</p>
      <p style="margin: 4px 0;"><strong>Invoice Date:</strong> ${formatDateTime(invoice.invoiceDate || invoice.postedAt)}</p>
      <p style="margin: 4px 0;"><strong>Supplier Name:</strong> ${invoice.supplier?.name || "N/A"}</p>
      <p style="margin: 4px 0 16px 0;"><strong>Supplier Contact:</strong> ${invoice.supplier?.contact || "N/A"}</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="background:#e2e8f0;">
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Product</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Quantity</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Unit Price</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Line Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top: 16px;">
        <p style="margin: 4px 0;"><strong>Total Quantity:</strong> ${invoice.totalQuantity || 0}</p>
        <p style="margin: 4px 0;"><strong>Total Amount:</strong> KSh ${invoice.totalAmount || 0}</p>
      </div>
    </div>
  </body>
</html>`;
};

export default function AdminInvoices() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [postingInvoice, setPostingInvoice] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [draftInvoice, setDraftInvoice] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().slice(0, 10),
    supplier: {
      name: "",
      contact: "",
    },
    items: [
      {
        productId: "",
        name: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchInvoiceData();
  }, [navigate]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      setWarningMessage("");
      const token = localStorage.getItem("adminToken");

      const [productsResponse, invoicesResponse] = await Promise.allSettled([
        axios.get(`${getApiBaseUrl()}/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${getApiBaseUrl()}/admin/supplier-invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (productsResponse.status === "fulfilled") {
        setProducts(Array.isArray(productsResponse.value.data?.products) ? productsResponse.value.data.products : []);
      } else if (productsResponse.reason?.response?.status === 401) {
        throw productsResponse.reason;
      }

      if (invoicesResponse.status === "fulfilled") {
        setInvoices(Array.isArray(invoicesResponse.value.data?.invoices) ? invoicesResponse.value.data.invoices : []);
      } else if (invoicesResponse.reason?.response?.status === 404) {
        setInvoices([]);
        setWarningMessage("Supplier invoices endpoint is not available on this backend yet. Redeploy backend to enable supplier tracking.");
      } else if (invoicesResponse.reason?.response?.status === 401) {
        throw invoicesResponse.reason;
      } else {
        setInvoices([]);
        setWarningMessage(invoicesResponse.reason?.response?.data?.message || "Failed to load supplier invoices.");
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to load supplier invoice data.");
    } finally {
      setLoading(false);
    }
  };

  const updateDraftInvoice = (updater) => {
    setDraftInvoice((prev) => ({
      ...prev,
      ...updater(prev),
    }));
  };

  const handleSupplierChange = (field, value) => {
    setDraftInvoice((prev) => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    setDraftInvoice((prev) => {
      const nextItems = prev.items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        if (field === "productId") {
          const selectedProduct = products.find((product) => product._id === value);
          return {
            ...item,
            productId: value,
            name: selectedProduct?.name || "",
            unitPrice: Number(selectedProduct?.price || 0),
          };
        }

        return {
          ...item,
          [field]: field === "quantity" || field === "unitPrice" ? Number(value || 0) : value,
        };
      });

      return {
        ...prev,
        items: nextItems,
      };
    });
  };

  const addItemRow = () => {
    setDraftInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: "",
          name: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItemRow = (index) => {
    setDraftInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const resetDraftInvoice = () => {
    setDraftInvoice({
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().slice(0, 10),
      supplier: {
        name: "",
        contact: "",
      },
      items: [
        {
          productId: "",
          name: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const postSupplierInvoice = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setPostingInvoice(true);

      if (!draftInvoice.supplier.name.trim()) {
        alert("Supplier name is required.");
        return;
      }

      const normalizedItems = draftInvoice.items
        .filter((item) => item.productId)
        .map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
        }))
        .filter((item) => item.quantity > 0);

      if (normalizedItems.length === 0) {
        alert("Add at least one item with quantity above 0 before posting supplier invoice.");
        return;
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/admin/invoices`,
        {
          sourceType: "supplier",
          invoiceNumber: draftInvoice.invoiceNumber,
          invoiceDate: draftInvoice.invoiceDate,
          supplier: draftInvoice.supplier,
          items: normalizedItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetDraftInvoice();
      await fetchInvoiceData();
      alert(response.data?.message || "Supplier invoice posted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to post supplier invoice.");
    } finally {
      setPostingInvoice(false);
    }
  };

  const downloadSupplierInvoice = (invoice) => {
    const html = buildSupplierInvoiceHtml(invoice);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoiceNumber || "supplier-invoice"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const sorted = [...invoices].sort(
      (leftInvoice, rightInvoice) =>
        new Date(rightInvoice.invoiceDate || rightInvoice.postedAt || 0) -
        new Date(leftInvoice.invoiceDate || leftInvoice.postedAt || 0)
    );

    if (!normalizedSearch) {
      return sorted;
    }

    return sorted.filter((invoice) => {
      const fields = [
        invoice.invoiceNumber,
        invoice.supplier?.name,
        invoice.supplier?.contact,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return fields.some((value) => value.includes(normalizedSearch));
    });
  }, [invoices, search]);

  const draftTotalQuantity = draftInvoice.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const draftTotalAmount = draftInvoice.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  if (loading) {
    return <div className="p-8">Loading supplier invoices...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Supplier Invoices</h1>
        <p className="mt-2 text-gray-600">
          Record stock-in from suppliers with date and contact details, then download invoice files for records.
        </p>
      </div>

      {warningMessage ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warningMessage}
        </div>
      ) : null}

      <section className="rounded-lg border bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Post Supplier Invoice</h2>
          <button
            type="button"
            onClick={resetDraftInvoice}
            disabled={postingInvoice}
            className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Clear Form
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Invoice Number (Optional)</label>
            <input
              type="text"
              value={draftInvoice.invoiceNumber}
              onChange={(event) => updateDraftInvoice(() => ({ invoiceNumber: event.target.value }))}
              placeholder="Leave blank to auto-generate"
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Invoice Date</label>
            <input
              type="date"
              value={draftInvoice.invoiceDate}
              onChange={(event) => updateDraftInvoice(() => ({ invoiceDate: event.target.value }))}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Supplier Name</label>
            <input
              type="text"
              value={draftInvoice.supplier.name}
              onChange={(event) => handleSupplierChange("name", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Supplier Contact</label>
            <input
              type="text"
              value={draftInvoice.supplier.contact}
              onChange={(event) => handleSupplierChange("contact", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Stocked Items</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="rounded bg-slate-800 px-4 py-2 text-white"
            >
              Add Item
            </button>
          </div>

          {draftInvoice.items.map((item, index) => (
            <div key={`supplier-item-${index}`} className="flex flex-row gap-3 rounded border p-4 md:grid-cols-[2fr,1fr,1fr,auto] md:items-end">
              <div>
                <label className="mb-2 block text-sm font-medium">Product</label>
                <select
                  value={item.productId}
                  onChange={(event) => handleItemChange(index, "productId", event.target.value)}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name} (Current Stock: {product.stock ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => handleItemChange(index, "quantity", event.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Unit Price</label>
                <input
                  type="number"
                  min="0"
                  value={item.unitPrice}
                  onChange={(event) => handleItemChange(index, "unitPrice", event.target.value)}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              <button
                type="button"
                onClick={() => removeItemRow(index)}
                disabled={draftInvoice.items.length === 1}
                className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="rounded bg-slate-100 p-4 text-sm text-slate-700">
          <p><strong>Total Quantity:</strong> {draftTotalQuantity}</p>
          <p><strong>Total Amount:</strong> KSh {draftTotalAmount}</p>
        </div>

        <button
          type="button"
          onClick={postSupplierInvoice}
          disabled={postingInvoice}
          className="rounded bg-indigo-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {postingInvoice ? "Posting Supplier Invoice..." : "Post Supplier Invoice"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Posted Supplier Invoices</h2>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by invoice number, supplier name, or contact"
          className="w-full rounded border px-3 py-2"
        />

        {filteredInvoices.length === 0 ? (
          <p>No supplier invoices have been posted yet.</p>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div key={invoice._id} className="rounded-lg border bg-slate-50 p-5 shadow-sm">
                <div className="grid gap-2 md:grid-cols-2">
                  <p><strong>Invoice Number:</strong> {invoice.invoiceNumber || "—"}</p>
                  <p><strong>Invoice Date:</strong> {formatDateTime(invoice.invoiceDate || invoice.postedAt)}</p>
                  <p><strong>Supplier:</strong> {invoice.supplier?.name || "N/A"}</p>
                  <p><strong>Supplier Contact:</strong> {invoice.supplier?.contact || "N/A"}</p>
                  <p><strong>Total Quantity:</strong> {invoice.totalQuantity ?? 0}</p>
                  <p><strong>Total Amount:</strong> KSh {invoice.totalAmount ?? 0}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => downloadSupplierInvoice(invoice)}
                    className="rounded bg-slate-800 px-4 py-2 text-white"
                  >
                    Download Supplier Invoice
                  </button>
                </div>

                <table className="mt-4 w-full border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Product</th>
                      <th className="border p-2 text-left">Quantity</th>
                      <th className="border p-2 text-left">Unit Price</th>
                      <th className="border p-2 text-left">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item, index) => (
                      <tr key={`${invoice._id}-supplier-invoice-${index}`}>
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">KSh {item.unitPrice}</td>
                        <td className="border p-2">KSh {item.lineTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
