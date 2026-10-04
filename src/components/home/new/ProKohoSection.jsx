import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, Compass } from 'lucide-react';

const AUDIENCES = [
{
  icon: Building2,
  problem: 'Horké dny mění náměstí, parky a okolí veřejných budov na místa, kde lidé hledají stín a rychlé osvěžení.',
  benefits: [
  'Vodní mlha na veřejná prostranství pro příjemnější pobyt v tropických dnech',
  'Napojení na běžný vodovodní řád a standardní tlak v potrubí podle konkrétní instalace',
  'Nerezová konstrukce navržená pro dlouhodobý venkovní provoz'],

  cta: 'Připravit podklady pro radu města',
  link: '/poptavka'
},
{
  icon: Landmark,
  problem: 'Sportoviště, koupaliště, ZOO a technické služby potřebují spolehlivé ochlazení pro návštěvníky i personál.',
  benefits: [
  'Modulární řešení pro areály s různými zónami využití',
  'Smart řízení podle teploty, času a provozního režimu',
  'Servis, zazimování a dlouhodobá podpora od výrobce'],

  cta: 'Technická konzultace provozu',
  link: '/poptavka'
},
{
  icon: Compass,
  problem: 'Architekti a projektanti hledají ověřené technické řešení, které se začlení do návrhu veřejného prostoru.',
  benefits: [
  'Technické listy, kotvení a podklady pro projektovou dokumentaci na vyžádání',
  'Zakázkové tvary a geometrie v ověřitelných produktových pravidlech',
  'Vizualizace produktu v konkrétním prostoru jako podklad pro poptávku'],

  cta: 'Vyžádat podklady pro projekt',
  link: '/ke-stazeni'
}];


export default function ProKohoSection() {
  return null;
































}