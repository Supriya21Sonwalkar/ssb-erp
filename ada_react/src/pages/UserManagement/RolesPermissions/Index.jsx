import { useEffect, useMemo, useState } from "react";
import {
  FaShieldAlt,
  FaSave,
  FaSyncAlt,
  FaCheckCircle,
  FaSearch,
  FaLayerGroup,
  FaList,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";

import api from "../../../services/api";

export default function RolesPermissionsIndex() {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [menus, setMenus] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);

  const [search, setSearch] = useState("");

  const [initialLoading, setInitialLoading] = useState(false);
  const [menusLoading, setMenusLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * Load roles and modules.
   */
  const loadInitialData = async () => {
    setInitialLoading(true);
    setError("");
    setMessage("");

    try {
      const [rolesResponse, modulesResponse] = await Promise.all([
        api.get("/user-management/role-menu-permissions/roles"),
        api.get("/user-management/role-menu-permissions/modules"),
      ]);

      const rolesData =
        rolesResponse.data?.data ?? rolesResponse.data ?? [];

      const modulesData =
        modulesResponse.data?.data ?? modulesResponse.data ?? [];

      setRoles(Array.isArray(rolesData) ? rolesData : []);
      setModules(Array.isArray(modulesData) ? modulesData : []);
    } catch (err) {
      console.error("Failed to load roles and modules:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load roles and modules. Please check the API."
      );
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  /*
   * Load menus for the selected role and module.
   */
  const loadModuleMenus = async (roleId, moduleId) => {
    if (!roleId || !moduleId) {
      setMenus([]);
      setSelectedMenuIds([]);
      return;
    }

    setMenusLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get(
        "/user-management/role-menu-permissions/menus",
        {
          params: {
            role_id: roleId,
            module_id: moduleId,
          },
        }
      );

      const responseData = response.data?.data ?? response.data;
      const menusData = Array.isArray(responseData) ? responseData : [];

      setMenus(menusData);

      const assignedIds = menusData
        .filter((menu) => {
          return (
            menu.has_access === true ||
            menu.has_access === 1 ||
            menu.has_access === "1"
          );
        })
        .map((menu) => Number(menu.id));

      setSelectedMenuIds(assignedIds);
    } catch (err) {
      console.error("Failed to load module menus:", err);

      setMenus([]);
      setSelectedMenuIds([]);

      setError(
        err.response?.data?.message ||
          "Unable to load menus for the selected role and module."
      );
    } finally {
      setMenusLoading(false);
    }
  };

  /*
   * Role selection.
   */
  const handleRoleChange = (event) => {
    const roleId = event.target.value;

    setSelectedRole(roleId);

    // Reset module-specific data when the role changes.
    setSelectedModule("");
    setMenus([]);
    setSelectedMenuIds([]);
    setSearch("");
    setError("");
    setMessage("");
  };

  /*
   * Module selection.
   */
  const handleModuleChange = async (event) => {
    const moduleId = event.target.value;

    setSelectedModule(moduleId);
    setMenus([]);
    setSelectedMenuIds([]);
    setSearch("");
    setError("");
    setMessage("");

    if (selectedRole && moduleId) {
      await loadModuleMenus(selectedRole, moduleId);
    }
  };

  /*
   * Filter menus by search.
   */
  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return menus;
    }

    return menus.filter((menu) => {
      return (
        String(menu.menu_name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(menu.menu_slug || "")
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [menus, search]);

  /*
   * Toggle one menu.
   */
  const toggleMenu = (menuId) => {
    const id = Number(menuId);

    setSelectedMenuIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });

    setMessage("");
    setError("");
  };

  /*
   * Select all menus in the current module.
   */
  const selectAll = () => {
    setSelectedMenuIds(menus.map((menu) => Number(menu.id)));
    setMessage("");
    setError("");
  };

  /*
   * Clear all menus in the current module.
   */
  const clearAll = () => {
    setSelectedMenuIds([]);
    setMessage("");
    setError("");
  };

  /*
   * Save permissions for the selected role and module.
   */
  const savePermissions = async () => {
    if (!selectedRole) {
      setError("Please select a role.");
      return;
    }

    if (!selectedModule) {
      setError("Please select a module.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        "/user-management/role-menu-permissions/save",
        {
          role_id: Number(selectedRole),
          module_id: Number(selectedModule),
          menu_ids: selectedMenuIds,
        }
      );

      setMessage(
        response.data?.message || "Permissions saved successfully."
      );
    } catch (err) {
      console.error("Failed to save menu permissions:", err);

      const validationErrors = err.response?.data?.errors;

      if (validationErrors) {
        const firstErrorKey = Object.keys(validationErrors)[0];
        const firstError = validationErrors[firstErrorKey];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : "Please check the submitted permission data."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to save permissions. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
   * Refresh role/module lists and reload the current selection.
   */
  const handleRefresh = async () => {
    await loadInitialData();

    if (selectedRole && selectedModule) {
      await loadModuleMenus(selectedRole, selectedModule);
    }
  };

  /*
   * Check whether all menus are selected.
   */
  const allSelected =
    menus.length > 0 &&
    menus.every((menu) =>
      selectedMenuIds.includes(Number(menu.id))
    );

  /*
   * Calculate menu indentation based on parent_id.
   */
  const getMenuDepth = (menu) => {
    let depth = 0;
    let parentId = menu.parent_id;
    const visited = new Set();

    while (parentId !== null && parentId !== undefined) {
      if (visited.has(Number(parentId))) {
        break;
      }

      visited.add(Number(parentId));

      const parent = menus.find(
        (item) => Number(item.id) === Number(parentId)
      );

      if (!parent) {
        break;
      }

      depth++;
      parentId = parent.parent_id;
    }

    return depth;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <p className="mb-2 text-sm text-gray-500">
          User Management / Roles & Permissions
        </p>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963]">
              <FaShieldAlt size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#610e1e] md:text-3xl">
                Roles & Permissions
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Manage module and sidebar subtab access for each role.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={initialLoading || menusLoading || saving}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          <FaCheckCircle className="shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Role and module selection */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Permission Configuration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a role and module to configure its sidebar subtabs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Role dropdown */}
          <div>
            <label
              htmlFor="permission-role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Role <span className="text-red-500">*</span>
            </label>

            <select
              id="permission-role"
              value={selectedRole}
              onChange={handleRoleChange}
              disabled={initialLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10 disabled:bg-gray-100"
            >
              <option value="">Select a role</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Module dropdown */}
          <div>
            <label
              htmlFor="permission-module"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Module <span className="text-red-500">*</span>
            </label>

            <select
              id="permission-module"
              value={selectedModule}
              onChange={handleModuleChange}
              disabled={!selectedRole || initialLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">Select a module</option>

              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.module_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Subtab permissions */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <FaList className="text-[#610e1e]" />

              <h2 className="text-lg font-semibold text-gray-800">
                Subtab Permissions
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {selectedRole && selectedModule
                ? `${selectedMenuIds.length} of ${menus.length} menu(s) selected`
                : "Select a role and module to view available subtabs."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAll}
              disabled={
                !selectedModule ||
                menusLoading ||
                menus.length === 0 ||
                allSelected
              }
              className="flex items-center gap-2 rounded-lg border border-[#610e1e] px-4 py-2 text-sm font-semibold text-[#610e1e] transition hover:bg-[#610e1e]/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCheckSquare />
              Select All
            </button>

            <button
              type="button"
              onClick={clearAll}
              disabled={
                !selectedModule ||
                menusLoading ||
                selectedMenuIds.length === 0
              }
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSquare />
              Clear All
            </button>
          </div>
        </div>

        {/* Search */}
        {selectedRole && selectedModule && !menusLoading && menus.length > 0 && (
          <div className="border-b border-gray-100 p-5">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subtabs..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-[#610e1e] focus:ring-2 focus:ring-[#610e1e]/10"
              />
            </div>
          </div>
        )}

        {/* Loading */}
        {initialLoading || menusLoading ? (
          <div className="px-5 py-16 text-center text-gray-500">
            Loading permissions...
          </div>
        ) : !selectedRole ? (
          <div className="px-5 py-16 text-center">
            <FaShieldAlt className="mx-auto mb-3 text-3xl text-gray-300" />

            <p className="font-medium text-gray-700">
              Select a role to continue.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              You can then select a module and configure its subtabs.
            </p>
          </div>
        ) : !selectedModule ? (
          <div className="px-5 py-16 text-center">
            <FaLayerGroup className="mx-auto mb-3 text-3xl text-gray-300" />

            <p className="font-medium text-gray-700">
              Select a module.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Available subtabs will appear here.
            </p>
          </div>
        ) : menus.length === 0 ? (
          <div className="px-5 py-16 text-center text-gray-500">
            No active menus were found for this module.
          </div>
        ) : filteredMenus.length === 0 ? (
          <div className="px-5 py-16 text-center text-gray-500">
            No subtabs match your search.
          </div>
        ) : (
          <div className="p-5">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[500px] border-collapse text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Subtab Name
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                      Route
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                      Access
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMenus.map((menu) => {
                    const checked = selectedMenuIds.includes(
                      Number(menu.id)
                    );

                    const depth = getMenuDepth(menu);

                    return (
                      <tr
                        key={menu.id}
                        className={`border-t border-gray-100 transition ${
                          checked ? "bg-[#610e1e]/[0.03]" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div
                            className="flex items-center gap-3"
                            style={{
                              paddingLeft: `${depth * 24}px`,
                            }}
                          >
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                checked ? "bg-[#610e1e]" : "bg-gray-300"
                              }`}
                            />

                            <div>
                              <p className="font-medium text-gray-800">
                                {menu.menu_name}
                              </p>

                              {menu.parent_id !== null &&
                                menu.parent_id !== undefined && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Submenu
                                  </p>
                                )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center text-sm text-gray-500">
                          {menu.route || "—"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <label className="inline-flex cursor-pointer items-center justify-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMenu(menu.id)}
                              className="h-4 w-4 cursor-pointer accent-[#610e1e]"
                              aria-label={`Allow access to ${menu.menu_name}`}
                            />

                            <span
                              className={`text-sm font-medium ${
                                checked ? "text-green-700" : "text-gray-500"
                              }`}
                            >
                              {checked ? "Allowed" : "Denied"}
                            </span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex flex-col justify-between gap-3 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-500">
            Changes apply to the selected role and module.
          </p>

          <button
            type="button"
            onClick={savePermissions}
            disabled={
              !selectedRole ||
              !selectedModule ||
              saving ||
              menusLoading ||
              initialLoading
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#610e1e] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4b0a16] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaSave />
            {saving ? "Saving..." : "Save Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
}