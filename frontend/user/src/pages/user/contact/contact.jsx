import React, { useState } from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;

const ContactPage = () => {
  return (
    <>
      {/* <div className="pt-[90px]"></div> */}
      <div
        className="w-full bg-cover bg-center"
      >

        <div className="w-full p-16 pt-24 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url(/images/png/contact1.jpg)" }}>
          <div className="swapper grid md:grid-cols-2 gap-6 bg-white/90 p-6 rounded shadow">
            {/* Liên hệ */}
            <div>
              <h2 className="text-2xl font-bold mb-4">LIÊN HỆ</h2>
              <div className="space-y-3">
                <p className="flex items-center gap-2"><span>📘</span> Fanpage</p>
                <p className="flex items-center gap-2"><span>📧</span> Mail</p>
                <p className="flex items-center gap-2 text-blue-600 italic"><span>📞</span> 0886 681 030</p>
              </div>
            </div>

            {/* Hỗ trợ khách hàng */}
            <div>
              <h2 className="text-2xl font-bold mb-4">HỖ TRỢ KHÁCH HÀNG</h2>
              <input type="text" placeholder="Số điện thoại (*)" className="w-full border mb-2 p-2 rounded" />
              <input type="email" placeholder="Email" className="w-full border mb-2 p-2 rounded" />
              <select className="w-full border mb-4 p-2 rounded">
                <option>Thông tin cần hỗ trợ</option>
                <option>Sản phẩm</option>
                <option>Giao hàng</option>
                <option>Khác</option>
              </select>
              <button className="bg-[#a48b5f] text-white px-4 py-2 rounded">SUBMIT</button>
            </div>
          </div>
        </div>

        <div className="swapper pb-10">
          {/* FAQ + Map */}
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">CÂU HỎI THƯỜNG GẶP</h3>
              <Collapse defaultActiveKey={["1"]} accordion>
                <Panel header="Chất lượng sản phẩm từ TheraMD ?" key="1">
                  <p>
                    Các sản phẩm từ TheraMD được sản xuất từ nguyên liệu và công nghệ đến từ Châu Âu. Được thử nghiệm và chứng nhận hiệu quả, an toàn từ các bác sĩ chuyên khoa da liễu.
                  </p>
                </Panel>
                <Panel header="Làm sao để đặt mua sản phẩm của Theramd ?" key="2">
                  <p>
                    Bạn có thể đặt hàng qua website chính thức hoặc fanpage của chúng tôi.
                  </p>
                </Panel>
                <Panel header="Chính sách giao hàng ?" key="3">
                  <p>
                    Giao hàng toàn quốc, miễn phí đơn từ 500.000đ trở lên.
                  </p>
                </Panel>
                <Panel header="Chính sách ưu đãi đối với các đại lý ?" key="4">
                  <p>
                    Vui lòng liên hệ trực tiếp với bộ phận kinh doanh để nhận ưu đãi.
                  </p>
                </Panel>
              </Collapse>
            </div>
            <div>
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2341775255894!2d106.70750777586995!3d10.793003089355875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528cabb4e8273%3A0xd1d30592ef2d5d60!2zMTUyIE5ndXnhu4VuIFbEg24gVGjGsMahbmcsIFBoxrDhu51uZyAyNSwgQsOsbmggVGjhuq1uZCwgSOG7kyBDaMOtbmggTWluaA!5e0!3m2!1svi!2s!4v1711020872310!5m2!1svi!2s"
                className="w-full h-80 border-0 rounded"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
