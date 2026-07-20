import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { resolveImageSource } from "../../assets/assets.js";

export default function Products() {
  const navigate = useNavigate();

  // =========================
  // PRODUCTS STATE
  // =========================

  const [products, setProducts] = useState([]);

  // =========================
  // MIGRATION STATE
  // =========================

  const [isMigratingImages, setIsMigratingImages] =
    useState(false);

  const [migrationSummary, setMigrationSummary] =
    useState(null);

  const [migrationDetails, setMigrationDetails] =
    useState({
      migrated: [],
      skipped: [],
      failed: [],
    });

  // =========================
  // PAGINATION STATE
  // =========================

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 10;

  // =========================
  // API URL
  // =========================

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

  // =========================
  // CHECK CLOUDINARY URL
  // =========================

  const isCloudinaryImageUrl = (value) => {
    const image = String(value || "").trim();

    return image.startsWith(
      "https://res.cloudinary.com/"
    );
  };

  // =========================
  // PAGINATION CALCULATIONS
  // =========================

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // =========================
  // FETCH PRODUCTS ON LOAD
  // =========================

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const token =
        localStorage.getItem("adminToken");

      const res = await axios.get(
        `${getApiBaseUrl()}/admin/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(
        res.data.products || []
      );

    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        navigate("/admin/login");

      } else {
        alert(
          "Failed to fetch products."
        );
      }
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem("adminToken");

      await axios.delete(
        `${getApiBaseUrl()}/admin/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) =>
            product._id !== id
        )
      );

      // If deleting the last product
      // on a page, go back one page
      if (
        currentProducts.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(
          (prevPage) =>
            prevPage - 1
        );
      }

      alert(
        "Product deleted successfully!"
      );

    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        navigate("/admin/login");

      } else {
        alert(
          "Failed to delete product."
        );
      }
    }
  };

  // =========================
  // MIGRATE URL IMAGES
  // =========================

  const migrateImagesToCloudinary =
    async () => {
      const confirmed = window.confirm(
        "Migrate all existing product image URLs to Cloudinary now?"
      );

      if (!confirmed) {
        return;
      }

      try {
        setIsMigratingImages(true);

        setMigrationSummary(null);

        setMigrationDetails({
          migrated: [],
          skipped: [],
          failed: [],
        });

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const res = await axios.post(
          `${getApiBaseUrl()}/admin/products/migrate-images-to-cloudinary`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const summary =
          res.data?.summary || {};

        setMigrationSummary(summary);

        setMigrationDetails({
          migrated:
            Array.isArray(
              res.data?.migrated
            )
              ? res.data.migrated
              : [],

          skipped:
            Array.isArray(
              res.data?.skipped
            )
              ? res.data.skipped
              : [],

          failed:
            Array.isArray(
              res.data?.failed
            )
              ? res.data.failed
              : [],
        });

        await fetchProducts();

        alert(
          "Image migration completed."
        );

      } catch (error) {
        console.error(error);

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "adminToken"
          );

          navigate("/admin/login");

        } else if (
          error.response?.status === 403
        ) {
          alert(
            "You do not have permission to run migration."
          );

        } else {
          const missingConfig =
            Array.isArray(
              error.response?.data
                ?.missingConfig
            )
              ? error.response.data
                  .missingConfig
              : [];

          if (
            missingConfig.length > 0
          ) {
            alert(
              `Missing Cloudinary config: ${missingConfig.join(
                ", "
              )}`
            );

          } else {
            alert(
              error.response?.data
                ?.message ||
                "Failed to migrate images."
            );
          }
        }

      } finally {
        setIsMigratingImages(false);
      }
    };

  // =========================
  // MIGRATE LOCAL ASSET KEYS
  // =========================

  const migrateLocalAssetKeysToCloudinary =
    async () => {
      const confirmed = window.confirm(
        "Upload local asset-key product images to Cloudinary now?"
      );

      if (!confirmed) {
        return;
      }

      try {
        setIsMigratingImages(true);

        setMigrationSummary(null);

        setMigrationDetails({
          migrated: [],
          skipped: [],
          failed: [],
        });

        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          localStorage.removeItem(
            "adminToken"
          );

          navigate("/admin/login");

          return;
        }

        const migrated = [];
        const skipped = [];
        const failed = [];

        for (
          const product of products
        ) {
          const keyOrUrl = String(
            product.img ||
              product.image ||
              ""
          ).trim();

          if (!keyOrUrl) {
            skipped.push({
              productId:
                product._id,

              reason:
                "Missing image",
            });

            continue;
          }

          if (
            isCloudinaryImageUrl(
              keyOrUrl
            )
          ) {
            skipped.push({
              productId:
                product._id,

              reason:
                "Already Cloudinary",
            });

            continue;
          }

          if (
            /^https?:\/\//i.test(
              keyOrUrl
            )
          ) {
            skipped.push({
              productId:
                product._id,

              reason:
                "Public URL - use Migrate Images button",

              image: keyOrUrl,
            });

            continue;
          }

          const localAssetUrl =
            resolveImageSource(
              keyOrUrl
            );

          if (
            !localAssetUrl ||
            typeof localAssetUrl !==
              "string" ||
            localAssetUrl ===
              keyOrUrl
          ) {
            skipped.push({
              productId:
                product._id,

              reason:
                "Asset key not found in assets map",

              image: keyOrUrl,
            });

            continue;
          }

          try {
            // =========================
            // GET SIGNED CLOUDINARY DATA
            // =========================

            const signRes =
              await axios.post(
                `${getApiBaseUrl()}/admin/cloudinary/sign-upload`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

            const signPayload =
              signRes.data || {};

            if (
              !signPayload.cloudName ||
              !signPayload.apiKey ||
              !signPayload.signature ||
              !signPayload.timestamp ||
              !signPayload.folder ||
              !signPayload.transformation
            ) {
              throw new Error(
                "Invalid Cloudinary signature response from server."
              );
            }

            // =========================
            // LOAD LOCAL IMAGE
            // =========================

            const fileResponse =
              await fetch(
                localAssetUrl
              );

            if (
              !fileResponse.ok
            ) {
              throw new Error(
                "Failed to load local asset image"
              );
            }

            const blob =
              await fileResponse.blob();

            const extensionFromType =
              blob.type ===
              "image/jpeg"
                ? "jpg"
                : blob.type.split(
                    "/"
                  )[1] || "png";

            const fileName = `${keyOrUrl}.${extensionFromType}`;

            const imageFile =
              new File(
                [blob],
                fileName,
                {
                  type:
                    blob.type ||
                    "image/png",
                }
              );

            // =========================
            // CLOUDINARY FORM DATA
            // =========================

            const formData =
              new FormData();

            formData.append(
              "file",
              imageFile
            );

            formData.append(
              "api_key",
              signPayload.apiKey
            );

            formData.append(
              "timestamp",
              String(
                signPayload.timestamp
              )
            );

            formData.append(
              "signature",
              signPayload.signature
            );

            formData.append(
              "folder",
              signPayload.folder
            );

            formData.append(
              "transformation",
              signPayload.transformation
            );

            // =========================
            // UPLOAD TO CLOUDINARY
            // =========================

            const uploadRes =
              await axios.post(
                `https://api.cloudinary.com/v1_1/${signPayload.cloudName}/image/upload`,
                formData
              );

            const secureUrl =
              uploadRes.data?.secure_url;

            if (!secureUrl) {
              throw new Error(
                "Cloudinary did not return secure_url"
              );
            }

            // =========================
            // UPDATE PRODUCT
            // =========================

            await axios.put(
              `${getApiBaseUrl()}/admin/products/${product._id}`,
              {
                img: secureUrl,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            migrated.push({
              productId:
                product._id,

              from: keyOrUrl,

              to: secureUrl,
            });

          } catch (
            migrationError
          ) {
            failed.push({
              productId:
                product._id,

              image: keyOrUrl,

              reason:
                migrationError
                  .response?.data
                  ?.message ||
                migrationError.message,
            });
          }
        }

        // =========================
        // MIGRATION SUMMARY
        // =========================

        setMigrationSummary({
          totalProducts:
            products.length,

          migrated:
            migrated.length,

          skipped:
            skipped.length,

          failed:
            failed.length,
        });

        setMigrationDetails({
          migrated,
          skipped,
          failed,
        });

        await fetchProducts();

        alert(
          "Local asset-key migration completed."
        );

      } catch (error) {
        console.error(error);

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "adminToken"
          );

          navigate("/admin/login");

        } else if (
          error.response?.status === 403
        ) {
          alert(
            "You do not have permission to run local asset migration."
          );

        } else {
          const missingConfig =
            Array.isArray(
              error.response?.data
                ?.missingConfig
            )
              ? error.response.data
                  .missingConfig
              : [];

          if (
            missingConfig.length > 0
          ) {
            alert(
              `Missing Cloudinary config: ${missingConfig.join(
                ", "
              )}`
            );

          } else {
            alert(
              error.response?.data
                ?.message ||
                "Failed to migrate local asset-key images."
            );
          }
        }

      } finally {
        setIsMigratingImages(false);
      }
    };

  // =========================
  // GO TO DASHBOARD
  // =========================

  const handleClose = () => {
    navigate("/admin/dashboard");
  };

  // =========================
  // PAGINATION CONTROLS
  // =========================

  const goToNextPage = () => {
    if (
      currentPage < totalPages
    ) {
      setCurrentPage(
        (prevPage) =>
          prevPage + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToPreviousPage = () => {
    if (
      currentPage > 1
    ) {
      setCurrentPage(
        (prevPage) =>
          prevPage - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="
      min-h-screen
      bg-gray-100
      p-3
      sm:p-5
      md:p-8
    ">

      {/* =========================
          HEADER
      ========================= */}

      <div className="
        flex
        flex-col
        gap-4
        mb-6
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-gray-800
        ">
          Manage Products
        </h1>

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:flex
          gap-2
          sm:gap-3
          w-full
          lg:w-auto
        ">

          {/* MIGRATE URL IMAGES */}

          <button
            onClick={
              migrateImagesToCloudinary
            }
            disabled={
              isMigratingImages
            }
            className="
              w-full
              lg:w-auto
              bg-blue-700
              hover:bg-blue-800
              disabled:bg-blue-400
              text-white
              px-3
              sm:px-5
              py-2
              rounded
              text-sm
              sm:text-base
              whitespace-nowrap
            "
          >
            {isMigratingImages
              ? "Migrating..."
              : "Migrate URL Images"}
          </button>

          {/* MIGRATE LOCAL KEYS */}

          <button
            onClick={
              migrateLocalAssetKeysToCloudinary
            }
            disabled={
              isMigratingImages
            }
            className="
              w-full
              lg:w-auto
              bg-indigo-500
              hover:bg-indigo-800
              disabled:bg-indigo-400
              text-white
              px-3
              sm:px-5
              py-2
              rounded
              text-sm
              sm:text-base
              whitespace-nowrap
            "
          >
            {isMigratingImages
              ? "Migrating..."
              : "Migrate Local Keys"}
          </button>

          {/* ADD PRODUCT */}

          <Link
            to="/admin/add-product"
            className="
              w-full
              lg:w-auto
              bg-green-700
              hover:bg-green-800
              text-white
              px-3
              sm:px-5
              py-2
              rounded
              text-sm
              sm:text-base
              text-center
              whitespace-nowrap
            "
          >
            Add Product
          </Link>

          {/* CLOSE */}

          <button
            type="button"
            onClick={
              handleClose
            }
            className="
              w-full
              lg:w-auto
              bg-green-900
              hover:bg-green-800
              text-white
              px-3
              sm:px-5
              py-2
              rounded
              text-sm
              sm:text-base
              whitespace-nowrap
            "
          >
            Close
          </button>

        </div>

      </div>

      {/* =========================
          MIGRATION SUMMARY
      ========================= */}

      {migrationSummary && (

        <div className="
          mb-6
          rounded
          border
          border-blue-200
          bg-blue-50
          p-3
          sm:p-4
          text-sm
          text-blue-900
          overflow-hidden
        ">

          <p className="wrap-break-word">

            <strong>
              Migration Summary:
            </strong>

            {" "}
            Total{" "}
            {migrationSummary.totalProducts ||
              0}

            {", "}
            Migrated{" "}
            {migrationSummary.migrated ||
              0}

            {", "}
            Skipped{" "}
            {migrationSummary.skipped ||
              0}

            {", "}
            Failed{" "}
            {migrationSummary.failed ||
              0}

          </p>

          {/* SKIPPED */}

          {migrationDetails
            .skipped.length >
            0 && (

            <div className="mt-3">

              <p className="
                font-semibold
                mb-1
              ">
                Skipped Reasons
              </p>

              {Object.entries(
                migrationDetails
                  .skipped
                  .reduce(
                    (
                      acc,
                      item
                    ) => {
                      const reason =
                        item?.reason ||
                        "Unknown";

                      acc[reason] =
                        (acc[reason] ||
                          0) + 1;

                      return acc;
                    },
                    {}
                  )
              ).map(
                ([
                  reason,
                  count,
                ]) => (

                  <p
                    key={reason}
                    className="wrap-break-word"
                  >
                    - {reason}:{" "}
                    {count}
                  </p>

                )
              )}

            </div>

          )}

          {/* FAILED */}

          {migrationDetails
            .failed.length >
            0 && (

            <div className="mt-3">

              <p className="
                font-semibold
                mb-1
              ">
                Failed Items
              </p>

              {migrationDetails
                .failed
                .slice(0, 5)
                .map(
                  (item) => (

                    <p
                      key={
                        item.productId
                      }
                      className="break-all"
                    >
                      -{" "}
                      {
                        item.productId
                      }
                      :{" "}
                      {
                        item.reason
                      }
                    </p>

                  )
                )}

            </div>

          )}

          {/* MIGRATED */}

          {migrationDetails
            .migrated.length >
            0 && (

            <p className="
              mt-3
              text-green-800
              wrap-break-word
            ">

              Successfully migrated
              product IDs:{" "}

              {migrationDetails
                .migrated
                .slice(0, 5)
                .map(
                  (item) =>
                    item.productId
                )
                .join(", ")}

              {migrationDetails
                .migrated.length >
                5
                ? " ..."
                : ""}

            </p>

          )}

        </div>

      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {products.length === 0 ? (

        <div className="
          bg-white
          rounded-lg
          shadow
          p-6
          text-center
        ">
          No products available.
        </div>

      ) : (

        <>

          {/* TABLE */}

          {/* =========================
    RESPONSIVE PRODUCTS TABLE
========================= */}

<div className="
  bg-white
  rounded-lg
  shadow
  overflow-hidden
">

  <table className="
    w-full
    table-fixed
    border-collapse
  ">

    <thead className="bg-gray-200">

      <tr>

        {/* IMAGE */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          w-[15%]
          sm:w-[12%]
          md:w-[12%]
          lg:w-auto
        ">
          Image
        </th>

        {/* NAME */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          w-[25%]
          sm:w-[22%]
          md:w-[20%]
          lg:w-auto
        ">
          Name
        </th>

        {/* CATEGORY */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          hidden
          sm:table-cell
          md:table-cell
          lg:table-cell
        ">
          Category
        </th>

        {/* PRICE */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          w-[18%]
          sm:w-[15%]
          md:w-[14%]
          lg:w-auto
        ">
          Price
        </th>

        {/* QUANTITY */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          w-[14%]
          sm:w-[12%]
          md:w-[12%]
          lg:w-auto
        ">
          Qty
        </th>

        {/* DESCRIPTION */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          hidden
          lg:table-cell
        ">
          Description
        </th>

        {/* ACTIONS */}

        <th className="
          border
          p-1
          sm:p-2
          md:p-3
          text-left
          w-[28%]
          sm:w-[28%]
          md:w-[25%]
          lg:w-auto
        ">
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {currentProducts.map((product) => (

        <tr
          key={product._id}
          className="
            hover:bg-gray-50
          "
        >

          {/* IMAGE */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
          ">

            <img
              src={resolveImageSource(
                product.img ||
                product.image ||
                ""
              )}
              alt={product.name}
              className="
                w-8
                h-8
                sm:w-12
                sm:h-12
                md:w-14
                md:h-14
                object-cover
                rounded
              "
            />

          </td>

          {/* NAME */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
            text-[10px]
            sm:text-xs
            md:text-sm
            font-medium
            wrap-break-word
          ">

            <span className="
              line-clamp-2
            ">
              {product.name}
            </span>

          </td>

          {/* CATEGORY */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
            text-xs
            hidden
            sm:table-cell
            md:table-cell
            lg:table-cell
          ">

            <span className="
              line-clamp-2
            ">
              {product.category}
            </span>

          </td>

          {/* PRICE */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
            text-[10px]
            sm:text-xs
            md:text-sm
            whitespace-nowrap
          ">

            KSh{" "}
            {product.price}

          </td>

          {/* QUANTITY */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
            text-[10px]
            sm:text-xs
            md:text-sm
            text-center
          ">

            {Number(
              product.stock ??
              product.quantity ??
              0
            )}

          </td>

          {/* DESCRIPTION */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
            text-sm
            hidden
            lg:table-cell
          ">

            <span className="
              line-clamp-3
            ">
              {product.description}
            </span>

          </td>

          {/* ACTIONS */}

          <td className="
            border
            p-1
            sm:p-2
            md:p-3
          ">

            <div className="
              flex
              flex-col
              sm:flex-row
              gap-1
              sm:gap-2
            ">

              <Link
                to={`/admin/edit-product/${product._id}`}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-1
                  sm:px-2
                  md:px-3
                  py-1
                  sm:py-2
                  rounded
                  text-[9px]
                  sm:text-xs
                  md:text-sm
                  text-center
                "
              >
                Edit
              </Link>

              <button
                onClick={() =>
                  deleteProduct(
                    product._id
                  )
                }
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-1
                  sm:px-2
                  md:px-3
                  py-1
                  sm:py-2
                  rounded
                  text-[9px]
                  sm:text-xs
                  md:text-sm
                "
              >
                Delete
              </button>

            </div>

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
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-4
            mt-6
          ">

            {/* PRODUCT COUNT */}

            <p className="
              text-sm
              text-gray-600
              text-center
              sm:text-left
            ">

              Showing{" "}
              {indexOfFirstProduct + 1}

              {" "}to{" "}

              {Math.min(
                indexOfLastProduct,
                products.length
              )}

              {" "}of{" "}

              {products.length}

              {" "}products

            </p>

            {/* PAGINATION BUTTONS */}

            <div className="
              flex
              items-center
              gap-3
            ">

              <button
                onClick={
                  goToPreviousPage
                }
                disabled={
                  currentPage === 1
                }
                className="
                  bg-gray-700
                  hover:bg-gray-800
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  px-3
                  sm:px-4
                  py-2
                  rounded
                  text-sm
                  sm:text-base
                "
              >
                Previous
              </button>

              <span className="
                font-semibold
                text-sm
                sm:text-base
                whitespace-nowrap
              ">

                Page{" "}
                {currentPage}
                {" "}of{" "}
                {totalPages}

              </span>

              <button
                onClick={
                  goToNextPage
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="
                  bg-green-700
                  hover:bg-green-800
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  px-3
                  sm:px-4
                  py-2
                  rounded
                  text-sm
                  sm:text-base
                "
              >
                Next
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}