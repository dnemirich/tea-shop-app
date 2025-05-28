import { useState } from 'react';
import styles from './blog.module.css';
import { SectionHeading } from '../SectionHeading/SectionHeading';

type BlogPost = {
  title: string;
  description: string;
  fullContent: string;
  imageUrl: string;
  imageAlt: string;
};

export const Blog = () => {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const posts: BlogPost[] = [
    {
      title: 'HOW TO STEEP TEA LIKE A PRO',
      description:
        'Unlock the full flavour of your favourite teas with expert steeping tips. From water temperature to timing, learn the secrets to brewing the perfect cup every time.',
      fullContent: 'Here would be the full content about how to steep tea like a professional.',
      imageUrl: '/img/Img-index-page/Step-tea-Image.png',
      imageAlt: 'Tea brewing process',
    },
    {
      title: 'ALL ABOUT TEA AROMAS',
      description:
        'Explore the world of tea through its captivating scents—floral, earthy, fruity, and more. This guide will help you train your nose and deepen your tea-tasting experience.',
      fullContent: 'Here would be the full content about tea aromas.',
      imageUrl: '/img/Img-index-page/All-about-Image.png',
      imageAlt: 'Tea leaves and aroma',
    },
  ];

  const togglePost = (index: number) => {
    setExpandedPost(expandedPost === index ? null : index);
  };

  return (
    <>
      <SectionHeading title="Last Blog Posts" />
      <div className={styles.container}>
        {posts.map((post, index) => (
          <div key={index} className={styles.post}>
            <div className={styles.postHeader}>
              <img src={post.imageUrl} alt={post.imageAlt} className={styles.postImage} />
              <div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDescription}>{post.description}</p>
              </div>
            </div>

            <button onClick={() => togglePost(index)} className={styles.readMoreButton}>
              {expandedPost === index ? 'CLOSE' : 'READ MORE'}
            </button>

            {expandedPost === index && (
              <div className={styles.fullContent}>
                <p>{post.fullContent}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
