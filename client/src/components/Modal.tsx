import React from "react";

type ModalProps = {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold text-center">{message}</h3>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
