import { useState, useEffect } from 'react';
import { TeaCards } from './TeaCards/TeaCards';
import { Pagination } from './Pagination/Pagination';
import { TeaFilter } from './TeaFilter/TeaFilter';
import styles from './catalogpage.module.css';
import { apiRoot } from '@/common/config/api-client.ts';
import { SortBy } from './SortBy/SortBy';
import { PromoBanner } from './PromoBanner/PromoBanner';

type Product = {
  id: string;
  productType: string;
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  weight?: number;
  flavor?: string[];
  origin?: string;
  hasCaffeine?: boolean | string;
  ingredients?: string[];
  color?: string;
};

type Attribute = {
  name: string;
  value: any;
};

export const CatalogPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Фильтры
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedCaffeine, setSelectedCaffeine] = useState<boolean | null>(null);
  // const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedTeaTypes, setSelectedTeaTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRoot.categories().get().execute();

        const categoriesMap = response.body.results.reduce(
          (acc, category) => {
            acc[category.id] = category.name['en-US'] || '';
            return acc;
          },
          {} as Record<string, string>,
        );

        setCategories(categoriesMap);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiRoot
          .productProjections()
          .get({
            queryArgs: {
              where: 'published=true',
              limit: 100,
              expand: ['categories[*]'],
            },
          })
          .execute();

        const mappedProducts = response.body.results.map((product) => {
          const attributes: Attribute[] = product.masterVariant.attributes || [];

          const getAttributeValue = (name: string) =>
            attributes.find((attr) => attr.name === name)?.value;

          const getAttributeValues = (name: string): string[] => {
            const attr = attributes.find((attr) => attr.name === name);
            if (!attr || !Array.isArray(attr.value)) return [];
            return attr.value.map((val) => val['en-US'] || val['ru'] || '').filter(Boolean);
          };

          const categoryId = product.categories?.[0]?.id;
          const categoryName = categoryId ? categories[categoryId] : 'Unknown';

          return {
            id: product.id,
            productType: categoryName,
            name: product.name?.['en-US'] || '',
            description: product.description?.['en-US'] || '',
            price: getAttributeValue('price-per-ounce') || 0,
            images: product.masterVariant.images?.map((img) => img.url) || [
              'https://via.placeholder.com/150',
            ],
            weight: 100,
            flavor: getAttributeValues('flavor'),
            origin: getAttributeValue('origin')?.['en-US'] || '',
            hasCaffeine: !getAttributeValue('caffeine-free'),
            ingredients: getAttributeValues('ingredients'),
            color: getAttributeValue('color')?.['en-US'] || '',
            categoryId: categoryId,
          };
        });

        setAllProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setSortedProducts(mappedProducts);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(categories).length > 0) {
      fetchProducts();
    }
  }, [categories]);

  // Фильтрация
  const applyFilters = () => {
    let filtered = allProducts;

    if (selectedTeaTypes.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTeaTypes.some((type) =>
          product.productType.toLowerCase().includes(type.toLowerCase()),
        ),
      );
    }

    if (selectedFlavors.length > 0) {
      filtered = filtered.filter((product) =>
        product.flavor?.some((f) => selectedFlavors.includes(f)),
      );
    }

    if (selectedOrigins.length > 0) {
      filtered = filtered.filter((product) => selectedOrigins.includes(product.origin || ''));
    }

    //проверь потом
    if (selectedCaffeine !== null) {
      filtered = filtered.filter((product) => product.hasCaffeine === selectedCaffeine);
    }

    // if (selectedIngredients.length > 0) {
    //   filtered = filtered.filter((product) =>
    //     product.ingredients?.some((i) => selectedIngredients.includes(i)),
    //   );
    // }

    setFilteredProducts(filtered);
    setSortedProducts(filtered);
    setCurrentPage(1);
  };

  // Сортировка
  const handleSortChange = (sortValue: string) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortValue) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });

    setSortedProducts(sorted);
    setCurrentPage(1);
  };

  // Пагинация
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Обработчики фильтров
  const handleFlavorChange = (flavors: string[]) => {
    setSelectedFlavors(flavors);
    applyFilters();
  };

  const handleOriginChange = (origins: string[]) => {
    setSelectedOrigins(origins);
    applyFilters();
  };

  const handleCaffeineChange = (hasCaffeine: boolean | null) => {
    setSelectedCaffeine(hasCaffeine);
    applyFilters();
  };

  // const handleIngredientsChange = (ingredients: string[]) => {
  //   setSelectedIngredients(ingredients);
  //   applyFilters();
  // };

  const handleTeaTypeChange = (types: string[]) => {
    setSelectedTeaTypes(types);
    applyFilters();
  };

  // Отображение состояния
  if (loading) return <div className={styles.loading}>Loading products...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!loading && !error && filteredProducts.length === 0)
    return <div className={styles.empty}>No products found</div>;

  return (
    <div className={styles.catalogWrapper}>
      <PromoBanner />

      <div className={styles.mainContent}>
        <div className={styles.leftSidebar}>
          <TeaFilter
            onFlavorChange={handleFlavorChange}
            onOriginChange={handleOriginChange}
            onCaffeineChange={handleCaffeineChange}
            // onIngredientsChange={handleIngredientsChange}
            onTeaTypeChange={handleTeaTypeChange}
          />
        </div>

        <div className={styles.rightContent}>
          <div className={styles.sortAndProducts}>
            <div className={styles.sortRow}>
              <SortBy onSortChange={handleSortChange} />
            </div>

            <div className={styles.cardContainer}>
              {currentProducts.map((product) => (
                <TeaCards key={product.id} {...product} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
