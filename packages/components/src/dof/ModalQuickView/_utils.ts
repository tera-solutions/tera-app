export const convertCombo = (combo) => {
  let data = {};

  combo?.forEach((item) => {
    if (item.type == "single") {
      const stockData = item?.parent?.stock_products?.find(
        (i) => i.stock_id === item.stock_id,
      );

      data = {
        ...data,
        [item?.parent?.id]: {
          ...(item?.parent ?? {}),
          ...(item?.stock_product ?? {}),
          image_url: item?.parent?.image_url,
          stock_products: item?.parent?.stock_products,
          number_quantity: item.quantity,
          price_sale_combo: item.price_sale_combo,
          ...(stockData ?? {}),
          stock_id: item.stock_id,
          type: item.type,
          id: item?.parent?.id,
          stock: item.stock,
          product: item?.parent?.name,
        },
      };
    }
    if (item.type == "variable") {
      data = {
        ...data,
        ...(!data?.[item?.parent?.id] && {
          [item?.parent?.id]: {
            ...(item?.parent ?? {}),
            product: item?.parent?.name,
            variants: [
              {
                ...item,
                ...(item?.stock_product ?? {}),
                product_id: item?.product_id,
                stock_products: item?.parent?.stock_products,
                number_quantity: item.quantity,
                price_sale_combo: item.price_sale_combo,
                stock_id: item.stock_id,
                stock: item.stock,
                type: "",
              },
            ],
          },
        }),
        ...(!!data?.[item?.parent?.id] && {
          [item?.parent?.id]: {
            ...data?.[item?.parent?.id],
            product: item?.parent?.name,
            variants: [
              ...(data?.[item?.parent?.id]?.variants ?? {}),
              {
                ...item,
                ...(item?.parent ?? {}),
                ...(item?.stock_product ?? {}),
                id: item?.parent?.id,
                stock_products: item?.parent?.stock_products,
                number_quantity: item.quantity,
                price_sale_combo: item.price_sale_combo,
                stock_id: item.stock_id,
                product_id: item?.product_id,
                type: "",
                stock: item.stock,
              },
            ],
          },
        }),
      };
    }
  });

  return Object.values(data);
};
