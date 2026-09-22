// Reviewed user uploads. Product photos and design visualizations remain distinct.
export const CURATED_PRODUCT_MEDIA = {
  "mlzitko-bendy": [
    {
      "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
      "title": "BENDY a LINEA v zahradě",
      "kind": "photo"
    },
    {
      "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg",
      "title": "BENDY ve městě",
      "kind": "visualization"
    }
  ],
  "linea-mlzitko": [
    {
      "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg",
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
      "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/25683a407_file_0000000091fc8210b6b21eb1cdf55ece1.png",
      "title": "KVĚT – návrh umístění na náměstí",
      "kind": "visualization"
    }
  ],
  "teepee": [
    {
      "url": "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/06c42b5dc_Screenshot_20260920_171920.jpg",
      "title": "TEEPEE – městské využití",
      "kind": "visualization"
    }
  ]
};
export const CITY_COVER = "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/eb80e8486_IMG_1789934399993.jpg";
export const GARDEN_COVER = "https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/e7593e68f_realizace-IMG_5072.jpg";
export const getCuratedProductMedia = (product) => CURATED_PRODUCT_MEDIA[product?.slug] || [];
