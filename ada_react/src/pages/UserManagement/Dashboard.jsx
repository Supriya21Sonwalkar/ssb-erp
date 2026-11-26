import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserShield,
  FaArrowRight,
  FaUserCog,
} from "react-icons/fa";

export default function UserManagementDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Users",
      description:
        "Manage user accounts, view user details, and maintain user information.",
      icon: FaUsers,
      path: "/user-management/users",
    },
    {
      title: "Roles & Permissions",
      description:
        "Manage application roles and configure permissions for each role.",
      icon: FaUserShield,
      path: "/user-management/roles-permissions",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#610e1e] text-[#FFD963] shadow-sm">
            <FaUserCog size={23} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Administration / User Management
            </p>

            <h1 className="text-2xl font-bold text-[#610e1e] md:text-3xl">
              User Management Dashboard
            </h1>
          </div>
        </div>

        <p className="mt-4 text-gray-600">
          Manage users, roles, and permissions from one place.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome to User Management
        </h2>

        <p className="mt-2 leading-7 text-gray-600">
          Use this module to manage application users and control their access
          to different features of the school ERP system.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {modules.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate(item.path)}
              className="group rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#610e1e]/30 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#610e1e]/10 text-[#610e1e] transition group-hover:bg-[#610e1e] group-hover:text-[#FFD963]">
                  <Icon size={26} />
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Available
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-800">
                {item.title}
              </h2>

              <p className="mt-3 min-h-[48px] text-sm leading-6 text-gray-500">
                {item.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-semibold text-[#610e1e]">
                  Open {item.title}
                </span>

                <FaArrowRight className="text-[#610e1e] transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}