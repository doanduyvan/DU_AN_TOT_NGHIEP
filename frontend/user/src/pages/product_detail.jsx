import React, { useState } from 'react';

export const ProductDetail = () => {
    const [weight, setWeight] = useState(null);
    const [activeTab, setActiveTab] = useState("review");
    const handleWeightClick = (value) => {
        setWeight(value);
    };

    const reviews = [
        {
            id: 1,
            name: "Jakir Hussen",
            comment: "Great product, I love this Coffee Beans",
            rating: 3.5,
            image: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            id: 2,
            name: "Jubed Ahmed",
            comment: "Awesome Coffee, I love this Coffee Beans",
            rating: 3.5,
            image: "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            id: 3,
            name: "Delwar Hussain",
            comment: "Great product, I like this Coffee Beans",
            rating: 3.5,
            image: "https://randomuser.me/api/portraits/men/3.jpg",
        },
    ];
    return (
        <div className="swapper p-3">
            <div className="mx-auto flex flex-col md:flex-row md:gap-8 gap-4">
                <div className="md:w-1/2 w-full">
                    <img
                        src="../src/assets/images/png/product_detail.png"
                        className="w-full h-auto"
                        alt="Product"
                    />
                </div>

                <div className="md:w-1/2 w-full bg-white p-5 flex flex-col justify-between">
                    <p className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                    Soy pH-Balanced Hydrating Face Wash Jumbo
                    </p>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="my-auto"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                >
                                    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                                </svg>
                                <p className="font-medium text-lg">(3.5) 1100 reviews</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-2xl font-medium">Size/Weight</p>
                                <select
                                    name="size"
                                    className="border w-full md:w-1/2 rounded-lg p-2 cursor-pointer border-black"
                                >
                                    <option value="100ml">100ml</option>
                                    <option value="200ml">200ml</option>
                                    <option value="300ml">300ml</option>
                                    <option value="400ml">400ml</option>
                                </select>
                                <div className="flex gap-3">
                                    {['small', 'medium', 'large'].map((size) => (
                                        <a
                                            key={size}
                                            className={`bg-yellow-100 p-2 px-5 rounded-md hover:bg-yellow-200 cursor-pointer ${weight === size ? 'bg-yellow-200' : ''
                                                }`}
                                            onClick={() => handleWeightClick(size)}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <svg
                                    width="20"
                                    height="20"
                                    className="my-auto"
                                    viewBox="0 0 19 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M12.7161 14.2236H5.49609"
                                        stroke="#141313"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12.7161 10.0371H5.49609"
                                        stroke="#141313"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M8.25207 5.86035H5.49707"
                                        stroke="#141313"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12.909 0.75C12.909 0.75 5.23198 0.754 5.21998 0.754C2.45998 0.771 0.750977 2.587 0.750977 5.357V14.553C0.750977 17.337 2.47298 19.16 5.25698 19.16C5.25698 19.16 12.933 19.157 12.946 19.157C15.706 19.14 17.416 17.323 17.416 14.553V5.357C17.416 2.573 15.693 0.75 12.909 0.75Z"
                                        stroke="#141313"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <p className="font-medium text-lg">Compare</p>
                            </div>

                            <div className="flex gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="mt-1.5"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                >
                                    <path d="M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z"></path>
                                </svg>
                                <div className="flex flex-col gap-1">
                                    <p className="font-medium text-lg">Delivery</p>
                                    <p className="font-normal text-sm md:text-base">
                                        From $6 for 1-3 days
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" className='mt-1.5' fill="currentColor"><path d="M12.0002 2C15.8662 2 19.0002 5.13401 19.0002 9H20.0742C20.5967 9 21.0311 9.40231 21.0712 9.9233L21.9174 20.9233C21.9597 21.474 21.5477 21.9547 20.997 21.9971L20.9203 22H3.08008C2.52779 22 2.08008 21.5523 2.08008 21L2.08302 20.9233L2.92918 9.9233C2.96925 9.40231 3.4037 9 3.92623 9H5.0002C5.0002 5.13401 8.13421 2 12.0002 2ZM19.1472 11H4.8522L4.1592 20H19.8402L19.1472 11ZM14.0002 13V15H10.0002V13H14.0002ZM12.0002 4C9.31145 4 7.11838 6.12231 7.00482 8.78311L7.0002 9H17.0002C17.0002 6.31124 14.8779 4.11818 12.2171 4.00462L12.0002 4Z"></path></svg>
                                <div className="flex flex-col gap-1">
                                    <p className="font-medium text-lg">Delivery</p>
                                    <p className="font-normal text-sm md:text-base">
                                        From $6 for 1-3 days
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mt-8 w-full flex justify-between">
                        <div className="hidden lg:block lg:w-1/2"></div>
                        <div className="w-full lg:w-1/2 rounded-lg p-5 border border-black flex flex-col gap-4">
                            <p className="text-lg font-medium">19.000 đ</p>
                            <p className="text-2xl font-medium">19.000 đ</p>
                            <button className="bg-yellow-300 p-2 rounded-lg hover:bg-yellow-400 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6 bg-[#fdf8f2]">
                <div className="flex space-x-6 border-b pb-2">
                    {["description", "features", "review", "similar"].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-2 text-lg font-medium capitalize ${activeTab === tab
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-500"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "review" ? `Review (1100)` : tab}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {activeTab === "description" && (
                        <p className="text-gray-700">
                            This is a high-quality coffee bean product sourced from the best farms.
                        </p>
                    )}

                    {activeTab === "features" && (
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>100% Organic Arabica Beans</li>
                            <li>Rich Flavor & Aroma</li>
                            <li>Sourced from Premium Farms</li>
                            <li>Available in Multiple Roasts</li>
                        </ul>
                    )}

                    {activeTab === "review" && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">What our customers are saying</h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-white shadow-lg rounded-xl p-4 w-full md:w-1/3 flex flex-col items-center"
                                    >
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className="w-16 h-16 rounded-full mb-3"
                                        />
                                        <h3 className="font-semibold text-lg">{review.name}</h3>
                                        <p className="text-sm text-gray-600 text-center">{review.comment}</p>
                                        <div className="flex items-center mt-3">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <svg
                                                    key={index}
                                                    className={`h-5 w-5 ${index < Math.floor(review.rating)
                                                            ? "text-black"
                                                            : index < review.rating
                                                                ? "text-gray-500"
                                                                : "text-gray-300"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M10 1l2.5 6.5H19l-5 5 1.5 6.5-6-4-6 4L6 12.5 1 7.5h6.5z" />
                                                </svg>
                                            ))}
                                            <span className="ml-2 text-gray-700 text-sm">
                                                ({review.rating}) Review
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "similar" && (
                        <p className="text-gray-700">Similar products will be displayed here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};