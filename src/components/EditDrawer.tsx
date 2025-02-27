import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

interface EditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
    onUpdate: (updatedData: any) => void; // Callback for saving updated data
}

const EditDrawer: React.FC<EditDrawerProps> = ({ isOpen, onClose, rowData, onUpdate }) => {
    const [formData, setFormData] = useState(rowData || {}); // Store editable data

    // Update state when rowData changes
    useEffect(() => {
        if (rowData) {
            setFormData(rowData);
        }
    }, [rowData]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => (prev ? { ...prev, [name]: value } : { [name]: value }));
    };

    // Handle save button click
    const handleSave = () => {
        onUpdate(formData); // Pass updated data back to parent
        onClose(); // Close the drawer
    };

    if (!rowData) return null; // Prevent rendering if no rowData

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30" aria-hidden="true" />
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Dialog.Panel className="w-full max-w-[90vw] overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <Dialog.Title className="text-lg font-medium mb-4">Edit Transaction</Dialog.Title>
                        <div className="space-y-3">
                            {Object.keys(formData).map((key) => (
                                <div key={key} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="border p-2 rounded-md text-black"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default EditDrawer;
