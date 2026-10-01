import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Power,
  X,
  Save,
} from "lucide-react";

import { offerService } from "../../services/api";
import "./AdminOffers.css";

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

const courses = [
  {
    name: "C/C++",
    slug: "c-cpp",
    image: "/src/assets/images/courses/c-cpp.jpg",
  },
  {
    name: "Web Designing",
    slug: "web-designing",
    image: "/src/assets/images/courses/web-designing.jpg",
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    image: "/src/assets/images/courses/digital-marketing.jpg",
  },
  {
    name: "Java & Python",
    slug: "java-python",
    image: "/src/assets/images/courses/java-python.jpg",
  },
  {
    name: "JavaScript",
    slug: "javascript",
    image: "/src/assets/images/courses/javascript.jpg",
  },
  {
    name: "Machine Learning",
    slug: "machine-learning",
    image: "/src/assets/images/courses/machine-learning.jpg",
  },
  {
    name: "IoT",
    slug: "iot",
    image: "/src/assets/images/courses/iot.jpg",
  },
  {
    name: "Networking",
    slug: "networking",
    image: "/src/assets/images/courses/networking.jpg",
  },
  {
    name: "Data Science",
    slug: "data-science",
    image: "/src/assets/images/courses/data-science.jpg",
  },
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    image: "/src/assets/images/courses/artificial-intelligence.jpg",
  },
  {
    name: "AutoCAD Mechanical",
    slug: "autocad-mechanical",
    image: "/src/assets/images/courses/autocad-mechanical.jpg",
  },
  {
    name: "AutoCAD Civil",
    slug: "autocad-civil",
    image: "/src/assets/images/courses/autocad-civil.jpg",
  },
  {
    name: "SolidWorks",
    slug: "solidworks",
    image: "/src/assets/images/courses/solidworks.jpg",
  },
  {
    name: "CATIA",
    slug: "catia",
    image: "/src/assets/images/courses/catia.jpg",
  },
  {
    name: "Creo",
    slug: "creo",
    image: "/src/assets/images/courses/creo.jpg",
  },
  {
    name: "STAAD Pro",
    slug: "staad-pro",
    image: "/src/assets/images/courses/staad-pro.jpg",
  },
  {
    name: "Revit",
    slug: "revit",
    image: "/src/assets/images/courses/revit.jpg",
  },
  {
    name: "MATLAB",
    slug: "matlab",
    image: "/src/assets/images/courses/matlab.jpg",
  },
  {
    name: "Embedded System",
    slug: "embedded-system",
    image: "/src/assets/images/courses/embedded-system.jpg",
  },
  {
    name: "Robotics",
    slug: "robotics",
    image: "/src/assets/images/courses/robotics.jpg",
  },
];

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const fetchOffers = async () => {
    try {
      setLoading(true);

      const response =
        await offerService.getAdminOffers();

      setOffers(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load offers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleCourseChange = (e) => {
    const selectedName = e.target.value;

    const selectedCourse = courses.find(
      (course) =>
        course.name === selectedName
    );

    setForm((previous) => ({
      ...previous,

      courseName: selectedCourse?.name || "",

      courseSlug:
        selectedCourse?.slug || "",

      image:
        selectedCourse?.image || "",
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

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

        priority: Number(form.priority || 0),
      };

      if (editingId) {
        await offerService.updateOffer(
          editingId,
          payload
        );

        toast.success(
          "Offer updated successfully"
        );
      } else {
        await offerService.createOffer(
          payload
        );

        toast.success(
          "Offer created successfully"
        );
      }

      resetForm();
      fetchOffers();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save offer"
      );
    }
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);

    setForm({
      title: offer.title || "",
      courseName: offer.courseName || "",
      courseSlug: offer.courseSlug || "",
      description: offer.description || "",
      image: offer.image || "",
      originalPrice:
        offer.originalPrice || "",
      offerPrice:
        offer.offerPrice || "",
      discountPercentage:
        offer.discountPercentage || "",
      buttonText:
        offer.buttonText || "View Course",
      buttonLink:
        offer.buttonLink || "/courses",
      isActive:
        offer.isActive ?? true,
      showPopup:
        offer.showPopup ?? true,
      startDate: offer.startDate
        ? offer.startDate.slice(0, 10)
        : "",
      endDate: offer.endDate
        ? offer.endDate.slice(0, 10)
        : "",
      priority: offer.priority || 0,
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this offer?"
    );

    if (!confirmed) return;

    try {
      await offerService.deleteOffer(id);

      toast.success(
        "Offer deleted successfully"
      );

      fetchOffers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete offer"
      );
    }
  };

  const handleToggle = async (id) => {
    try {
      await offerService.toggleStatus(id);

      toast.success(
        "Offer status updated"
      );

      fetchOffers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const handleTogglePopup = async (id) => {
    try {
      await offerService.togglePopup(id);

      toast.success(
        "Popup visibility updated"
      );

      fetchOffers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update popup"
      );
    }
  };

  return (
    <div className="admin-offers">

      <div className="admin-offers-header">
        <div>
          <h2>Course Offers</h2>

          <p>
            Manage promotional offers shown
            on the homepage.
          </p>
        </div>

        <button
          className="offer-add-btn"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Offer
        </button>
      </div>

      {showForm && (
        <div className="offer-form-card">

          <div className="offer-form-header">

            <h3>
              {editingId
                ? "Edit Offer"
                : "Create New Offer"}
            </h3>

            <button
              className="offer-close-btn"
              onClick={resetForm}
            >
              <X size={20} />
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="offer-form-grid">

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

              <div className="offer-field">
                <label>
                  Course
                </label>

                <select
                  value={form.courseName}
                  onChange={handleCourseChange}
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

              <div className="offer-field">
                <label>
                  Original Price
                </label>

                <input
                  type="number"
                  name="originalPrice"
                  value={form.originalPrice}
                  onChange={handleChange}
                  placeholder="20000"
                  min="0"
                  required
                />
              </div>

              <div className="offer-field">
                <label>
                  Offer Price
                </label>

                <input
                  type="number"
                  name="offerPrice"
                  value={form.offerPrice}
                  onChange={handleChange}
                  placeholder="9999"
                  min="0"
                  required
                />
              </div>

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

              <div className="offer-field full">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Learn modern web development..."
                  rows="4"
                />
              </div>

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
              </div>

              <div className="offer-field">
                <label>
                  Button Text
                </label>

                <input
                  type="text"
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                />
              </div>

              <div className="offer-field">
                <label>
                  Button Link
                </label>

                <input
                  type="text"
                  name="buttonLink"
                  value={form.buttonLink}
                  onChange={handleChange}
                />
              </div>

              <div className="offer-field">
                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="offer-field">
                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            <div className="offer-checkboxes">

              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />

                Active Offer
              </label>

              <label>
                <input
                  type="checkbox"
                  name="showPopup"
                  checked={form.showPopup}
                  onChange={handleChange}
                />

                Show on Homepage Popup
              </label>

            </div>

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

      <div className="offer-list">

        {loading ? (
          <div className="offer-empty">
            Loading offers...
          </div>
        ) : offers.length === 0 ? (
          <div className="offer-empty">
            <h3>
              No offers created yet
            </h3>

            <p>
              Click "Add Offer" to create
              your first course offer.
            </p>
          </div>
        ) : (
          offers.map((offer) => (
            <div
              className="offer-admin-card"
              key={offer._id}
            >

              <div className="offer-admin-image">

                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.courseName}
                  />
                ) : (
                  <div className="offer-no-image">
                    OFFER
                  </div>
                )}

                {offer.discountPercentage >
                  0 && (
                  <span className="offer-discount">
                    {offer.discountPercentage}% OFF
                  </span>
                )}

              </div>

              <div className="offer-admin-content">

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

                <p className="offer-admin-description">
                  {offer.description}
                </p>

                <div className="offer-prices">

                  <span className="original">
                    ₹
                    {Number(
                      offer.originalPrice
                    ).toLocaleString("en-IN")}
                  </span>

                  <span className="offer-price">
                    ₹
                    {Number(
                      offer.offerPrice
                    ).toLocaleString("en-IN")}
                  </span>

                </div>

                <div className="offer-admin-actions">

                  <button
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

                  <button
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

                  <button
                    onClick={() =>
                      handleEdit(offer)
                    }
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
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
          ))
        )}

      </div>

    </div>
  );
};

export default AdminOffers;