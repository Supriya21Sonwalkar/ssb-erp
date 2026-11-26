export default function LectureAttendanceActions({
    onSave,
    onReset,
    loading = false,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex flex-col sm:flex-row justify-end gap-3">

                {/* Reset */}
                <button
                    type="button"
                    onClick={onReset}
                    disabled={loading}
                    className="
                        px-6
                        py-2.5
                        rounded-lg
                        border
                        border-gray-300
                        text-gray-700
                        font-semibold
                        hover:bg-gray-100
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    Reset
                </button>


                {/* Save */}
                <button
                    type="button"
                    onClick={onSave}
                    disabled={loading}
                    className="
                        px-6
                        py-2.5
                        rounded-lg
                        bg-[#610e1e]
                        hover:bg-[#4b0b18]
                        text-white
                        font-semibold
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    {loading ? "Saving..." : "Save Attendance"}
                </button>

            </div>

        </div>
    );
}