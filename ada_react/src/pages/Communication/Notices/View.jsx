import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit,
  FiFileText,
  FiDownload,
} from "react-icons/fi";
import noticeApi from "../../../services/noticeApi";

const View = () => {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      setLoading(true);

      const response = await noticeApi.getById(id);

      if (response.data.success) {
        setNotice(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notice:", error);
      alert(
        error.response?.data?.message ||
          "Failed to load notice."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700";

      case "Important":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getAttachmentUrl = () => {
    if (!notice?.attachment) return null;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "http://127.0.0.1:8000";

    return `${baseUrl}/storage/${notice.attachment}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading notice...</p>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">Notice not found.</p>

          <Link
            to="/communication/notices"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2 text-sm text-white"
          >
            <FiArrowLeft />
            Back to Notices
          </Link>
        </div>
      </div>
    );
  }

  const attachmentUrl = getAttachmentUrl();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <Link
            to="/communication/notices"
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 transition hover:border-[#610e1e] hover:bg-[#610e1e] hover:text-white"
          >
            <FiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-[#610e1e]">
              Notice Details
            </h1>

            <p className="text-sm text-gray-500">
              View notice information
            </p>
          </div>

        </div>

        <Link
          to={`/communication/notices/${notice.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d0b18]"
        >
          <FiEdit />
          Edit Notice
        </Link>

      </div>

      {/* Notice */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        {/* Notice Header */}
        <div className="border-b bg-[#610e1e] px-5 py-6 text-white">

          <div className="mb-3 flex flex-wrap items-center gap-2">

            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {notice.notice_no}
            </span>

            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              {notice.notice_type}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                notice.priority
              )}`}
            >
              {notice.priority}
            </span>

          </div>

          <h2 className="text-2xl font-bold">
            {notice.title}
          </h2>

        </div>

        {/* Details */}
        <div className="p-5">

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-400">
                Publish Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {formatDate(notice.publish_date)}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-400">
                Expiry Date
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {formatDate(notice.expiry_date)}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-400">
                Target Audience
              </p>

              <p className="mt-1 font-semibold text-gray-800">
                {notice.target_type}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-gray-400">
                Status
              </p>

              <p className="mt-1 font-semibold text-green-600">
                {notice.is_active ? "Active" : "Inactive"}
              </p>
            </div>

          </div>

          {/* Description */}
          <div className="mt-6">

            <h3 className="mb-3 text-sm font-semibold uppercase text-[#610e1e]">
              Description
            </h3>

            <div className="rounded-lg border border-gray-200 bg-white p-5">

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {notice.description}
              </p>

            </div>

          </div>

          {/* Attachment */}
          {notice.attachment && (
            <div className="mt-6">

              <h3 className="mb-3 text-sm font-semibold uppercase text-[#610e1e]">
                Attachment
              </h3>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-[#610e1e] p-2 text-white">
                    <FiFileText />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Notice Attachment
                    </p>

                    <p className="text-xs text-gray-500">
                      Attached document
                    </p>
                  </div>

                </div>

                {attachmentUrl && (
                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#610e1e] px-3 py-2 text-sm font-medium text-[#610e1e] transition hover:bg-[#610e1e] hover:text-white"
                  >
                    <FiDownload />
                    View / Download
                  </a>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default View;