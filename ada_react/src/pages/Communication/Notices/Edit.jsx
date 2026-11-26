import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiSave,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import noticeApi from "../../../services/noticeApi";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [existingAttachment, setExistingAttachment] = useState(null);

  const [formData, setFormData] = useState({
    notice_no: "",
    title: "",
    description: "",
    notice_type: "General",
    priority: "Normal",
    publish_date: "",
    expiry_date: "",
    target_type: "All",
    attachment: null,
  });

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      setLoading(true);

      const response = await noticeApi.getById(id);

      if (response.data.success) {
        const notice = response.data.data;

        setFormData({
          notice_no: notice.notice_no || "",
          title: notice.title || "",
          description: notice.description || "",
          notice_type: notice.notice_type || "General",
          priority: notice.priority || "Normal",
          publish_date: notice.publish_date
            ? notice.publish_date.substring(0, 10)
            : "",
          expiry_date: notice.expiry_date
            ? notice.expiry_date.substring(0, 10)
            : "",
          target_type: notice.target_type || "All",
          attachment: null,
        });

        setExistingAttachment(notice.attachment || null);
      }
    } catch (error) {
      console.error("Error fetching notice:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load notice."
      );

      navigate("/communication/notices");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      attachment: file,
    }));

    if (errors.attachment) {
      setErrors((prev) => ({
        ...prev,
        attachment: "",
      }));
    }
  };

  const removeNewAttachment = () => {
    setFormData((prev) => ({
      ...prev,
      attachment: null,
    }));

    const fileInput = document.getElementById("attachment");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const getAttachmentUrl = () => {
    if (!existingAttachment) return null;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "http://127.0.0.1:8000";

    return `${baseUrl.replace(/\/api\/?$/, "")}/storage/${existingAttachment}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setErrors({});

    try {
      const data = new FormData();

      data.append("notice_no", formData.notice_no);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("notice_type", formData.notice_type);
      data.append("priority", formData.priority);
      data.append("publish_date", formData.publish_date);
      data.append("target_type", formData.target_type);

      if (formData.expiry_date) {
        data.append("expiry_date", formData.expiry_date);
      }

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      const response = await noticeApi.update(id, data);

      if (response.data.success) {
        alert(
          response.data.message ||
            "Notice updated successfully."
        );

        navigate(`/communication/notices/${id}`);
      }
    } catch (error) {
      console.error("Error updating notice:", error);

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to update notice."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading notice...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">

        <Link
          to={`/communication/notices/${id}`}
          className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 transition hover:border-[#610e1e] hover:bg-[#610e1e] hover:text-white"
        >
          <FiArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#610e1e]">
            Edit Notice
          </h1>

          <p className="text-sm text-gray-500">
            Update notice information
          </p>
        </div>

      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-[#610e1e]">
              Notice Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the details of this notice.
            </p>
          </div>

          <div className="p-5">

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Notice No */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notice No.{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="notice_no"
                  value={formData.notice_no}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e] ${
                    errors.notice_no
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.notice_no && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.notice_no[0]}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notice Title{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e] ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.title[0]}
                  </p>
                )}
              </div>

              {/* Notice Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Notice Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="notice_type"
                  value={formData.notice_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
                >
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Priority{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* Publish Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Publish Date{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e] ${
                    errors.publish_date
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.publish_date && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.publish_date[0]}
                  </p>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  min={formData.publish_date}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e] ${
                    errors.expiry_date
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.expiry_date && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.expiry_date[0]}
                  </p>
                )}
              </div>

              {/* Target */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Target Audience{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="target_type"
                  value={formData.target_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
                >
                  <option value="All">All</option>
                  <option value="Students">Students</option>
                  <option value="Parents">Parents</option>
                  <option value="Teaching Staff">
                    Teaching Staff
                  </option>
                  <option value="Non-Teaching Staff">
                    Non-Teaching Staff
                  </option>
                </select>
              </div>

              {/* Attachment */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Attachment
                </label>

                {formData.attachment ? (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">

                    <div className="flex min-w-0 items-center gap-2">
                      <FiPaperclip className="shrink-0 text-[#610e1e]" />

                      <span className="truncate text-sm text-gray-700">
                        {formData.attachment.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={removeNewAttachment}
                      className="ml-2 rounded p-1 text-red-500 hover:bg-red-100"
                    >
                      <FiX />
                    </button>

                  </div>
                ) : (
                  <>
                    <input
                      id="attachment"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label
                      htmlFor="attachment"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition hover:border-[#610e1e] hover:bg-gray-50"
                    >
                      <FiPaperclip />
                      Choose New Attachment
                    </label>
                  </>
                )}

                {existingAttachment && !formData.attachment && (
                  <p className="mt-2 text-xs text-gray-500">
                    Existing attachment will be kept unless you upload
                    a new file.
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-400">
                  PDF, DOC, DOCX, JPG, JPEG or PNG. Maximum 10 MB.
                </p>

                {errors.attachment && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.attachment[0]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                  className={`w-full resize-y rounded-lg border px-3 py-3 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e] ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description[0]}
                  </p>
                )}

              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t bg-gray-50 px-5 py-4">

            <Link
              to={`/communication/notices/${id}`}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#610e1e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d0b18] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSave />

              {saving ? "Updating..." : "Update Notice"}
            </button>

          </div>

        </div>

      </form>
    </div>
  );
};

export default Edit;