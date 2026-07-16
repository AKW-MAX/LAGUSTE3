import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../../utils/api";

const formatDateTime = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString();
};

export default function AdminInvoices() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postingInvoice, setPostingInvoice] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [draftInvoice, setDraftInvoice] = useState({
    sourceOrderId: "",
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

    fetchInvoiceData();
  }, [navigate]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      setWarningMessage("");
      const token = localStorage.getItem("adminToken");

      const [ordersResponse, productsResponse, invoicesResponse] = await Promise.allSettled([
        axios.get(`${getApiBaseUrl()}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
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

      if (ordersResponse.status === "rejected") {
        throw ordersResponse.reason;
      }

      if (productsResponse.status === "rejected") {
        throw productsResponse.reason;
      }

      setOrders(Array.isArray(ordersResponse.value.data?.orders) ? ordersResponse.value.data.orders : []);
      setProducts(Array.isArray(productsResponse.value.data?.products) ? productsResponse.value.data.products : []);

      if (invoicesResponse.status === "fulfilled") {
        setInvoices(Array.isArray(invoicesResponse.value.data?.invoices) ? invoicesResponse.value.data.invoices : []);
      } else {
        setInvoices([]);

        if (invoicesResponse.reason?.response?.status === 404) {
          setWarningMessage("The deployed backend does not have the new invoices endpoint yet. You can prepare invoice data here after backend redeploy.");
        } else {
          setWarningMessage(invoicesResponse.reason?.response?.data?.message || "Failed to load posted invoices.");
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

      alert(error.response?.data?.message || "Failed to load invoice data.");
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

  const handleCustomerChange = (field, value) => {
    setDraftInvoice((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
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

  const loadOrderToDraft = (orderId) => {
    if (!orderId) {
      resetDraftInvoice();
      return;
    }

    const selectedOrder = orders.find((order) => order._id === orderId);

    if (!selectedOrder) {
      return;
    }

    setDraftInvoice({
      sourceOrderId: selectedOrder._id,
      invoiceNumber: "",
      customer: {
        name: selectedOrder.customer?.name || selectedOrder.user?.name || "",
        email: selectedOrder.customer?.email || selectedOrder.user?.email || "",
        phone: selectedOrder.customer?.phone || "",
        address: selectedOrder.customer?.address || "",
      },
      items: (selectedOrder.orderItems || []).map((item) => ({
        productId: item._id || "",
        name: item.name || "",
        quantity: Number(item.cartQuantity ?? item.quantity ?? 0),
        unitPrice: Number(item.price || 0),
      })),
    });
  };

  const resetDraftInvoice = () => {
    setDraftInvoice({
      sourceOrderId: "",
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

  const postInvoice = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      setPostingInvoice(true);

      const normalizedItems = draftInvoice.items
        .filter((item) => item.productId)
        .map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: Number(item.quantity || 0),
          unitPrice: Number(item.unitPrice || 0),
        }));

      const res = await axios.post(
        `${getApiBaseUrl()}/admin/invoices`,
        {
          sourceOrderId: draftInvoice.sourceOrderId,
          invoiceNumber: draftInvoice.invoiceNumber,
          customer: draftInvoice.customer,
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
      alert(res.data?.message || "Invoice posted successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to post invoice.");
    } finally {
      setPostingInvoice(false);
    }
  };

  const invoiceCandidates = orders.filter(
    (order) => order.status === "Approved" && !order.invoice?.invoiceNumber
  );
  const sortedInvoiceCandidates = [...invoiceCandidates].sort(
    (leftOrder, rightOrder) => new Date(rightOrder.createdAt || 0) - new Date(leftOrder.createdAt || 0)
  );
  const normalizedOrderSearch = orderSearch.trim().toLowerCase();
  const filteredInvoiceCandidates = sortedInvoiceCandidates.filter((order) => {
    if (!normalizedOrderSearch) {
      return true;
    }

    const searchFields = [
      order._id,
      order.customer?.name,
      order.user?.name,
      order.customer?.email,
      order.user?.email,
      order.customer?.phone,
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return searchFields.some((value) => value.includes(normalizedOrderSearch));
  });

  const draftTotalQuantity = draftInvoice.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const draftTotalAmount = draftInvoice.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  if (loading) {
    return <div className="p-8">Loading invoices...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Post Invoices</h1>
        <p className="mt-2 text-gray-600">
          Create invoices manually, load items from approved orders, adjust quantities,
          and keep invoice records separate from order management.
        </p>
      </div>

      {warningMessage ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {warningMessage}
        </div>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Approved Customer Orders</h2>
          <button
            type="button"
            onClick={resetDraftInvoice}
            className="rounded bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800"
          >
            Start Manual Invoice
          </button>
        </div>

        <input
          type="text"
          value={orderSearch}
          onChange={(event) => setOrderSearch(event.target.value)}
          placeholder="Search by customer name, email, phone, or order ID"
          className="w-full rounded border px-3 py-2"
        />

        {invoiceCandidates.length === 0 ? (
          <p>No approved customer orders are waiting for invoices.</p>
        ) : filteredInvoiceCandidates.length === 0 ? (
          <p>No approved customer orders match your search.</p>
        ) : (
          <div className="space-y-3">
            {filteredInvoiceCandidates.map((order) => (
              <div key={order._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1 text-sm text-slate-700">
                    <p><strong>Customer:</strong> {order.customer?.name || order.user?.name || "N/A"}</p>
                    <p><strong>Email:</strong> {order.customer?.email || order.user?.email || "N/A"}</p>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Order Date:</strong> {formatDateTime(order.createdAt)}</p>
                    <p><strong>Total:</strong> KSh {order.totalAmount}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => loadOrderToDraft(order._id)}
                    className="rounded bg-emerald-700 px-4 py-2 font-semibold text-white"
                  >
                    Use This Order For Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm space-y-5">
          <div className="rounded bg-indigo-50 p-4 text-sm text-indigo-900">
            <p>
              <strong>Current Mode:</strong>{" "}
              {draftInvoice.sourceOrderId
                ? `Using customer order ${draftInvoice.sourceOrderId}`
                : "Manual invoice entry"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Load From Approved Order</label>
              <select
                value={draftInvoice.sourceOrderId}
                onChange={(event) => loadOrderToDraft(event.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Manual invoice</option>
                {filteredInvoiceCandidates.map((order) => (
                  <option key={order._id} value={order._id}>
                    {(order.customer?.name || order.user?.name || "Customer")} - {formatDateTime(order.createdAt)} - {order._id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">Invoice Number</label>
              <input
                type="text"
                value={draftInvoice.invoiceNumber}
                onChange={(event) => updateDraftInvoice(() => ({ invoiceNumber: event.target.value }))}
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
                value={draftInvoice.customer.name}
                onChange={(event) => handleCustomerChange("name", event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Customer Email</label>
              <input
                type="email"
                value={draftInvoice.customer.email}
                onChange={(event) => handleCustomerChange("email", event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Customer Phone</label>
              <input
                type="text"
                value={draftInvoice.customer.phone}
                onChange={(event) => handleCustomerChange("phone", event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Customer Address</label>
              <input
                type="text"
                value={draftInvoice.customer.address}
                onChange={(event) => handleCustomerChange("address", event.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Invoice Items</h2>
              <button
                type="button"
                onClick={addItemRow}
                className="rounded bg-slate-800 px-4 py-2 text-white"
              >
                Add Item
              </button>
            </div>

            {draftInvoice.items.map((item, index) => (
              <div key={`draft-item-${index}`} className="grid gap-3 rounded border p-4 md:grid-cols-[2fr,1fr,1fr,auto] md:items-end">
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={postInvoice}
              disabled={postingInvoice}
              className="rounded bg-indigo-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              {postingInvoice ? "Posting Invoice..." : "Post Invoice"}
            </button>

            <button
              type="button"
              onClick={resetDraftInvoice}
              disabled={postingInvoice}
              className="rounded bg-slate-300 px-5 py-3 font-semibold text-slate-800"
            >
              Clear Draft
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Posted Invoices</h2>

        {invoices.length === 0 ? (
          <p>No invoices have been posted yet.</p>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice._id} className="rounded-lg border bg-slate-50 p-5 shadow-sm">
                <div className="grid gap-2 md:grid-cols-2">
                  <p><strong>Invoice Number:</strong> {invoice.invoiceNumber || "—"}</p>
                  <p><strong>Posted At:</strong> {formatDateTime(invoice.postedAt)}</p>
                  <p><strong>Source Order ID:</strong> {invoice.sourceOrderId || "Manual invoice"}</p>
                  <p><strong>Customer:</strong> {invoice.customer?.name || "N/A"}</p>
                  <p><strong>Total Quantity:</strong> {invoice.totalQuantity ?? 0}</p>
                  <p><strong>Total Amount:</strong> KSh {invoice.totalAmount ?? 0}</p>
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
                      <tr key={`${invoice._id}-invoice-${index}`}>
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