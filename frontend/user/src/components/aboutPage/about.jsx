export const About = () => {
  const appcart = [
    {
      title: "Authentic Beauty Products, Guaranteed",
      textContent:
        "We work closely with your favorite beauty brands as an authorized retailer to make sure all the products we ship are guaranteed authentic.",
      image: "/images/png/star.png",
      link: "#",
    },
    {
      title: "Expert Tips and Advice",
      textContent:
        "We give you all the information you need to make intelligent shopping decisions for yourself. We work with top dermatologists, estheticians, hairstylists and makeup artistst.",
      image: "/images/png/comment.png",
      link: "#",
    },
    {
      title: "Award-Winning Customer Service Team",
      textContent:
        "Winner of the Bizrate Platinum Circle of Excellence Award for over ten years, our team of highly trained beauty experts are ready to help.",
      image: "/images/png/suport.png",
      link: "#",
    },
  ];
  return (
    <div className="mx-auto h-auto">
      <div className="ml:p-6 swapper">
        <div className="text-center">
          <p className="text-4xl font-semibold text-gray-800">
            Let's face it-we're all different,
          </p>
          <p className="mt-4 text-1xl text-gray-600">
            our cultures, ethnicities, genders, sexualities. And there's
            vitality and power in those differences.
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
            We're Dermstore
          </p>
          <p className="mt-4 text-1xl text-gray-600">
            We care about what goes on your skin, because of what's within.
            <br />
            Our assortment is top-rated, curated & authenticated.
          </p>
        </div>
        <div className="bg-gray-200 border-t-2 border-b-2 border-gray-400 w-full">
          <div className="p-5 swapper">
            <div className="mx-auto flex flex-col lg:flex-row items-center justify-center w-full gap-10">
              <div className="lg:w-1/2 md:pl-10">
                <p className="text-4xl font-semibold text-gray-800">
                  The Dermstore Difference
                </p>
                <p className="mt-8 text-1xl text-gray-600">
                  Dermstore was created in 1999 by a dermatologist who wanted to
                  better serve his patients with easier access to the treatments
                  their skin needed.
                </p>
                <p className="mt-8 text-1xl text-gray-600">
                  We offer professional-strength formulas from top skin care
                  brands (otherwise only available at a dermatologist's office),
                  hard-to-find spa care and natural beauty brands, professional
                  hair care and makeup products, and specialty brands from
                  around the world.
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
                        Read More
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
