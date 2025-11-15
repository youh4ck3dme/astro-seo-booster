import { 
  type BlogPost, 
  type InsertBlogPost,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class MemStorage implements IStorage {
  private blogPosts: Map<string, BlogPost>;
  private contactSubmissions: Map<string, ContactSubmission>;

  constructor() {
    this.blogPosts = new Map();
    this.contactSubmissions = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample blog posts for SEO demonstration
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
        author: "VI&MO Team",
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
        author: "VI&MO Team",
        readingTime: 4,
        metaDescription: "Päť praktických tipov, ako zvládnuť sťahovanie bez stresu. Organizácia, balenie a komunikácia s profesionálmi.",
        featured: 0,
      },
      {
        slug: "vypratavanie-bytu-praktickyty-checklist",
        title: "Vypratávanie bytu – praktický checklist",
        excerpt: "Potrebujete vypratať byt pred sťahovaním alebo predajom? Náš checklist vám pomôže nezabudnúť na žiadnu dôležitú vec.",
        content: `# Vypratávanie bytu – praktický checklist

Vypratávanie bytu je často náročnejšie ako samotné sťahovanie. Tu je kompletný checklist, ktorý vám uľahčí prácu.

## 1. Miestnosť po miestnosti

### Kuchyňa
- [ ] Prázdna chladnička a mraznička
- [ ] Vyčistené spotrebiče
- [ ] Prázdne skrinky a zásuvky
- [ ] Zbavte sa prešlých potravín
- [ ] Odvoz nepotrebného riadu

### Spálňa
- [ ] Prázdne skrine
- [ ] Vytriedené oblečenie
- [ ] Prázdne nočné stolíky
- [ ] Demontovaná posteľ (ak sa neberie)

### Kúpeľňa
- [ ] Prázdne skrinky
- [ ] Vyhodené staré kozmetické produkty
- [ ] Vyčistené umývadlo a vaňa
- [ ] Prázdny kôš

### Obývačka
- [ ] Prázdne police
- [ ] Vytriedené knihy a dokumenty
- [ ] Demontovaný nábytok (ak sa neberie)

## 2. Čo robiť s nepotrebnými vecami

### Možnosti:
- **Darovanie** - charita, útulky, priateľom
- **Predaj** - online bazáre, second-handy
- **Recyklácia** - papier, plast, sklo
- **Odvoz do zberného dvora** - elektroodpad, veľké predmety

## 3. Kedy zavolať profesionálov

Vypratávanie si objednajte, ak:
- Nemáte dostatok času
- Ide o veľký objem vecí
- Potrebujete odviezť ťažký nábytok
- Chcete to mať rýchlo hotové

## 4. Finálne upratanie

Po vypratanie nezabudnite:
- Povysávať
- Umyť podlahy
- Vyčistiť okná
- Vyvetrať priestory

## Zhrnutie

S týmto checklistom zvládnete vypratávanie systematicky a efektívne. Ak potrebujete pomoc s odvozom odpadu a vypratávaním v Bratislave, sme tu pre vás.`,
        category: "Návody",
        tags: ["vypratávanie", "checklist", "upratovanie", "organizácia"],
        author: "VI&MO Team",
        readingTime: 6,
        metaDescription: "Praktický checklist pre vypratávanie bytu. Krok za krokom návod, čo treba vyčistiť, vyhodiť a ako sa zbaviť nepotrebných vecí.",
        featured: 0,
      },
    ];

    samplePosts.forEach((post) => {
      const id = randomUUID();
      const blogPost: BlogPost = {
        ...post,
        id,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
      };
      this.blogPosts.set(blogPost.slug, blogPost);
    });
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .map(post => ({
        ...post,
        publishedAt: typeof post.publishedAt === 'string' 
          ? new Date(post.publishedAt) 
          : post.publishedAt
      }))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(slug);
    if (!post) return undefined;
    
    return {
      ...post,
      publishedAt: typeof post.publishedAt === 'string' 
        ? new Date(post.publishedAt) 
        : post.publishedAt
    };
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      publishedAt: new Date(),
    };
    this.blogPosts.set(post.slug, post);
    return post;
  }

  // Contact Submissions
  async createContactSubmission(
    insertSubmission: InsertContactSubmission
  ): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      submittedAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new MemStorage();
