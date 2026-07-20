import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { parseStoredJson } from "../../utils/storage";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  ) {
    return "http://localhost:5000";
  }

  return (
    import.meta.env.VITE_API_URL ||
    "https://agriventure-enterprise-backend.onrender.com"
  );
};

export default function AdminAuditLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    const admin =
      parseStoredJson("admin", null);

    if (!token) {
      navigate("/admin/login");
      return;
    }

    if (admin?.role !== "superadmin") {
      alert(
        "Only superadmin can view audit logs."
      );

      navigate("/admin/dashboard");
      return;
    }

    fetchLogs(token);
  }, [navigate]);

  const fetchLogs = async (token) => {
    try {
      const res = await axios.get(
        `${getApiBaseUrl()}/admin/audit-logs?limit=200`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(
        res.data?.logs || []
      );

    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "admin"
        );

        navigate("/admin/login");

        return;
      }

      if (
        error.response?.status === 403
      ) {
        alert(
          "Only superadmin can view audit logs."
        );

        navigate(
          "/admin/dashboard"
        );

        return;
      }

      alert(
        error.response?.data
          ?.message ||
          "Failed to load audit logs."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    logs.length / logsPerPage
  );

  const indexOfLastLog =
    currentPage * logsPerPage;

  const indexOfFirstLog =
    indexOfLastLog - logsPerPage;

  const currentLogs = logs.slice(
    indexOfFirstLog,
    indexOfLastLog
  );

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // GO TO DASHBOARD
  // =========================

  const handleClose = () => {
    navigate(
      "/admin/dashboard"
    );
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusClass = (status) => {
    const value =
      String(status || "")
        .toLowerCase();

    if (
      value === "success" ||
      value === "successful" ||
      value === "approved"
    ) {
      return "bg-green-100 text-green-800";
    }

    if (
      value === "failed" ||
      value === "error" ||
      value === "rejected"
    ) {
      return "bg-red-100 text-red-800";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="
        min-h-screen
        bg-gray-100
        flex
        items-center
        justify-center
        p-4
      ">
        <p>
          Loading audit logs...
        </p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      bg-gray-100
      px-3
      py-5
      sm:px-5
      sm:py-8
      md:px-8
      md:py-10
    ">

      {/* =========================
          HEADER
      ========================= */}

      <div className="
        flex
        flex-col
        gap-4
        mb-6
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-gray-800
        ">
          Admin Audit Logs
        </h1>

        <button
          type="button"
          onClick={handleClose}
          className="
            w-full
            sm:w-auto
            bg-green-900
            px-4
            py-2
            rounded-lg
            font-semibold
            hover:bg-green-800
            transition
            text-white
          "
        >
          Close
        </button>

      </div>

      {/* =========================
          NO LOGS
      ========================= */}

      {logs.length === 0 ? (

        <div className="
          bg-white
          rounded-lg
          shadow
          p-6
          text-center
        ">
          <p>
            No audit logs found.
          </p>
        </div>

      ) : (

        <>

          {/* =========================
              MOBILE LOG CARDS
          ========================= */}

          <div className="
            block
            md:hidden
            space-y-4
          ">

            {currentLogs.map((log) => (

              <div
                key={log._id}
                className="
                  bg-white
                  rounded-xl
                  shadow
                  border
                  p-4
                  space-y-3
                "
              >

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                  ">
                    Time
                  </p>

                  <p className="
                    text-sm
                    wrap-break-word
                  ">
                    {new Date(
                      log.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                  ">
                    Username
                  </p>

                  <p className="
                    text-sm
                    wrap-break-word
                  ">
                    {log.username ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                  ">
                    Action
                  </p>

                  <p className="
                    text-sm
                    wrap-break-word
                  ">
                    {log.action ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                  ">
                    Target
                  </p>

                  <p className="
                    text-sm
                    break-all
                  ">
                    {log.targetType ||
                      "-"}

                    {log.targetId
                      ? ` (${log.targetId})`
                      : ""}
                  </p>
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                    mb-1
                  ">
                    Status
                  </p>

                  <span className={`
                    inline-block
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${getStatusClass(
                      log.status
                    )}
                  `}>
                    {log.status ||
                      "Unknown"}
                  </span>
                </div>

                <div>
                  <p className="
                    text-xs
                    font-semibold
                    text-gray-500
                  ">
                    Details
                  </p>

                  <p className="
                    text-sm
                    wrap-break-word
                  ">
                    {log.details ||
                      "-"}
                  </p>
                </div>

              </div>

            ))}

          </div>

          {/* =========================
              DESKTOP TABLE
          ========================= */}

          <div className="
            hidden
            md:block
            bg-white
            rounded-xl
            shadow
            overflow-hidden
          ">

            <table className="
              w-full
              border-collapse
              text-sm
            ">

              <thead className="
                bg-gray-100
              ">

                <tr>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Time
                  </th>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Username
                  </th>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Action
                  </th>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Target
                  </th>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Status
                  </th>

                  <th className="
                    border
                    p-3
                    text-left
                  ">
                    Details
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentLogs.map((log) => (

                  <tr
                    key={log._id}
                    className="
                      hover:bg-gray-50
                    "
                  >

                    <td className="
                      border
                      p-3
                    ">
                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </td>

                    <td className="
                      border
                      p-3
                    ">
                      {log.username ||
                        "N/A"}
                    </td>

                    <td className="
                      border
                      p-3
                    ">
                      {log.action ||
                        "-"}
                    </td>

                    <td className="
                      border
                      p-3
                      break-all
                    ">
                      {log.targetType ||
                        "-"}

                      {log.targetId
                        ? ` (${log.targetId})`
                        : ""}
                    </td>

                    <td className="
                      border
                      p-3
                    ">

                      <span className={`
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${getStatusClass(
                          log.status
                        )}
                      `}>
                        {log.status ||
                          "Unknown"}
                      </span>

                    </td>

                    <td className="
                      border
                      p-3
                      wrap-break-word
                    ">
                      {log.details ||
                        "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* =========================
              PAGINATION
          ========================= */}

          <div className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-2
            mt-8
          ">

            {/* PREVIOUS */}

            <button
              onClick={() =>
                goToPage(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className="
                px-3
                py-2
                rounded-lg
                bg-gray-200
                hover:bg-gray-300
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-sm
              "
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            {Array.from(
              {
                length: totalPages,
              },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() =>
                  goToPage(page)
                }
                className={`
                  min-w-9
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  font-semibold
                  ${
                    currentPage === page
                      ? "bg-green-900 text-white"
                      : "bg-white border hover:bg-gray-100"
                  }
                `}
              >
                {page}
              </button>

            ))}

            {/* NEXT */}

            <button
              onClick={() =>
                goToPage(
                  currentPage + 1
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="
                px-3
                py-2
                rounded-lg
                bg-gray-200
                hover:bg-gray-300
                disabled:opacity-40
                disabled:cursor-not-allowed
                text-sm
              "
            >
              Next
            </button>

          </div>

          {/* PAGE INFO */}

          <p className="
            text-center
            text-sm
            text-gray-600
            mt-3
          ">
            Page {currentPage} of{" "}
            {totalPages}
          </p>

        </>

      )}

    </div>
  );
}