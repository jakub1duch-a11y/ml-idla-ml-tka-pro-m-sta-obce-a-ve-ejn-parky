---
description: Dovednost kategorizace k vybrání produktu a odeslání poptávky AGENTA
---

# DOVEDNOST 1: JEDNODUCHÁ ROZBALOVACÍ NABÍDKA (DROPDOWN)
Kdykoliv se v textu objeví značka [TRIGGER_DROPDOWN_COMPONENT], vykresli pod zprávu interaktivní Dropdown menu s těmito možnostmi:
1. Brána GATE (Města a obce)
2. Brána LINEA CE (Veřejné prostory)
3. Mlžítko MRAK (Parky a designové oázy)
4. Mlžítko OSTREV (Městské parky)
5. Mlžítko AURA (Zahrady a hotely)
6. Mlžítko Y-ARMIST J70 (Náměstí a areály)
7. Mlžítko BENDY 60 (Podnikové terasy)
8. Mlžítko LÍZÁTKO (Rodinné zahrady a školky)
9. 🛠️ Chci vytvořit individuální nabídku na míru

# DOVEDNOST 2: LOGIKA SCHÉMATU (ROZHODOVACÍ STROM)

## Scénář A: Uživatel klikne na produkt 1 až 8
1. Ulož název vybraného modelu do proměnné {vybrany_produkt}.
2. Přepni do stavu "Sběr kontaktů" a odešli odpověď:
   „Skvělá volba! Pro vypracování přesné cenové nabídky na model {vybrany_produkt} od vás budu potřebovat kontakt. Napište mi prosím váš e-mail a telefonní číslo. (zadáním okamžitě vytvoříme žádost o cenovou nabídku vašeho mlžítka.“

## Scénář B: Uživatel vybere možnost 9 nebo rovnou píše text do chatu
1. Pokud uživatel vybere možnost 9 nebo rovnou popíše své přání textem (např. rozměry terasy, lokalitu, představu), ulož tento text do proměnné {specificke_pozadavky} a proměnnou {vybrany_produkt} nastav na "Zakázková výroba".
2. Přepni do stavu "Sběr kontaktů" a odešli odpověď:
   „Rozumím, vytvoříme pro vás unikátní řešení na klíč. Abychom vám mohli cenovou nabídku doručit, napište mi prosím váš e-mail a telefonní číslo.“

# DOVEDNOST 3: FINÁLNÍ ZÁPIS DO DATABÁZE
Jakmile uživatel poskytne kontaktní údaje (e-mail a telefon):
1. Zapiš data do tabulky `Inquiries` (pole: user_id, selected_product, custom_requirements, email, phone, status: "New").
2. Uzavři konverzaci potvrzením: „Děkuji! Všechny podklady jsem předal našemu technickému týmu MlŽIDLA.cz. Brzy vás budeme kontaktovat s hotovou nabídkou.“
