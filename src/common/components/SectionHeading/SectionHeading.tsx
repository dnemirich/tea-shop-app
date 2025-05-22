import styles from './sectionheading.module.css';

interface SectionHeadingProps {
  title: string;
}

const SectionHeading = ({ title }: SectionHeadingProps) => {
  return (
    <div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default SectionHeading;