import { Carousel } from 'antd';


const Banners = () => {

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

    return(
        <>
    <Carousel  {...conFigCarousel}>
      <div>
        <div style={contentStyle}>
        <a href="https://facebook.com">
            <img style={styleImg} src="/images/home/b1.jpg" alt="" />
        </a>
        </div>
      </div>
      <div>
        <div style={contentStyle}>
        <img style={styleImg} src="/images/home/b2.png" alt="" />

        </div>
      </div>
      <div>
        <div style={contentStyle}>
        <img style={styleImg} src="/images/home/b3.png" alt="" />

        </div>
      </div>
      <div>
        <div style={contentStyle}>
        <img style={styleImg} src="/images/home/b4.jpg" alt="" />

        </div>
      </div>
    </Carousel>
  </>
    )
}

export default Banners;