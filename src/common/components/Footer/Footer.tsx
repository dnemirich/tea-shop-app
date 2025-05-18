import React from 'react';
import styles from './Footer.module.css';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const teaArray = [
    'Black tea',
    'Green tea',
    'White tea',
    'Herbal tea',
    'Matcha',
    'Puer',
    'Oolong',
    'Rooibos',
    'Teaware',
  ] as const;

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
      <div className={styles.section}>
        <h4>COLLECTIONS</h4>
        <ul>
          {teaArray.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.section}>
        <h4>LEARN</h4>
        <ul>
          <li>About us</li>
          <li>Blog</li>
        </ul>
      </div>

      <div className={`${styles.section} ${styles.contact}`}>
        <h4>CONTACT US</h4>
        {contactInfo.map((item, index) => (
          <p key={index}>
            {item.icon} {item.text}
          </p>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
