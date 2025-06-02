import React from 'react';
import styles from './Footer.module.scss';
import { MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';
import { TEA_CATEGORIES } from '@/common/constants/categories-constants.ts';

export const Footer: React.FC = () => {
  const contactInfo = [
    {
      icon: <MapPin size={16} color="#ae1919" />,
      text: '12 Tea street, Saint Petersburg, Russia',
    },
    {
      icon: <Mail size={16} color="#ae1919" />,
      text: 'Email: leaf-n-lore@gmail.com',
    },
    {
      icon: <Phone size={16} color="#ae1919" />,
      text: 'Tel: +7 812 123-45-67',
    },
  ];

  //TO_DO все li станут кликабельными ссылками , когда будет готова main-page

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerWrapper}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>COLLECTIONS</h4>
            <ul className={styles.sectionList}>
              {TEA_CATEGORIES.map((item, index) => (
                <li className={styles.sectionItem} key={index}>
                  <Link to={`${ROUTES.SHOP}/${item.link}`}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>LEARN</h4>
            <ul className={styles.sectionList}>
              <li className={styles.sectionItem}>About us</li>
              <li className={styles.sectionItem}>Blog</li>
            </ul>
          </div>

          <div className={`${styles.section} ${styles.contact}`}>
            <h4 className={styles.sectionTitle}>CONTACT US</h4>
            <ul className={styles.contactsList}>
              {contactInfo.map((item, index) => (
                <li className={styles.contactItem} key={index}>
                  {item.icon} {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
