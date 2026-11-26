import { useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeApi from "../../services/employeeApi";

export default function Search() {
    const navigate = useNavigate();

    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!/^\d{12}$/.test(aadhaarNumber)) {
            setError("Aadhaar Number must be exactly 12 digits.");
            return;
        }

        try {
            setLoading(true);

            const { data } = await employeeApi.checkAadhaar({
                aadhaar_number: aadhaarNumber,
            });

            if (data.exists) {
                navigate(`/configuration/employees/${data.employee.id}`);
            } else {
                navigate("/configuration/employees/create", { 
                    state: {
                        aadhaarNumber,
                    },
                });
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-20">

            <div className="bg-white shadow-lg rounded-xl">

                <div className="border-b px-6 py-4">
                    <h2 className="text-2xl font-bold text-[#610e1e]">
                        Add Employee
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Search Aadhaar Number before creating a new employee.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                >

                    <div>

                        <label className="block font-semibold mb-2">
                            Aadhaar Number
                        </label>

                        <input
                            type="text"
                            value={aadhaarNumber}
                            onChange={(e) =>
                                setAadhaarNumber(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            maxLength={12}
                            placeholder="Enter 12-digit Aadhaar Number"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#610e1e]"
                        />

                        {error && (
                            <p className="text-red-600 text-sm mt-2">
                                {error}
                            </p>
                        )}

                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/employees")}
                            className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-lg bg-[#610e1e] text-white hover:bg-[#7d1328]"
                        >
                            {loading
                                ? "Checking..."
                                : "Continue"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}