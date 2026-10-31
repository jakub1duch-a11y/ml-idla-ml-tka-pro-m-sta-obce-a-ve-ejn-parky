import detailPhotos from '../../data/product-detail-photos.json';

export const CURATED_PRODUCT_MEDIA = {
  "mlzitko-bendy": [
    detailPhotos["mlzitko-bendy"],
    {
      "url": "/media/optimized/e7593e68f_realizace-IMG_5072.webp",
      "title": "BENDY a LINEA v zahradě",
      "kind": "photo"
    },
    {
      "url": "/media/optimized/eb80e8486_IMG_1789934399993.webp",
      "title": "BENDY ve městě",
      "kind": "visualization"
    }
  ],
  "linea-mlzitko": [
    {
      "url": "/media/optimized/e7593e68f_realizace-IMG_5072.webp",
      "title": "Sloupová LINEA s BENDY v zahradě",
      "kind": "photo"
    }
  ],
  "mlzitko-mrak": [
    {
      "url": "https://drive.google.com/thumbnail?id=1cAuotLpUftsG_fNk3ii_RKWZ83EyWdK6&sz=w1600",
      "title": "Z výroby mlžítka MRAK",
      "kind": "photo"
    }
  ],
  "mlzitko-kvet-4": [
    {
      "url": "/media/optimized/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.webp",
      "title": "KVĚT – návrh umístění na náměstí",
      "kind": "visualization"
    }
  ],
  "teepee": [
    {
      "url": "/media/optimized/06c42b5dc_Screenshot_20260920_171920.webp",
      "title": "TEEPEE – městské využití",
      "kind": "visualization"
    }
  ]
};
export const CITY_COVER = "/media/optimized/eb80e8486_IMG_1789934399993.webp";
export const GARDEN_COVER = "/media/optimized/e7593e68f_realizace-IMG_5072.webp";
export const getCuratedProductMedia = (product) => CURATED_PRODUCT_MEDIA[product?.slug] || [];
