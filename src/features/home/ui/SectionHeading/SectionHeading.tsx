import styles from './sectionheading.module.css';

type SectionHeadingProps = {
  title: string;
  className?: string;
};

export const SectionHeading = ({ title, className }: SectionHeadingProps) => {
  return (
    <div>
      <h2 className={`${styles.title} ${className}`}>{title}</h2>
    </div>
  );
};
