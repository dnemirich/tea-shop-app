import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Pagination } from 'swiper/modules';
import s from './Carousel.module.scss';
import { Modal } from '@/common/components/Modal/Modal.tsx';

type CarouselProps = {
  images: string[];
};

export const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const handleImageClick = (index: number) => {
    setCurrentImage(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Swiper
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className={s.carousel}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={s.slide} onClick={() => handleImageClick(index)}>
            <img src={image} alt={`Slide ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <Swiper
            slidesPerView={1}
            initialSlide={currentImage}
            loop={true}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className={`${s.carousel} ${s.modalCarousel}`}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className={s.slide}>
                <img src={image} alt={`Slide ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>
      )}
    </>
  );
};
