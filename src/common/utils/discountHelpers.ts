import { getCategoryById, getDiscounts } from '@/common/api/products-api.ts';

export const getDiscountsInfo = async () => {
  const discountInfo = {
    name: '',
    references: [] as string[],
    value: 0,
    isActive: false,
  };

  const discountsRes = await getDiscounts();
  const discounts = discountsRes.body.results[0];

  if (discounts) {
    discountInfo.name = discounts.name['en-US'];

    const references = await Promise.all(
      discounts.references.map(async (ref) => {
        const categoryRes = await getCategoryById(ref.id);
        return categoryRes.body.name['en-US'].toLowerCase().replace(' ', '-');
      }),
    );

    discountInfo.references = references;

    if ('permyriad' in discounts.value) {
      discountInfo.value = discounts.value.permyriad / 100;
    }
    discountInfo.isActive = discounts.isActive;
  }

  return discountInfo;
};
