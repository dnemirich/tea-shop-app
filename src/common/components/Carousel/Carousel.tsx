import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination } from 'swiper/modules';
import s from './Carousel.module.scss';

type CarouselProps = {
  images: string[];
};

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <Swiper slidesPerView={1} pagination={true} modules={[Pagination]} className={s.carousel}>
      {images.map((image, index) => (
        <SwiperSlide key={index} className={s.slide}>
          <img src={image} alt={`Slide ${index}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};