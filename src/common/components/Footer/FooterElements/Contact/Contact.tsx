import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div className={styles.contact_section}>
      <h3 className={styles.title}>CONTACT US</h3>
      <ul className={styles.contact_list}>
        <li className={styles.contact_item}>
          <MapPin className={styles.icon} />
          <span>12 Tea street, Saint Petersburg, Russia</span>
        </li>
        <li className={styles.contact_item}>
          <Mail className={styles.icon} />
          <span>Email: leaf-n-lore@gmail.com</span>
        </li>
        <li className={styles.contact_item}>
          <Phone className={styles.icon} />
          <span>Tel: +7 812 123-45-67</span>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
