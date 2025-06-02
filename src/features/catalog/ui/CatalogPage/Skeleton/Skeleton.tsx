import ContentLoader from 'react-content-loader';

export const Skeleton = () => (
  <ContentLoader
    speed={2}
    width={278}
    height={500}
    viewBox="0 0 278 500"
    backgroundColor="#ffffff"
    foregroundColor="#f5f4f4"
  >
    <rect x="212" y="151" rx="0" ry="0" width="0" height="17" />
    <rect x="1" y="281" rx="0" ry="0" width="276" height="54" />
    <rect x="1" y="341" rx="0" ry="0" width="276" height="22" />
    <rect x="0" y="369" rx="0" ry="0" width="276" height="45" />
    <rect x="2" y="418" rx="0" ry="0" width="116" height="29" />
    <rect x="0" y="0" rx="0" ry="0" width="278" height="278" />
  </ContentLoader>
);
