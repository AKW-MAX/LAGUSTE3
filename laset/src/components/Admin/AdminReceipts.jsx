import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";

const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

const buildReceiptHtml = (invoice) => {
  const itemsMarkup = (invoice.items || [])
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
    <title>Sale Receipt ${invoice.receipt?.receiptNumber || ""}</title>
  </head>
  <body style="font-family: Arial, sans-serif; color: #0f172a; padding: 24px;">
    <div style="max-width: 900px; margin: 0 auto;">
      <h1 style="margin-bottom: 8px;">Customer Sale Receipt</h1>
      <p style="margin: 4px 0;"><strong>Receipt Number:</strong> ${invoice.receipt?.receiptNumber || "—"}</p>
      <p style="margin: 4px 0;"><strong>Issued At:</strong> ${formatDateTime(invoice.receipt?.issuedAt)}</p>
      <p style="margin: 4px 0;"><strong>Invoice Number:</strong> ${invoice.invoiceNumber || "—"}</p>
      <p style="margin: 4px 0;"><strong>Customer:</strong> ${invoice.customer?.name || "N/A"}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${invoice.customer?.email || "N/A"}</p>
      <p style="margin: 4px 0;"><strong>Phone:</strong> ${invoice.customer?.phone || "N/A"}</p>
      <p style="margin: 4px 0 16px 0;"><strong>Address:</strong> ${invoice.customer?.address || "N/A"}</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
        <thead>
          <tr style="background:#e2e8f0;">
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Product</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Quantity</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Unit Price</th>
            <th style="border:1px solid #cbd5e1;padding:8px;text-align:left;">Line Total</th>
          </tr>
        </thead>
        <tbody>${itemsMarkup}</tbody>
      </table>
      <div style="margin-top: 16px;">
        <p style="margin: 4px 0;"><strong>Total Quantity:</strong> ${invoice.totalQuantity || 0}</p>
        <p style="margin: 4px 0;"><strong>Total Amount:</strong> KSh ${invoice.totalAmount || 0}</p>
      </div>
    </div>
  </body>
</html>`;
};

export default function AdminReceipts() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [postingReceipt, setPostingReceipt] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [draftReceipt, setDraftReceipt] = useState({
    invoiceNumber: "",
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
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

    fetchReceiptsData();
  }, [navigate]);

  const fetchReceiptsData = async () => {
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
        axios.get(`${getApiBaseUrl()}/admin/invoices`, {
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
        const nextInvoices = Array.isArray(invoicesResponse.value.data?.invoices) ? invoicesResponse.value.data.invoices : [];
        setInvoices(nextInvoices.filter((invoice) => invoice.sourceType !== "supplier"));
      } else {
        setInvoices([]);

        if (invoicesResponse.reason?.response?.status === 404) {
          setWarningMessage("The backend does not have invoices endpoint yet. Redeploy backend to enable customer sale receipts.");
        } else if (invoicesResponse.reason?.response?.status === 401) {
          throw invoicesResponse.reason;
        } else {
          setWarningMessage(invoicesResponse.reason?.response?.data?.message || "Failed to load customer sale receipts.");
        }
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      setWarningMessage(error.response?.data?.message || "Failed to load customer sale receipts.");
    } finally {
      setLoading(false);
    }
  };

  const updateDraftReceipt = (updater) => {
    setDraftReceipt((prev) => ({
      ...prev,
      ...updater(prev),
    }));
  };

  const handleCustomerChange = (field, value) => {
    setDraftReceipt((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index, field, value) => {
    setDraftReceipt((prev) => {
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
    setDraftReceipt((prev) => ({
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
    setDraftReceipt((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const resetDraftReceipt = () => {
    setDraftReceipt({
      invoiceNumber: "",
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
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

  const postCashSaleReceipt = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setPostingReceipt(true);

      const normalizedItems = draftReceipt.items
        .filter((item) => item.productId)
        .map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
        }))
        .filter((item) => item.quantity > 0);

      if (normalizedItems.length === 0) {
        alert("Add at least one ordered item before posting a cash sale receipt.");
        return;
      }

      const response = await axios.post(
        `${getApiBaseUrl()}/admin/invoices`,
        {
          invoiceNumber: draftReceipt.invoiceNumber,
          customer: draftReceipt.customer,
          items: normalizedItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      resetDraftReceipt();
      await fetchReceiptsData();
      alert(response.data?.message || "Cash sale receipt posted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to post cash sale receipt.");
    } finally {
      setPostingReceipt(false);
    }
  };

  const printReceipt = (invoice) => {
    const receiptWindow = window.open("", "_blank", "width=900,height=700");

    if (!receiptWindow) {
      alert("Unable to open print window. Please allow pop-ups for this site.");
      return;
    }

    receiptWindow.document.open();
    receiptWindow.document.write(buildReceiptHtml(invoice));
    receiptWindow.document.close();
    receiptWindow.focus();
    receiptWindow.print();
  };

  const downloadReceipt = (invoice) => {
    const receiptHtml = buildReceiptHtml(invoice);
    const receiptBlob = new Blob([receiptHtml], { type: "text/html;charset=utf-8" });
    const receiptUrl = URL.createObjectURL(receiptBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = receiptUrl;
    downloadLink.download = `${invoice.receipt?.receiptNumber || invoice.invoiceNumber || "sale-receipt"}.html`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(receiptUrl);
  };

  const filteredReceipts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const sorted = [...invoices].sort(
      (leftInvoice, rightInvoice) =>
        new Date(rightInvoice.receipt?.issuedAt || rightInvoice.postedAt || 0) -
        new Date(leftInvoice.receipt?.issuedAt || leftInvoice.postedAt || 0)
    );

    if (!normalizedSearch) {
      return sorted;
    }

    return sorted.filter((invoice) => {
      const fields = [
        invoice.receipt?.receiptNumber,
        invoice.invoiceNumber,
        invoice.customer?.name,
        invoice.customer?.email,
        invoice.customer?.phone,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return fields.some((value) => value.includes(normalizedSearch));
    });
  }, [invoices, search]);

  const draftTotalQuantity = draftReceipt.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const draftTotalAmount = draftReceipt.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  if (loading) {
    return <div className="p-8">Loading customer sale receipts...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Sale Receipts</h1>
        <p className="mt-2 text-gray-600">
          Track customer purchases with sold products, total quantity, and total amount.
        </p>
      </div>

      <section className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Post Customer Receipt</h2>
          <button
            type="button"
            onClick={resetDraftReceipt}
            disabled={postingReceipt}
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
              value={draftReceipt.invoiceNumber}
              onChange={(event) => updateDraftReceipt(() => ({ invoiceNumber: event.target.value }))}
              placeholder="Leave blank to auto-generate"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Customer Name</label>
            <input
              type="text"
              value={draftReceipt.customer.name}
              onChange={(event) => handleCustomerChange("name", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Customer Email</label>
            <input
              type="email"
              value={draftReceipt.customer.email}
              onChange={(event) => handleCustomerChange("email", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Customer Phone</label>
            <input
              type="text"
              value={draftReceipt.customer.phone}
              onChange={(event) => handleCustomerChange("phone", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Customer Address</label>
            <input
              type="text"
              value={draftReceipt.customer.address}
              onChange={(event) => handleCustomerChange("address", event.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Ordered Items</h3>
            <button
              type="button"
              onClick={addItemRow}
              className="rounded bg-slate-800 px-4 py-2 text-white"
            >
              Add Item
            </button>
          </div>

          {draftReceipt.items.map((item, index) => (
            <div key={`cash-sale-item-${index}`} className="flex flex-row gap-3 rounded border p-4 md:grid-cols-[2fr,1fr,1fr,auto] md:items-end">
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
                      {product.name} (Stock: {product.stock ?? 0})
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
                disabled={draftReceipt.items.length === 1}
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

        <div>
          <button
            type="button"
            onClick={postCashSaleReceipt}
            disabled={postingReceipt}
            className="rounded bg-indigo-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {postingReceipt ? "Posting Customer Receipt..." : "Post Customer Receipt"}
          </button>
        </div>
      </section>

      {warningMessage ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warningMessage}
        </div>
      ) : null}

      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by receipt no, invoice no, customer, email, or phone"
        className="w-full rounded border px-3 py-2"
      />

      {filteredReceipts.length === 0 ? (
        <p>No customer sale receipts found.</p>
      ) : (
        <div className="space-y-4">
          {filteredReceipts.map((invoice) => (
            <div key={invoice._id} className="rounded-lg border bg-slate-50 p-5 shadow-sm">

              <div className="grid gap-2 md:grid-cols-2">
                <h1>AGRIVENTUTE ENTREPRISES</h1>
                <p className="m-1">P.O. Box 100, Nairobi, Kenya</p>
                <p className="m-1">Phone: +254 704519867</p>
                <p className="m-1">Email: info@agriventure.com</p>
                <p><strong>Receipt Number:</strong> {invoice.receipt?.receiptNumber || "—"}</p>
                <p><strong>Issued At:</strong> {formatDateTime(invoice.receipt?.issuedAt)}</p>
                <p><strong>Posted At:</strong> {formatDateTime(invoice.postedAt)}</p>
                <p><strong>Customer:</strong> {invoice.customer?.name || "N/A"}</p>
                <p><strong>Email:</strong> {invoice.customer?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {invoice.customer?.phone || "N/A"}</p>
                <p><strong>Total Quantity:</strong> {invoice.totalQuantity ?? 0}</p>
                <p><strong>Total Amount:</strong> KSh {invoice.totalAmount ?? 0}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => printReceipt(invoice)}
                  className="rounded bg-slate-800 px-4 py-2 text-white"
                >
                  Print Receipt
                </button>

                <button
                  type="button"
                  onClick={() => downloadReceipt(invoice)}
                  className="rounded bg-emerald-700 px-4 py-2 text-white"
                >
                  Download Receipt File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}