import { useState, useEffect } from 'react';
import { TeaCards } from './TeaCards/TeaCards';
import { Pagination } from './Pagination/Pagination';
import { TeaFilter } from './TeaFilter/TeaFilter';
import { SortBy } from './SortBy/SortBy';
import { PromoBanner } from './PromoBanner/PromoBanner';
import styles from './catalogpage.module.css';
import { apiRoot } from '@/common/config/api-client.ts';
import { Product } from './Types/catalogTypes';
import { OutOfStock } from './OutOfStock/OutOfStock';
import { useNavigate } from 'react-router-dom';

export const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [sorted, setSorted] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedTeaTypes, setSelectedTeaTypes] = useState<string[]>([]);
  const [selectedCaffeine, setSelectedCaffeine] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const productsPerPage = 9;

  // --- Fetch categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRoot.categories().get().execute();
        const map = response.body.results.reduce(
          (acc, category) => {
            acc[category.id] = category.name['en-US'] || '';
            return acc;
          },
          {} as Record<string, string>,
        );
        setCategories(map);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!Object.keys(categories).length) return;

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

        const mapped = response.body.results.map((product) => {
          const attrs = product.masterVariant.attributes || [];

          const getVal = (name: string) => attrs.find((a) => a.name === name)?.value;
          const getList = (name: string): string[] => {
            const val = getVal(name);
            if (!Array.isArray(val)) return [];
            return val.map((v) => v['en-US'] || v['ru'] || '').filter(Boolean);
          };

          const catId = product.categories?.[0]?.id;
          return {
            id: product.id,
            productType: categories[catId] || 'Unknown',
            name: product.name?.['en-US'] || '',
            description: product.description?.['en-US'] || '',
            price: getVal('price-per-ounce') || 0,
            currency: product.masterVariant.prices?.[0]?.value?.currencyCode || 'USD',
            images: product.masterVariant.images?.map((img) => img.url) || [
              'https://via.placeholder.com/150',
            ],
            weight: 100,
            flavor: getList('flavor'),
            origin: getVal('origin')?.['en-US'] || '',
            hasCaffeine: !getVal('caffeine-free'),
            ingredients: getList('ingredients'),
            color: getVal('color')?.['en-US'] || '',
          };
        });

        setProducts(mapped);
        setFiltered(mapped);
        setSorted(mapped);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categories]);

  useEffect(() => {
    let result = [...products];

    if (selectedTeaTypes.length) {
      result = result.filter((p) =>
        selectedTeaTypes.some((type) => p.productType.toLowerCase().includes(type.toLowerCase())),
      );
    }

    if (selectedFlavors.length) {
      result = result.filter((p) => p.flavor?.some((f) => selectedFlavors.includes(f)));
    }

    if (selectedOrigins.length) {
      result = result.filter((p) => selectedOrigins.includes(p.origin || ''));
    }

    if (selectedCaffeine !== null) {
      result = result.filter((p) => (selectedCaffeine ? p.hasCaffeine : !p.hasCaffeine));
    }

    setFiltered(result);
    setSorted(result);
    setCurrentPage(1);
  }, [selectedFlavors, selectedOrigins, selectedTeaTypes, selectedCaffeine, products]);

  // --- Sorting ---
  const handleSortChange = (sortBy: string) => {
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
    setSorted(sorted);
    setCurrentPage(1);
  };

  // --- Pagination ---
  const indexLast = currentPage * productsPerPage;
  const indexFirst = indexLast - productsPerPage;
  const currentProducts = sorted.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(sorted.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!loading && !error && !filtered.length) {
    return (
      <OutOfStock
        navigateToHome={() => navigate('/')}
        onResetFilters={() => {
          setSelectedFlavors([]);
          setSelectedOrigins([]);
          setSelectedTeaTypes([]);
          setSelectedCaffeine(null);
        }}
      />
    );
  }

  return (
    <div className={styles.catalogWrapper}>
      <PromoBanner />

      <div className={styles.mainContent}>
        <div className={styles.leftSidebar}>
          <TeaFilter
            selectedFlavors={selectedFlavors}
            selectedOrigins={selectedOrigins}
            selectedCaffeine={selectedCaffeine}
            selectedTeaTypes={selectedTeaTypes}
            onFlavorToggle={(flavor) =>
              setSelectedFlavors((prev) =>
                prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor],
              )
            }
            onOriginToggle={(origin) =>
              setSelectedOrigins((prev) =>
                prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin],
              )
            }
            onTeaTypeToggle={(type) =>
              setSelectedTeaTypes((prev) =>
                prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
              )
            }
            onCaffeineToggle={(hasCaffeine) => {
              setSelectedCaffeine(hasCaffeine);
            }}
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
