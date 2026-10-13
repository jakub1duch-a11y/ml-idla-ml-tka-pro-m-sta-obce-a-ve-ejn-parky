export { GREEN, SOFT, INK, MUTE, WHITE, drawCoverPage, drawSolutionPage, drawTechPage, drawPlacementPage, drawSmartPage, drawPricePage, drawDarkHeroPage, drawPhotoHeroPage, drawRecapPage, buildOfferDocument } from './offerDocumentLayout.ts';
export interface PdfImg { data: string; format: string }
export interface OfferCtx {
  productName: string; clientName: string; clientCompany: string;
  goal: string; solution: string; benefits: string[];
  lines: { label: string; quantity: number; unit: string; total: number }[];
  total: number; smart: boolean; quoteNum: string; validUntil: string; today: string;
  product: any; imgs: (PdfImg | null)[]; scenes?: any[]; supla?: any;
}