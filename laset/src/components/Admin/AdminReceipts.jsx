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
  const [warningMessage, setWarningMessage] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchReceipts();
  }, [navigate]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      setWarningMessage("");
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${getApiBaseUrl()}/admin/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const nextInvoices = Array.isArray(response.data?.invoices) ? response.data.invoices : [];
      setInvoices(nextInvoices);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        navigate("/admin/login");
        return;
      }

      if (error.response?.status === 404) {
        setWarningMessage("The backend does not have invoices endpoint yet. Redeploy backend to enable customer sale receipts.");
      } else {
        setWarningMessage(error.response?.data?.message || "Failed to load customer sale receipts.");
      }
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="p-8">Loading customer sale receipts...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer Sale Receipts</h1>
        <p className="mt-2 text-gray-600">
          View all posted receipt records and print or download receipt files.
        </p>
      </div>

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
                <p><strong>Receipt Number:</strong> {invoice.receipt?.receiptNumber || "—"}</p>
                <p><strong>Issued At:</strong> {formatDateTime(invoice.receipt?.issuedAt)}</p>
                <p><strong>Invoice Number:</strong> {invoice.invoiceNumber || "—"}</p>
                <p><strong>Posted At:</strong> {formatDateTime(invoice.postedAt)}</p>
                <p><strong>Customer:</strong> {invoice.customer?.name || "N/A"}</p>
                <p><strong>Email:</strong> {invoice.customer?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {invoice.customer?.phone || "N/A"}</p>
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