import {
    FaSave,
    FaEdit,
    FaLock,
    FaUnlock,
    FaTrash,
    FaUndo,
    FaSync,
} from "react-icons/fa";

export default function AttendanceActions({

    isEdit = false,

    isLocked = false,

    saving = false,

    onSave,

    onUpdate,

    onLock,

    onUnlock,

    onDeactivate,

    onReset,

}) {

    const disabled = saving;

    return (

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">

            <div className="flex flex-wrap gap-4 justify-end">

                {/* Save */}

                {!isEdit && (

                    <button
                        onClick={onSave}
                        disabled={disabled}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-green-600
                            hover:bg-green-700
                            disabled:bg-green-300
                            disabled:cursor-not-allowed
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            transition
                        "
                    >

                        {saving ? (
                            <FaSync className="animate-spin" />
                        ) : (
                            <FaSave />
                        )}

                        {saving ? "Saving..." : "Save Attendance"}

                    </button>

                )}

                {/* Update */}

                {isEdit && !isLocked && (

                    <button
                        onClick={onUpdate}
                        disabled={disabled}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-blue-600
                            hover:bg-blue-700
                            disabled:bg-blue-300
                            disabled:cursor-not-allowed
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            transition
                        "
                    >

                        {saving ? (
                            <FaSync className="animate-spin" />
                        ) : (
                            <FaEdit />
                        )}

                        {saving ? "Saving..." : "Update Attendance"}

                    </button>

                )}

                {/* Lock */}

                {isEdit && !isLocked && (

                    <button
                        onClick={onLock}
                        disabled={disabled}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-yellow-500
                            hover:bg-yellow-600
                            disabled:bg-yellow-300
                            disabled:cursor-not-allowed
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            transition
                        "
                    >

                        <FaLock />

                        Lock Attendance

                    </button>

                )}

                {/* Unlock */}

                {isEdit && isLocked && (

                    <button
                        onClick={onUnlock}
                        disabled={disabled}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-indigo-600
                            hover:bg-indigo-700
                            disabled:bg-indigo-300
                            disabled:cursor-not-allowed
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            transition
                        "
                    >

                        <FaUnlock />

                        Unlock Attendance

                    </button>

                )}

                {/* Deactivate */}

                {isEdit && (

                    <button
                        onClick={onDeactivate}
                        disabled={disabled}
                        className="
                            flex
                            items-center
                            gap-2
                            bg-red-600
                            hover:bg-red-700
                            disabled:bg-red-300
                            disabled:cursor-not-allowed
                            text-white
                            px-5
                            py-2.5
                            rounded-lg
                            transition
                        "
                    >

                        <FaTrash />

                        Deactivate

                    </button>

                )}

                {/* Reset */}

                <button
                    onClick={onReset}
                    disabled={disabled}
                    className="
                        flex
                        items-center
                        gap-2
                        bg-gray-600
                        hover:bg-gray-700
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                        text-white
                        px-5
                        py-2.5
                        rounded-lg
                        transition
                    "
                >

                    <FaUndo />

                    Reset

                </button>

            </div>

        </div>

    );

}