export const About = () => {
  const appcart = [
    {
      title: "Sản phẩm chính hãng 100%",
      textContent:
        "Chúng tôi làm việc trực tiếp với các thương hiệu mỹ phẩm uy tín để đảm bảo mọi sản phẩm đều là hàng chính hãng.",
      image: "/images/png/star.png",
      link: "#",
    },
    {
      title: "Tư vấn và mẹo làm đẹp từ chuyên gia",
      textContent:
        "Cung cấp thông tin cần thiết để bạn tự tin lựa chọn sản phẩm, với sự hỗ trợ từ bác sĩ da liễu, chuyên gia trang điểm và làm tóc.",
      image: "/images/png/comment.png",
      link: "#",
    },
    {
      title: "Đội ngũ chăm sóc khách hàng tận tâm",
      textContent:
        "Đội ngũ chuyên gia giàu kinh nghiệm của chúng tôi luôn sẵn sàng hỗ trợ bạn nhanh chóng và chuyên nghiệp.",
      image: "/images/png/suport.png",
      link: "#",
    },
  ];
  return (
    
    <div className="mx-auto h-auto">
      <div className="h-[100px]"></div>
      <div className="ml:p-6 swapper">
        <div className="text-center">
          <p className="text-4xl font-semibold text-gray-800">
          Chúng ta đều khác biệt
          </p>
          <p className="mt-4 text-1xl text-gray-600">
          Văn hóa, sắc tộc, giới tính, xu hướng – và sự khác biệt ấy mang đến sức mạnh và vẻ đẹp riêng.
          </p>
          <div className="mt-8 mx-auto w-full px-5 md:px-16">
            <iframe
              className="iframe_about"
              src="https://www.youtube.com/embed/Vc3EQZB6Cr0?si=P3QLBw1wDEeC69Ye"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
      <div className="w-full md:mt-28 mt-14 mb-10">
        <div className="text-center mb-10">
          <p className="text-4xl font-semibold text-gray-800">
          Chúng tôi là MesSkin
          </p>
          <p className="mt-4 text-1xl text-gray-600">
          Chúng tôi quan tâm đến làn da của bạn, vì bạn xứng đáng được chăm sóc đúng cách.
            <br />
            Mỗi sản phẩm đều được chọn lọc kỹ lưỡng và xác thực chất lượng.
          </p>
        </div>
        <div className="bg-gray-200 border-t-2 border-b-2 border-gray-400 w-full">
          <div className="p-5 swapper">
            <div className="mx-auto flex flex-col lg:flex-row items-center justify-center w-full gap-10">
              <div className="lg:w-1/2 md:pl-10">
                <p className="text-4xl font-semibold text-gray-800">
                Điểm khác biệt của MesSkin
                </p>
                <p className="mt-8 text-1xl text-gray-600">
                MesSkin được xây dựng với mục tiêu giúp bạn tiếp cận dễ dàng hơn các giải pháp chăm sóc da chuyên sâu và đáng tin cậy.
                </p>
                <p className="mt-8 text-1xl text-gray-600">
                Chúng tôi cung cấp sản phẩm từ thương hiệu spa cao cấp, mỹ phẩm thiên nhiên, chăm sóc tóc, trang điểm chuyên nghiệp và các nhãn hàng đặc biệt từ khắp nơi trên thế giới.
                </p>
              </div>
              <div className="lg:w-1/2 mt-6 lg:mt-0 md:pr-10">
                <img
                  src="/images/png/about.png"
                  className="w-full border max-h-96 border-gray-700"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:mt-28 mt-14 mb-10">
        <div className="ml:p-6 swapper">
          <div className="mt-8 mx-auto w-full px-5 md:px-16 gap-10 flex flex-col md:flex-row">
            {appcart.map((item) => (
              <div
                key={item}
                className="md:w-1/3 border border-gray-700 flex flex-col"
              >
                <img
                  src={item.image}
                  className="bg-white border-b border-gray-700"
                  alt=""
                />
                <div className="flex flex-col flex-grow p-2 bg-gray-200">
                  <div className="flex flex-col items-center justify-center flex-grow">
                    <p className="text-center text-2xl font-semibold text-gray-800">
                      {item.title}
                    </p>
                    <p className="mt-4 text-center text- text-gray-600">
                      {item.textContent}
                    </p>
                  </div>
                  <div className="scene mt-4 ">
                    <div className="cube">
                      <a href={item.link} className="side top">
                        SEE ALL BRANDS
                      </a>
                      <a href={item.link} className="side front">
                      Xem thêm
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
