import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiEye,
  FiRefreshCw,
  FiSearch,
  FiFileText,
} from "react-icons/fi";
import noticeApi from "../../../services/noticeApi";

const Inactive = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchNotices = async (page = 1) => {
    try {
      setLoading(true);

      const response = await noticeApi.getInactive({
        search,
        page,
        per_page: 15,
      });

      if (response.data.success) {
        const result = response.data.data;

        setNotices(result.data || []);

        setPagination({
          current_page: result.current_page,
          last_page: result.last_page,
          total: result.total,
        });
      }
    } catch (error) {
      console.error("Error fetching inactive notices:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load inactive notices."
      );
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

    setTimeout(() => {
      fetchNotices(1);
    }, 0);
  };

  const handleRestore = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to restore this notice?"
    );

    if (!confirmed) return;

    try {
      const response = await noticeApi.restore(id);

      if (response.data.success) {
        alert(response.data.message);
        fetchNotices(pagination.current_page);
      }
    } catch (error) {
      console.error("Error restoring notice:", error);

      alert(
        error.response?.data?.message ||
          "Failed to restore notice."
      );
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

        <div className="flex items-center gap-3">

          <Link
            to="/communication/notices"
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-gray-600 transition hover:border-[#610e1e] hover:bg-[#610e1e] hover:text-white"
          >
            <FiArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-[#610e1e]">
              Inactive Notices
            </h1>

            <p className="text-sm text-gray-500">
              Manage deactivated notices
            </p>
          </div>

        </div>

        <Link
          to="/communication/notices"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d0b18]"
        >
          <FiFileText />
          Active Notices
        </Link>

      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >

          <div className="relative flex-1">

            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by notice no. or title..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#610e1e] focus:ring-1 focus:ring-[#610e1e]"
            />

          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#4d0b18]"
          >
            <FiSearch />
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <FiRefreshCw />
            Reset
          </button>

        </form>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-sm">

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
                    colSpan="7"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    Loading inactive notices...
                  </td>
                </tr>

              ) : notices.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No inactive notices found.
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

                    <td className="max-w-[300px] px-4 py-3">
                      <div className="truncate font-medium text-gray-800">
                        {notice.title}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {notice.notice_type}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {notice.priority}
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

                        <button
                          type="button"
                          onClick={() =>
                            handleRestore(notice.id)
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-green-200 px-3 py-2 text-xs font-medium text-green-600 transition hover:bg-green-50"
                          title="Restore"
                        >
                          <FiRefreshCw size={14} />
                          Restore
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

export default Inactive;