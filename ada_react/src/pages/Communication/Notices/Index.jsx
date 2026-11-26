import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiArchive,
  FiRefreshCw,
  FiFileText,
} from "react-icons/fi";
import noticeApi from "../../../services/noticeApi";

const Index = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [noticeType, setNoticeType] = useState("");
  const [priority, setPriority] = useState("");
  const [targetType, setTargetType] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchNotices = async (page = 1) => {
    try {
      setLoading(true);

      const response = await noticeApi.getAll({
        search,
        notice_type: noticeType,
        priority,
        target_type: targetType,
        page,
        per_page: 15,
      });

      const result = response.data;

      if (result.success) {
        setNotices(result.data.data || []);

        setPagination({
          current_page: result.data.current_page,
          last_page: result.data.last_page,
          total: result.data.total,
        });
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotices(1);
  };

  const handleReset = () => {
    setSearch("");
    setNoticeType("");
    setPriority("");
    setTargetType("");

    setTimeout(() => {
      fetchNotices(1);
    }, 0);
  };

  const handleDeactivate = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this notice?"
    );

    if (!confirmed) return;

    try {
      const response = await noticeApi.delete(id);

      if (response.data.success) {
        alert(response.data.message);
        fetchNotices(pagination.current_page);
      }
    } catch (error) {
      console.error("Error deactivating notice:", error);

      alert(
        error.response?.data?.message ||
          "Failed to deactivate notice."
      );
    }
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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#610e1e] p-3 text-white">
              <FiFileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#610e1e]">
                Notices
              </h1>

              <p className="text-sm text-gray-500">
                Manage school notices and announcements
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">

          <Link
            to="/communication/notices/inactive"
            className="inline-flex items-center gap-2 rounded-lg border border-[#610e1e] px-4 py-2.5 text-sm font-medium text-[#610e1e] transition hover:bg-[#610e1e] hover:text-white"
          >
            <FiArchive />
            Inactive
          </Link>

          <Link
            to="/communication/notices/create"
            className="inline-flex items-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-medium text-white shadow transition hover:bg-[#4d0b18]"
          >
            <FiPlus />
            Create Notice
          </Link>

        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5"
        >

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>

            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Notice No. or title..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
              />
            </div>
          </div>

          {/* Notice Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notice Type
            </label>

            <select
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
            >
              <option value="">All Types</option>
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
              <option value="Holiday">Holiday</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
            >
              <option value="">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Important">Important</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Target */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Target
            </label>

            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
            >
              <option value="">All</option>
              <option value="All">All</option>
              <option value="Students">Students</option>
              <option value="Parents">Parents</option>
              <option value="Teaching Staff">Teaching Staff</option>
              <option value="Non-Teaching Staff">
                Non-Teaching Staff
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d0b18]"
            >
              <FiSearch />
              Search
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2.5 text-gray-600 transition hover:bg-gray-100"
              title="Reset"
            >
              <FiRefreshCw />
            </button>

          </div>

        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-sm">

            <thead>
              <tr className="bg-[#610e1e] text-left text-white">

                <th className="px-4 py-3 font-semibold">
                  #
                </th>

                <th className="px-4 py-3 font-semibold">
                  Notice No.
                </th>

                <th className="px-4 py-3 font-semibold">
                  Title
                </th>

                <th className="px-4 py-3 font-semibold">
                  Type
                </th>

                <th className="px-4 py-3 font-semibold">
                  Priority
                </th>

                <th className="px-4 py-3 font-semibold">
                  Target
                </th>

                <th className="px-4 py-3 font-semibold">
                  Publish Date
                </th>

                <th className="px-4 py-3 text-center font-semibold">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (

                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Loading notices...
                  </td>
                </tr>

              ) : notices.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No notices found.
                  </td>
                </tr>

              ) : (

                notices.map((notice, index) => (

                  <tr
                    key={notice.id}
                    className="transition hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 text-gray-600">
                      {(pagination.current_page - 1) * 15 +
                        index +
                        1}
                    </td>

                    <td className="px-4 py-3 font-medium text-[#610e1e]">
                      {notice.notice_no}
                    </td>

                    <td className="max-w-[280px] px-4 py-3">
                      <div className="truncate font-medium text-gray-800">
                        {notice.title}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {notice.notice_type}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          notice.priority
                        )}`}
                      >
                        {notice.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {notice.target_type}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(notice.publish_date)}
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex justify-center gap-2">

                        <Link
                          to={`/communication/notices/${notice.id}`}
                          className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#610e1e]"
                          title="View"
                        >
                          <FiEye size={16} />
                        </Link>

                        <Link
                          to={`/communication/notices/${notice.id}/edit`}
                          className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeactivate(notice.id)
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                          title="Deactivate"
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}
        {!loading && notices.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-4">

            <p className="text-sm text-gray-500">
              Total:{" "}
              <span className="font-medium text-gray-700">
                {pagination.total}
              </span>
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={pagination.current_page === 1}
                onClick={() =>
                  fetchNotices(
                    pagination.current_page - 1
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-lg bg-[#610e1e] px-3 py-2 text-sm text-white">
                {pagination.current_page} /{" "}
                {pagination.last_page}
              </span>

              <button
                type="button"
                disabled={
                  pagination.current_page ===
                  pagination.last_page
                }
                onClick={() =>
                  fetchNotices(
                    pagination.current_page + 1
                  )
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Index;