
export const ImageModal = ({ imageSrc, closeModal }) => {
    if (!imageSrc) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-75">
            <div className="bg-white p-2">
                <span className="text-4xl float-right cursor-pointer p-4" onClick={closeModal}>×</span>
                <img
                    src={'http://localhost:8000/storage/' + imageSrc}
                    alt="Modal View"
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
};

