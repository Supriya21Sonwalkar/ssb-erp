import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

export default function ViewRole() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get(`/user-management/roles/${id}`);
        setRole(response.data.data);
      } catch (error) {
        console.error("Error fetching role:", error);
        alert(error.response?.data?.message || "Unable to load role.");
        navigate("/user-management/roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-6">Loading role...</div>;
  }

  if (!role) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate("/user-management/roles")}
        className="mb-4 text-sm font-medium text-gray-600 hover:text-[#610e1e]"
      >
        ← Back to User Roles
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#610e1e] p-6 text-white">
          <div>
            <h1 className="text-2xl font-bold">{role.name}</h1>
            <p className="mt-1 text-sm text-white/80">Role Details</p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              Number(role.status) === 1
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {Number(role.status) === 1 ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Role Name</p>
            <p className="mt-1 font-semibold text-gray-800">{role.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Guard Name</p>
            <p className="mt-1 font-semibold text-gray-800">
              {role.guard_name || "—"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p className="mt-1 text-gray-800">
              {role.description || "No description provided."}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="mb-3 text-sm text-gray-500">Assigned Permissions</p>

            {role.permissions?.length ? (
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="rounded-full bg-yellow-100 px-3 py-1.5 text-sm font-medium text-[#610e1e]"
                  >
                    {permission.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No permissions assigned to this role.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 p-5">
          <button
            type="button"
            onClick={() =>
              navigate(`/user-management/roles/${role.id}/edit`)
            }
            className="rounded-lg bg-[#610e1e] px-5 py-2.5 font-medium text-white hover:bg-[#4b0b17]"
          >
            Edit Role
          </button>
        </div>
      </div>
    </div>
  );
}