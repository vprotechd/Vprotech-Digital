import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  X,
  Save,
} from "lucide-react";

import { offerService } from "../../services/api";
import { toast, Toaster } from "react-hot-toast";

// ============================================
// COURSE IMAGES
// ============================================

import cCppImage from "../../assets/images/courses/c-cpp.jpg";
import webDesigningImage from "../../assets/images/courses/web-designing.jpg";
import digitalMarketingImage from "../../assets/images/courses/digital-marketing.jpg";
import javaPythonImage from "../../assets/images/courses/java-python.jpg";
import javascriptImage from "../../assets/images/courses/javascript.jpg";
import machineLearningImage from "../../assets/images/courses/machine-learning.jpg";
import iotImage from "../../assets/images/courses/iot.jpg";
import networkingImage from "../../assets/images/courses/networking.jpg";
import dataScienceImage from "../../assets/images/courses/data-science.jpg";
import artificialIntelligenceImage from "../../assets/images/courses/artificial-intelligence.jpg";
import autocadMechanicalImage from "../../assets/images/courses/autocad-mechanical.jpg";
import autocadCivilImage from "../../assets/images/courses/autocad-civil.jpg";
import solidworksImage from "../../assets/images/courses/solidworks.jpg";
import catiaImage from "../../assets/images/courses/catia.jpg";
import creoImage from "../../assets/images/courses/creo.jpg";
import staadProImage from "../../assets/images/courses/staad-pro.jpg";
import revitImage from "../../assets/images/courses/revit.jpg";
import matlabImage from "../../assets/images/courses/matlab.jpg";
import embeddedSystemImage from "../../assets/images/courses/embedded-system.jpg";
import roboticsImage from "../../assets/images/courses/robotics.jpg";

import "./AdminOffers.css";

// ============================================
// EMPTY FORM
// ============================================

const emptyForm = {
  title: "",
  courseName: "",
  courseSlug: "",
  description: "",
  image: "",
  originalPrice: "",
  offerPrice: "",
  discountPercentage: "",
  buttonText: "View Course",
  buttonLink: "/courses",
  isActive: true,
  showPopup: true,
  startDate: "",
  endDate: "",
  priority: 0,
};

// ============================================
// COURSES
// IMPORTANT:
// Do NOT use "/src/assets/..." here.
// Vite imported image variables are used instead.
// ============================================

const courses = [
  {
    name: "C/C++",
    slug: "c-cpp",
    image: cCppImage,
  },
  {
    name: "Web Designing",
    slug: "web-designing",
    image: webDesigningImage,
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    image: digitalMarketingImage,
  },
  {
    name: "Java & Python",
    slug: "java-python",
    image: javaPythonImage,
  },
  {
    name: "JavaScript",
    slug: "javascript",
    image: javascriptImage,
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    image: machineLearningImage,
  },
  {
    name: "IoT",
    slug: "iot",
    image: iotImage,
  },
  {
    name: "Networking",
    slug: "networking",
    image: networkingImage,
  },
  {
    name: "Data Science",
    slug: "data-science",
    image: dataScienceImage,
  },
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    image: artificialIntelligenceImage,
  },
  {
    name: "AutoCAD Mechanical",
    slug: "autocad-mechanical",
    image: autocadMechanicalImage,
  },
  {
    name: "AutoCAD Civil",
    slug: "autocad-civil",
    image: autocadCivilImage,
  },
  {
    name: "SolidWorks",
    slug: "solidworks",
    image: solidworksImage,
  },
  {
    name: "CATIA",
    slug: "catia",
    image: catiaImage,
  },
  {
    name: "Creo",
    slug: "creo",
    image: creoImage,
  },
  {
    name: "STAAD Pro",
    slug: "staad-pro",
    image: staadProImage,
  },
  {
    name: "Revit",
    slug: "revit",
    image: revitImage,
  },
  {
    name: "MATLAB",
    slug: "matlab",
    image: matlabImage,
  },
  {
    name: "Embedded System",
    slug: "embedded-system",
    image: embeddedSystemImage,
  },
  {
    name: "Robotics",
    slug: "robotics",
    image: roboticsImage,
  },
];

// ============================================
// COURSE IMAGE MAP
// ============================================

const courseImageMap = courses.reduce((map, course) => {
  map[course.slug] = course.image;
  return map;
}, {});

