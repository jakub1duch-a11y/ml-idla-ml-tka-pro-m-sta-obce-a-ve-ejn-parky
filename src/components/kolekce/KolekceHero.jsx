import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { APPROVED_HERO_VISUALS } from '@/lib/approvedHeroVisuals';
import '@/styles/catalog-video-hero.css';

/**
 * Katalog používá pouze vizualizaci schválenou v adminu Marketing.
 * Dřívější zahradní video MRAK neodpovídalo městskému katalogovému hero.
 * Samostatná statická fotografie zrychluje první vykreslení i mobil.
 */
export default function KolekceHero() {
  const visual = APPROVED_HERO_VISUALS.catalog;

  return (
    <section className="catalog-video-hero" aria-labelledby="catalog-hero-title">
      <div className="catalog-video-hero-media">
        <picture>
          <img
            src={visual.src}
            alt={visual.alt}
            style={{ objectPosition: visual.objectPosition }}
            width="1600"
            height="1000"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="catalog-video-hero-shade" aria-hidden="true" />
      </div>

      <div className="catalog-video-hero-copy">
        <p className="catalog-video-hero-eyebrow">MLŽIDLA.cz / Produkty a kolekce</p>
        <h1 id="catalog-hero-title">Nerezová mlžítka pro města, parky a zahrady.</h1>
        <p className="catalog-video-hero-description">
          Prohlédněte si jednotlivé produktové řady, varianty a mlžné brány.
          Vyberte model podle místa, požadované geometrie a způsobu provozu.
        </p>
        <div className="catalog-video-hero-actions">
          <a href="#catalog">Prohlédnout produkty <ArrowRight size={18} aria-hidden="true" /></a>
          <Link to="/poptavka">Poptat řešení <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <p className="catalog-video-hero-caption">
          LINEA v městském parku · schválená produktová vizualizace
        </p>
      </div>
    </section>
  );
}
