// Seed script to populate database with sample blog posts
import { db } from "./db";
import { blogPosts, type InsertBlogPost } from "@shared/schema";
import { sql } from "drizzle-orm";

const samplePosts: InsertBlogPost[] = [
  {
    slug: "ako-sa-pripravit-na-stahovanie-bytu",
    title: "Ako sa pripraviť na sťahovanie bytu v Bratislave",
    excerpt: "Pripravte sa na bezproblémové sťahovanie s našim kompletným návodom. Zistite, čo zabaliť, ako zabezpečiť veci a čo pripraviť vopred.",
    content: `# Ako sa pripraviť na sťahovanie bytu v Bratislave

Sťahovanie bytu môže byť stresujúce, ale s dobrým plánovaním to zvládnete bez problémov. V tomto článku vám ukážeme, ako sa pripraviť krok za krokom.

## 1. Začnite plánovať aspoň 2 týždne vopred

Ideálne je začať s prípravami minimálne 2 týždne pred termínom sťahovania. Dá vám to dostatok času na:
- Zozbieranie baliacich materiálov
- Postupné balenie vecí
- Zrušenie a nahlásenie zmeny adresy
- Kontaktovanie sťahovacej firmy

## 2. Pripravte si baliacie materiály

Pre sťahovanie budete potrebovať:
- **Kartónové krabice** (rôzne veľkosti)
- **Bublinkové fólie** na krehké predmety
- **Papier alebo noviny** na vyplnenie prázdnych miest
- **Lepiaca páska** na uzatvorenie krabíc
- **Permanentný fix** na označenie krabíc

## 3. Balte postupne a systematicky

Začnite s vecami, ktoré nepoužívate každý deň:
- Knihy, dekorácie, sezónne oblečenie
- Potom postupujte k bežne používaným veciam
- Kuchyňu a kúpeľňu balte ako posledné

**Tip:** Označte každú krabicu s obsahom a miestnosťou, kam patrí.

## 4. Zbavte sa nepotrebných vecí

Sťahovanie je ideálna príležitosť na vypratanie:
- Darujte veci, ktoré nepoužívate
- Predajte cennejšie predmety
- Vyhoďte poškodené alebo zbytočné veci

## 5. Kontaktujte profesionálov

Sťahovacia firma vám ušetrí množstvo času a námahy. Pri výbere dbajte na:
- Referencie a recenzie
- Poistenie zodpovednosti
- Transparentný cenník
- Dostupnosť v požadovanom termíne

## Záver

S týmito tipmi bude vaše sťahovanie v Bratislave plynulé a bez stresu. Ak potrebujete pomoc, neváhajte nás kontaktovať pre nezáväznú cenovú ponuku.`,
    category: "Tipy a návody",
    tags: ["sťahovanie", "príprava", "balenie", "Bratislava"],
    authorName: "VI&MO Team",
    readingTime: 5,
    metaDescription: "Kompletný návod, ako sa pripraviť na sťahovanie bytu v Bratislave. Tipy na balenie, plánovanie a výber sťahovacej firmy.",
    featured: 1,
  },
  {
    slug: "5-tipov-ako-znizit-stres-pri-stahovani",
    title: "5 tipov, ako znížiť stres pri sťahovaní",
    excerpt: "Sťahovanie nemusí byť chaos. Pozrite si naše overené tipy na organizáciu, balenie a komunikáciu s firmou, ktoré vám ušetria nervy.",
    content: `# 5 tipov, ako znížiť stres pri sťahovaní

Sťahovanie je medzi najstresujúcejšími životnými udalosťami. Tu je 5 overených tipov, ako si ho uľahčiť.

## 1. Vytvorte si podrobný harmonogram

Naplánujte si každý deň pred sťahovaním:
- Čo zabaliť
- Aké úkony vybaviť
- Koho kontaktovať

Písaný plán vám pomôže nič nezabudnúť.

## 2. Použite systém farebného označovania

- **Modrá** - spálňa
- **Zelená** - kuchyňa
- **Žltá** - obývačka
- **Červená** - kúpeľňa

Farebné označenie zrýchli rozbaľovanie v novom byte.

## 3. Pripravte si "prvý deň" kufríky

Do každého kufríka dejte:
- Základné toaletné potreby
- Prezlečenie
- Nabíjačky
- Základné čistiace prostriedky
- Dôležité dokumenty

## 4. Komunikujte jasne so sťahovákom

- Ukážte, čo sa sťahuje a čo nie
- Upozornite na krehké predmety
- Vysvetlite špecifické požiadavky
- Dohodnite sa na presnom čase

## 5. Požiadajte o pomoc

Či už rodinu, priateľov alebo profesionálov - nerobte všetko sami. Rozdelená záťaž je polovičná záťaž.

## Bonus tip

Objednajte si jedlo na deň sťahovania. Nebudete musieť myslieť na varenie a ušetríte energiu.

---

Potrebujete profesionálov na vaše sťahovanie v Bratislave? Kontaktujte nás ešte dnes!`,
    category: "Tipy a návody",
    tags: ["stres", "organizácia", "sťahovanie", "tipy"],
    authorName: "VI&MO Team",
    readingTime: 4,
    metaDescription: "Päť praktických tipov, ako zvládnuť sťahovanie bez stresu. Organizácia, balenie a komunikácia s profesionálmi.",
    featured: 0,
  },
  {
    slug: "vypratavanie-bytu-prakticky-checklist",
    title: "Vypratávanie bytu – praktický checklist",
    excerpt: "Potrebujete vypratať byt pred sťahovaním alebo predajom? Náš checklist vám pomôže nezabudnúť na žiadnu dôležitú vec.",
    content: `# Vypratávanie bytu – praktický checklist

Vypratávanie bytu je často náročnejšie ako samotné sťahovanie. Tu je kompletný checklist, ktorý vám uľahčí prácu.

## 1. Miestnosť po miestnosti

### Kuchyňa
- Prázdna chladnička a mraznička
- Vyčistené spotrebiče
- Prázdne skrinky a zásuvky
- Zbavte sa prešlých potravín
- Odvoz nepotrebného riadu

### Spálňa
- Prázdne skrine
- Vytriedené oblečenie
- Prázdne nočné stolíky
- Demontovaná posteľ (ak sa neberie)

### Kúpeľňa
- Prázdne skrinky
- Odvoz starých produktov
- Vyhodenie starých uterákov

### Obývačka
- Roztriedené knihy
- Výber nábytku na odvoz
- Balenie dekorácií

## 2. Triedenie odpadu

Pri vypratávaní dodržiavajte:
- Separáciu odpadu
- Odovzdanie elektrozariadení na správne miesta
- Recykláciu papiera a plastov

## 3. Odvoz odpadu

Môžete využiť:
- Komunálny odpad
- Zberný dvor
- Profesionálnu firmu na odvoz

## 4. Záverečné upratovanie

Po vypratávaní:
- Umyť podlahy
- Vyčistiť okná
- Vyvetrať priestory

## Zhrnutie

S týmto checklistom zvládnete vypratávanie systematicky a efektívne. Ak potrebujete pomoc s odvozom odpadu a vypratávaním v Bratislave, sme tu pre vás.`,
    category: "Návody",
    tags: ["vypratávanie", "checklist", "upratovanie", "organizácia"],
    authorName: "VI&MO Team",
    readingTime: 6,
    metaDescription: "Praktický checklist pre vypratávanie bytu. Krok za krokom návod, čo treba vyčistiť, vyhodiť a ako sa zbaviť nepotrebných vecí.",
    featured: 0,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");
  
  try {
    // Check if posts already exist
    const existingPosts = await db.select().from(blogPosts);
    
    if (existingPosts.length > 0) {
      console.log("✅ Database already contains blog posts. Skipping seed.");
      process.exit(0);
    }
    
    // Insert sample posts
    for (const post of samplePosts) {
      await db.insert(blogPosts).values(post);
      console.log(`✅ Inserted: ${post.title}`);
    }
    
    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