// ============================================
// GET CORRECT IMAGE
// Handles both:
// 1. New Vite-generated image paths
// 2. Old broken "/src/..." database values
// ============================================

const getCourseImage = (offer) => {
  if (!offer) {
    return "";
  }

  const image = offer.image || "";
  const slug = offer.courseSlug || "";

  // If the old broken source path was saved
  if (image.startsWith("/src/")) {
    return courseImageMap[slug] || "";
  }

  // If there is no image but course slug exists
  if (!image && slug) {
    return courseImageMap[slug] || "";
  }

  return image;
};

// ============================================
// COMPONENT
// ============================================

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // FETCH OFFERS
  // ==========================================

  const fetchOffers = async () => {
    try {
      setLoading(true);

      const response = await offerService.getAdminOffers();

      setOffers(response.data || []);
    } catch (error) {
      console.error("Failed to load offers:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load offers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchOffers();
  }, []);

  // ==========================================
  // HANDLE NORMAL INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // HANDLE COURSE CHANGE
  // Automatically fills:
  // - courseName
  // - courseSlug
  // - image
  // ==========================================

  const handleCourseChange = (e) => {
    const selectedName = e.target.value;

    const selectedCourse = courses.find(
      (course) =>
        course.name === selectedName
    );

    setForm((previous) => ({
      ...previous,

      courseName:
        selectedCourse?.name || "",

      courseSlug:
        selectedCourse?.slug || "",

      image:
        selectedCourse?.image || "",
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ==========================================
  // SUBMIT OFFER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,

        originalPrice: Number(
          form.originalPrice
        ),

        offerPrice: Number(
          form.offerPrice
        ),

        discountPercentage:
          form.discountPercentage
            ? Number(
                form.discountPercentage
              )
            : undefined,

        priority: Number(
          form.priority || 0
        ),
      };

      // ======================================
      // UPDATE
      // ======================================

      if (editingId) {
        await offerService.updateOffer(
          editingId,
          payload
        );

        toast.success(
          "Offer updated successfully"
        );
      }

      // ======================================
      // CREATE
      // ======================================

      else {
        await offerService.createOffer(
          payload
        );

        toast.success(
          "Offer created successfully"
        );
      }

      resetForm();

      await fetchOffers();
    } catch (error) {
      console.error(
        "Failed to save offer:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to save offer"
      );
    }
  };

  // ==========================================
  // EDIT OFFER
  // ==========================================

  const handleEdit = (offer) => {
    setEditingId(offer._id);

    /*
     * IMPORTANT:
     * If old database data contains:
     *
     * /src/assets/images/...
     *
     * use the imported Vite image instead.
     */

    const correctImage =
      getCourseImage(offer);

    setForm({
      title: offer.title || "",

      courseName:
        offer.courseName || "",

      courseSlug:
        offer.courseSlug || "",

      description:
        offer.description || "",

      image:
        correctImage || "",

      originalPrice:
        offer.originalPrice || "",

      offerPrice:
        offer.offerPrice || "",

      discountPercentage:
        offer.discountPercentage || "",

      buttonText:
        offer.buttonText ||
        "View Course",

      buttonLink:
        offer.buttonLink ||
        "/courses",

      isActive:
        offer.isActive ?? true,

      showPopup:
        offer.showPopup ?? true,

      startDate:
        offer.startDate
          ? offer.startDate.slice(0, 10)
          : "",

      endDate:
        offer.endDate
          ? offer.endDate.slice(0, 10)
          : "",

      priority:
        offer.priority || 0,
    });

    setShowForm(true);
  };

  // ==========================================
  // DELETE OFFER
  // ==========================================
const handleDelete = async (id) => {
  toast(
    (t) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          minWidth: "280px",
        }}
      >
        <strong>
          Are you sure you want to delete this offer?
        </strong>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "7px 14px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                await offerService.deleteOffer(id);

                toast.success(
                  "Offer deleted successfully"
                );

                await fetchOffers();
              } catch (error) {
                console.error(
                  "Failed to delete offer:",
                  error
                );

                toast.error(
                  error.response?.data?.message ||
                    "Failed to delete offer"
                );
              }
            }}
            style={{
              padding: "7px 14px",
              border: "none",
              borderRadius: "6px",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "top-right",
    }
  );
};

  // ==========================================
  // TOGGLE ACTIVE STATUS
  // ==========================================

  const handleToggle = async (id) => {
    try {
      await offerService.toggleStatus(id);

      toast.success(
        "Offer status updated"
      );

      await fetchOffers();
    } catch (error) {
      console.error(
        "Failed to update status:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // ==========================================
  // TOGGLE POPUP
  // ==========================================

  const handleTogglePopup = async (id) => {
    try {
      await offerService.togglePopup(id);

      toast.success(
        "Popup visibility updated"
      );

      await fetchOffers();
    } catch (error) {
      console.error(
        "Failed to update popup:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update popup"
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="admin-offers">
      <Toaster
  position="top-right"
  toastOptions={{
    duration: 3000,
  }}
/>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="admin-offers-header">

        <div>
          <h2>
            Course Offers
          </h2>

          <p>
            Manage promotional offers shown
            on the homepage.
          </p>
        </div>

        <button
          className="offer-add-btn"
          onClick={() => {
            setForm({
              ...emptyForm,
            });

            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />

          Add Offer
        </button>

      </div>

      {/* =====================================
          FORM
      ====================================== */}

      {showForm && (
        <div className="offer-form-card">

          {/* FORM HEADER */}

          <div className="offer-form-header">

            <h3>
              {editingId
                ? "Edit Offer"
                : "Create New Offer"}
            </h3>

            <button
              type="button"
              className="offer-close-btn"
              onClick={resetForm}
            >
              <X size={20} />
            </button>

          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="offer-form-grid">

              {/* TITLE */}

              <div className="offer-field full">

                <label>
                  Offer Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Special Web Development Offer"
                  required
                />

              </div>

              {/* COURSE */}

              <div className="offer-field">

                <label>
                  Course
                </label>

                <select
                  value={form.courseName}
                  onChange={
                    handleCourseChange
                  }
                  required
                >

                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (course) => (
                      <option
                        key={course.slug}
                        value={course.name}
                      >
                        {course.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* COURSE SLUG */}

              <div className="offer-field">

                <label>
                  Course Slug
                </label>

                <input
                  type="text"
                  name="courseSlug"
                  value={form.courseSlug}
                  onChange={handleChange}
                  placeholder="web-designing"
                  required
                />

              </div>

              {/* ORIGINAL PRICE */}

              <div className="offer-field">

                <label>
                  Original Price
                </label>

                <input
                  type="number"
                  name="originalPrice"
                  value={
                    form.originalPrice
                  }
                  onChange={handleChange}
                  placeholder="20000"
                  min="0"
                  required
                />

              </div>

              {/* OFFER PRICE */}

              <div className="offer-field">

                <label>
                  Offer Price
                </label>

                <input
                  type="number"
                  name="offerPrice"
                  value={
                    form.offerPrice
                  }
                  onChange={handleChange}
                  placeholder="9999"
                  min="0"
                  required
                />

              </div>

              {/* DISCOUNT */}

              <div className="offer-field">

                <label>
                  Discount %
                </label>

                <input
                  type="number"
                  name="discountPercentage"
                  value={
                    form.discountPercentage
                  }
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  max="100"
                />

              </div>

              {/* PRIORITY */}

              <div className="offer-field">

                <label>
                  Priority
                </label>

                <input
                  type="number"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  min="0"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="offer-field full">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  placeholder="Learn modern web development..."
                  rows="4"
                />

              </div>

              {/* IMAGE */}

              <div className="offer-field full">

                <label>
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/assets/course-image.jpg"
                />

                {form.image && (
                  <div
                    style={{
                      marginTop: "10px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      maxWidth: "220px",
                    }}
                  >
                    <img
                      src={form.image}
                      alt={
                        form.courseName ||
                        "Course"
                      }
                      style={{
                        width: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        const fallback =
                          courseImageMap[
                            form.courseSlug
                          ];

                        if (
                          fallback &&
                          e.currentTarget
                            .src !== fallback
                        ) {
                          e.currentTarget.src =
                            fallback;
                        }
                      }}
                    />
                  </div>
                )}

              </div>

              {/* BUTTON TEXT */}

              <div className="offer-field">

                <label>
                  Button Text
                </label>

                <input
                  type="text"
                  name="buttonText"
                  value={
                    form.buttonText
                  }
                  onChange={handleChange}
                  placeholder="View Course"
                />

              </div>

              {/* BUTTON LINK */}

              <div className="offer-field">

                <label>
                  Button Link
                </label>

                <input
                  type="text"
                  name="buttonLink"
                  value={
                    form.buttonLink
                  }
                  onChange={handleChange}
                  placeholder="/courses"
                />

              </div>

              {/* START DATE */}

              <div className="offer-field">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={
                    form.startDate
                  }
                  onChange={handleChange}
                />

              </div>

              {/* END DATE */}

              <div className="offer-field">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={
                    form.endDate
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* =================================
                CHECKBOXES
            ================================== */}

            <div className="offer-checkboxes">

              <label>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                />

                Active Offer

              </label>

              <label>

                <input
                  type="checkbox"
                  name="showPopup"
                  checked={
                    form.showPopup
                  }
                  onChange={
                    handleChange
                  }
                />

                Show on Homepage Popup

              </label>

            </div>

            {/* =================================
                FORM ACTIONS
            ================================== */}

            <div className="offer-form-actions">

              <button
                type="button"
                className="offer-cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="offer-save-btn"
              >
                <Save size={18} />

                {editingId
                  ? "Update Offer"
                  : "Create Offer"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          OFFER LIST
      ====================================== */}

      <div className="offer-list">

        {/* LOADING */}

        {loading ? (
          <div className="offer-empty">

            Loading offers...

          </div>
        )

        /* NO OFFERS */

        : offers.length === 0 ? (

          <div className="offer-empty">

            <h3>
              No offers created yet
            </h3>

            <p>
              Click "Add Offer" to create
              your first course offer.
            </p>

          </div>

        )

        /* OFFERS */

        : (

          offers.map((offer) => {

            const imageUrl =
              getCourseImage(offer);

            return (
              <div
                className="offer-admin-card"
                key={offer._id}
              >

                {/* =================================
                    IMAGE
                ================================== */}

                <div className="offer-admin-image">

                  {imageUrl ? (

                    <img
                      src={imageUrl}
                      alt={
                        offer.courseName ||
                        "Course offer"
                      }
                      onError={(e) => {

                        /*
                         * If the database contains
                         * an old/broken image path,
                         * automatically try the
                         * correct imported image.
                         */

                        const fallback =
                          courseImageMap[
                            offer.courseSlug
                          ];

                        if (
                          fallback &&
                          e.currentTarget
                            .src !== fallback
                        ) {
                          e.currentTarget.src =
                            fallback;
                        } else {
                          e.currentTarget.style.display =
                            "none";
                        }
                      }}
                    />

                  ) : (

                    <div className="offer-no-image">
                      OFFER
                    </div>

                  )}

                  {offer.discountPercentage >
                    0 && (

                    <span className="offer-discount">

                      {offer.discountPercentage}
                      % OFF

                    </span>

                  )}

                </div>

                {/* =================================
                    CONTENT
                ================================== */}

                <div className="offer-admin-content">

                  {/* TOP */}

                  <div className="offer-admin-top">

                    <div>

                      <h3>
                        {offer.title}
                      </h3>

                      <p>
                        {offer.courseName}
                      </p>

                    </div>

                    <span
                      className={
                        offer.isActive
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {offer.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="offer-admin-description">
                    {offer.description}
                  </p>

                  {/* PRICES */}

                  <div className="offer-prices">

                    <span className="original">
                      ₹
                      {Number(
                        offer.originalPrice
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="offer-price">
                      ₹
                      {Number(
                        offer.offerPrice
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="offer-admin-actions">

                    {/* ACTIVE / INACTIVE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleToggle(
                          offer._id
                        )
                      }
                    >
                      <Power size={16} />

                      {offer.isActive
                        ? "Disable"
                        : "Enable"}
                    </button>

                    {/* POPUP */}

                    <button
                      type="button"
                      onClick={() =>
                        handleTogglePopup(
                          offer._id
                        )
                      }
                    >
                      {offer.showPopup
                        ? "Hide Popup"
                        : "Show Popup"}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          offer
                        )
                      }
                    >
                      <Pencil size={16} />

                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete"
                      onClick={() =>
                        handleDelete(
                          offer._id
                        )
                      }
                    >
                      <Trash2 size={16} />

                      Delete
                    </button>

                  </div>

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
};

export default AdminOffers;