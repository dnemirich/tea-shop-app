import React from 'react';
import styles from './TeaCards.module.css';
import SectionHeading from '../SectionHeading/SectionHeading';

type TeaCardProps = {
  title: string;
  image: string;
  description: string;
};

const TeaCard: React.FC<TeaCardProps> = ({ title, image, description }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={`/img/Img-index-page/${image}`}
          alt={title}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
    </div>
  );
};

const TeaCards: React.FC = () => {
  const teaTypes = [
    {
      title: 'BLACK TEA',
      image: 'black.png',
      description:
        'Black tea is bold, rich, and full-bodied — a classic choice loved for its deep flavor and energizing qualities. Whether enjoyed plain or with milk, it is the perfect companion for any moment of the day.',
    },
    {
      title: 'GREEN TEA',
      image: 'green.png',
      description:
        ' Green tea is known for its light, refreshing taste and delicate, grassy notes. Packed with antioxidants, it offers a soothing, healthful experience with every sip.',
    },
    {
      title: 'WHITE TEA',
      image: 'white.png',
      description:
        'White tea is the most subtle of all teas, with a delicate, naturally sweet flavor. Its gentle nature and minimal processing make it a favorite for those seeking a soft, aromatic tea.',
    },
    {
      title: 'MATCHA',
      image: 'matcha.png',
      description:
        'Matcha is a finely ground green tea powder celebrated for its rich, vibrant flavor and smooth texture. Full of antioxidants and caffeine, it is a potent and energizing drink that enhances focus and calm.',
    },
    {
      title: 'HERBAL TEA',
      image: 'herbal.png',
      description:
        'Herbal teas are made from a variety of plants, flowers, and spices, offering a range of soothing and aromatic flavors. Caffeine-free, they are perfect for relaxation or enjoying before bed.',
    },
    {
      title: "PU'ER",
      image: 'puer.png',
      description:
        'Puer tea is a fermented tea known for its earthy, rich flavor and unique aging process. It becomes smoother and more complex with age, making it a distinctive choice for tea enthusiasts.',
    },
    {
      title: 'OOLONG',
      image: 'ololong.png',
      description:
        'Oolong tea is a partially fermented tea that strikes a balance between black and green teas, offering a rich, floral flavor with a smooth finish. It is ideal for those who enjoy a more complex and aromatic brew.',
    },
    {
      title: 'ROOIBOS',
      image: 'rooibos.png',
      description:
        'Rooibos is a caffeine-free herbal tea from South Africa, offering a sweet, slightly nutty flavor. Rich in antioxidants, it is a soothing, naturally sweet option with a vibrant, reddish color.',
    },
    {
      title: 'TEAWARE',
      image: 'teaware.png',
      description: 'Beautiful teapots, cups and accessories for perfect brewing',
    },
  ];

  return (
    <section className={styles.container}>
      <SectionHeading title="Our Collections" />

      <div className={styles.grid}>
        {teaTypes.map((tea, index) => (
          <TeaCard key={index} title={tea.title} image={tea.image} description={tea.description} />
        ))}
      </div>
    </section>
  );
};

export default TeaCards;
