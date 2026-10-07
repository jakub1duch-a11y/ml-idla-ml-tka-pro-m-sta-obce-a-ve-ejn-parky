import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATALOG_CATEGORIES } from "@/lib/catalogCategories";

export default function ProductCategoryExplorer() {
  return (
    <section
      id="produkty"
      className="bg-[#F5FAFB] py-12 sm:py-16 lg:py-20"
      aria-labelledby="category-explorer-title"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-8 grid gap-5 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">
              Řešení podle prostoru
            </p>
            <h2
              id="category-explorer-title"
              className="mt-3 font-heading text-3xl leading-tight tracking-tight text-slate-950 sm:text-4xl"
            >
              Od jednoho mlžítka po celé mlžiště.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">
            Vyberte typ řešení a prohlédněte si jeho využití. S výběrem
            konkrétních prvků, rozmístěním i provozem vám pomůžeme podle
            fotografie nebo půdorysu místa.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {CATALOG_CATEGORIES.map((category, index) => (
            <Link
              key={category.href}
              to={category.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-4"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={category.image}
                  alt={category.imageAlt}
                  loading="lazy"
                  width="640"
                  height="480"
                  className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 lg:p-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-cyan-800">
                  0{index + 1} · {category.eyebrow}
                </p>
                <h3 className="mt-3 font-heading text-2xl leading-tight text-slate-950">
                  {category.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
                <p className="mb-5 mt-4 text-xs font-medium leading-5 text-slate-600">
                  {category.use}
                </p>
                <span className="mt-auto flex min-h-11 items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-950">
                  Prozkoumat řešení <ArrowRight size={18} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
