import { Carousel, Spin } from 'antd';
import { useState, useEffect } from 'react';
import AxiosUser from '/src/utils/axios_user';

const urlGetBanners = 'customer/home/getbanner';
const baseUrlImg = import.meta.env.VITE_URL_IMG;


const Banners = () => {

    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await AxiosUser.get(urlGetBanners);
                setBanners(res.banners || []);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }finally{
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    const contentStyle = {
        margin: 0,
        height: 'auto',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };

      const styleImg = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }

      const conFigCarousel = {
        autoplay : true,
        autoplaySpeed: 5000,
        infinite: true,
        arrows: true
      }


      if(loading) {
        return (
          <div className='h-[300px] flex flex-col justify-center items-center bg-gray-300'>
            <Spin size="large" style={{ margin: 'auto', display: 'block' }} />
          </div>
        );
      }

    return (
      <>
        <Carousel {...conFigCarousel}>
          {banners.map((item, index) => (
            <div key={`banner-${index}`}>
              <div style={contentStyle}>
                {item?.link !== null ? (
                  <a href={item?.link} target="_blank">
                    <img style={styleImg} src={baseUrlImg + item.img} alt="" />
                  </a>
                ) : (
                  <img style={styleImg} src={baseUrlImg + item.img} alt="" />
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </>
    );
}

export default Banners;