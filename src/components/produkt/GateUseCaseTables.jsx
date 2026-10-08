import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Dumbbell, PartyPopper } from 'lucide-react';

const SPACES = [
{ id: 'city', icon: Building2, name: 'Náměstí a pěší zóny', title: 'Osvěžení na přirozené pěší trase.', text: 'Brána nebo portál může vyznačit vstup do pobytové zóny. Při návrhu zohledníme pohyb lidí, průchozí šířku, vítr a návaznost na okolní architekturu.', groups: ['gate', 'portal'], notes: ['Volný průchod a přístupnost', 'Napojení vody a servisní přístup', 'Sladění s povrchem a mobiliářem'] },
{ id: 'park', icon: Trees, name: 'Parky a promenády', title: 'Průchod mlhou mezi zelení.', text: 'Oblouk nebo kruhový portál doplní cestu i klidnější odpočinkovou plochu. Umístění volíme s ohledem na zeleň, povrch a místa, kde se lidé přirozeně zastavují.', groups: ['gate', 'portal'], notes: ['Vhodný povrch a odvodnění', 'Bezpečné kotvení pod povrchem', 'Sezónní provoz a zazimování'] },
{ id: 'sport', icon: Dumbbell, name: 'Sportoviště a areály', title: 'Mlžná zóna na cestě k odpočinku.', text: 'GATE vytvoří přehledný průchod u vstupu nebo mezi částmi areálu. Provoz sladíme s návštěvností a zachováme potřebný prostor pro bezpečný pohyb.', groups: ['gate'], notes: ['Umístění mimo aktivní sportovní plochu', 'Provoz podle harmonogramu areálu', 'Dostupnost vody a údržby'] },
{ id: 'events', icon: PartyPopper, name: 'Slavnosti a sezónní místa', title: 'Samostojící TEEPEE jako bod osvěžení.', text: 'TEEPEE představuje samostatný mlžný prvek pro akce a sezónní zóny. Před umístěním vyřešíme stabilitu konstrukce, bezpečné vedení vody a provozní podmínky.', groups: ['standalone'], notes: ['Bezpečné umístění konstrukce', 'Přívod vody mimo pěší trasy', 'Obsluha a podmínky sezónního provozu'] }];


export default function GateUseCaseTables({ products = [] }) {
  const [selected, setSelected] = useState('city');
  const space = SPACES.find((item) => item.id === selected);
  const recommendations = products.filter((product) => space.groups.includes(product.group));
  return <section className="gate-selection" aria-labelledby="gate-selection-title">





  </section>;
}