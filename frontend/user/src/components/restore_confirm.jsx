import React, { useState } from 'react';

const RestoreConfirmationModal = ({ data, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        onDelete();
        setIsOpen(false);
    };

    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#333'
        },
        description: {
            marginBottom: '20px',
            color: '#666'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        },
        deleteButton: {
            backgroundColor: '#22C55E',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        cancelButton: {
            backgroundColor: '#f3f4f6',
            color: '#333',
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className="block bg-green-500 rounded px-4 text-xs font-medium uppercase leading-normal text-white hover:text-green-600 w-auto mr-2"
            >
                Khôi phục
            </button>

            {isOpen && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.modal}>
                        <div style={modalStyles.title}>Xác nhận khôi phục</div>
                        <div style={modalStyles.description}>
                            {data}
                        </div>
                        <div style={modalStyles.buttonContainer}>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={modalStyles.cancelButton}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                style={modalStyles.deleteButton}
                            >
                                Khôi phục
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RestoreConfirmationModal;