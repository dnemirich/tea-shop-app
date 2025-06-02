// React и хуки
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Компоненты
import { TeaCards } from './TeaCards/TeaCards.tsx';
import { Pagination } from './Pagination/Pagination.tsx';
import { TeaFilter } from './TeaFilter/TeaFilter.tsx';
import { SortBy } from './SortBy/SortBy.tsx';
import { PromoBanner } from './PromoBanner/PromoBanner.tsx';
import { OutOfStock } from './OutOfStock/OutOfStock.tsx';

// Стили
import styles from './catalogPage.module.css';

// Типы и API
import { Product } from '@/common/types/catalog-types.ts';
import { fetchCategories, fetchProducts, searchProducts } from '../../api/catalog-api.ts';
import { useSearchStore } from '@/common/store/search-store.ts';
import { Skeleton } from './Skeleton/Skeleton.tsx';

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
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const navigate = useNavigate();
  const productsPerPage = 9;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!Object.keys(categories).length) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const result = searchQuery
          ? await searchProducts(searchQuery, categories)
          : await fetchProducts(categories);

        setProducts(result);
        setFiltered(result);
        setSorted(result);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadProducts, 300);
    return () => clearTimeout(timer);
  }, [categories, searchQuery]);

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
              {loading ? (
                Array(productsPerPage)
                  .fill(0)
                  .map((_, index) => <Skeleton key={index} />)
              ) : error && sorted.length === 0 ? (
                <OutOfStock
                  navigateToHome={() => navigate('/')}
                  onResetFilters={() => {
                    setSelectedFlavors([]);
                    setSelectedOrigins([]);
                    setSelectedTeaTypes([]);
                  }}
                />
              ) : (
                currentProducts.map((product) => <TeaCards key={product.id} {...product} />)
              )}
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
