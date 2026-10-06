import React from 'react';
import ArchitecturalHero from './ArchitecturalHero';

const COPY = {
  'Městská mlžítka': ['Místo pro lidi.', 'Prostor pro osvěžení.', 'Nerezová mlžítka pro náměstí, parky a promenády. Navrhneme řešení, které respektuje architekturu místa i jeho každodenní provoz.'],
  'Zahradní mlžítka': ['Léto ve vlastní', 'oáze klidu.', 'Jemná mlha pro zahrady, terasy a pobytové zóny. Vyberte design, který přirozeně zapadne do zeleně a zpříjemní chvíle venku.'],
  'Kolekce AURA®': ['AURA®', 'Kruh, který spojuje.', 'Čistý kruhový motiv v sestavách SINGLE a DUO. Pro intimní zahradu i otevřený veřejný prostor.'],
  'Kolekce BENDY®': ['BENDY®', 'Křivka s charakterem.', 'Štíhlý nerezový profil a výběr geometrií ohybu. Najděte podobu, která podtrhne charakter vašeho prostoru.'],
  'Kolekce STÉBLO®': ['STÉBLO®', 'Přirozený rytmus místa.', 'Organická linie od samostatného prvku po prostorovou sestavu. Vneste do architektury lehkost a jemnou mlhu.'],
  'Kolekce OSTREV City®': ['OSTREV City®', 'Nový orientační bod.', 'Stromový motiv, jemné mlžení a možnost rozcestníku na míru. Výrazný prvek pro městská setkávání.'],
  'Autorská kolekce mlžítek': ['Vaše místo.', 'Vlastní příběh.', 'Autorské nerezové instalace navržené pro konkrétní prostor. Od první skici po mlhu, která dotvoří atmosféru místa.'],
};
export default function CollectionHero({ collection }) {
  const [title, accent, description] = COPY[collection.name] || [collection.name, undefined, collection.text];
  return <ArchitecturalHero eyebrow={collection.name} title={title} accent={accent} description={description}
    image={collection.image} imageAlt={collection.name + ' — ukázka z kolekce'} caption={collection.name + ' / design v prostoru'} target="collection-products" />;
}
