import { Catalog } from './Catalog/Catalog';
import TeaFilter from './TeaFilter/TeaFilter';

export const CatalogPage = () => {
  return (
    <div className="catalogPageContainer">
      <img
        src="/img/catalog-page/catalog-image.png"
        alt="catalog_img"
        className="catalogHeaderImage"
      />
      <TeaFilter />
      <Catalog />
    </div>
  );
};
