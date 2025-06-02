import React from 'react';
import styles from './subscribe.module.css';
import { Send } from 'lucide-react';
import { SectionHeading } from '@/features/home/ui/SectionHeading/SectionHeading.tsx';

export const Subscribe: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src="/img/Img-index-page/Subscribe-image.png"
          alt="Various loose teas on spoons"
          className={styles.image}
        />
      </div>

      <div className={styles.textWrapper}>
        <SectionHeading title="Subscribe to our newsletter" />

        <p className={styles.paragraph}>
          Want to be the first to know about our newest tea arrivals, seasonal specials, and tea
          wisdom from our blog? Join our growing community of tea lovers and receive hand-picked
          updates straight to your inbox. From exclusive offers to expert brewing tips and
          behind-the-scenes stories from the world of tea — our newsletter keeps you steeped,
          inspired, and always in the know.
        </p>
        <p className={styles.paragraph}>Subscribe today and make each cup a little more magical.</p>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            placeholder="Enter Your Email Address Here"
            className={styles.input}
          />
          <button className={styles.sendButton}>
            <span className={styles.sendText}>SEND</span>
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
};
