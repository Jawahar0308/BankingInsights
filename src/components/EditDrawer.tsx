import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil } from "lucide-react"; // For the edit icon

interface EditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
    onUpdate: (updatedData: any) => void;
}

const EditDrawer: React.FC<EditDrawerProps> = ({ isOpen, onClose, rowData, onUpdate }) => {
    const [formData, setFormData] = useState(rowData || {});

    useEffect(() => {
        if (rowData) {
            setFormData(rowData);
        }
    }, [rowData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => (prev ? { ...prev, [name]: value } : { [name]: value }));
    };

    const handleSave = () => {
        onUpdate(formData);
        onClose();
    };

    if (!rowData) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 flex justify-end">
            <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true" />

            <div className="fixed top-16 right-0 w-[420px] sm:w-[450px] bg-white shadow-2xl rounded-l-xl flex flex-col max-h-[calc(100vh-60px)]">

                {/* 🔹 Stylish Header */}
                <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white border-b shadow-md flex items-center justify-center rounded-t-lg">
                    <Pencil className="w-5 h-5 mr-2 text-white" />
                    <Dialog.Title className="text-lg font-semibold tracking-wide">
                        Edit Transaction
                    </Dialog.Title>
                </div>

                {/* 🔹 Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {Object.keys(formData)
                        .filter((key) => !key.includes("child"))
                        .map((key) => (
                            <div key={key} className="flex items-center gap-4">
                                <label className="text-xs sm:text-sm font-semibold text-gray-700 uppercase w-1/3 text-left pr-2">
                                    {key}
                                </label>
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-lg p-2 w-[65%] bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 shadow-sm transition-all"
                                />
                            </div>
                        ))}
                </div>

                {/* 🔹 Fixed Footer */}
                <div className="p-4 border-t bg-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-700 bg-gray-300 hover:bg-gray-400 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default EditDrawer;
