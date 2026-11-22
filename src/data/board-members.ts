export type BoardTier = "leadership" | "officer" | "department" | "committee";

export interface BoardMember {
  id: string;
  tier: BoardTier;
  nameAm: string;
  roleAm: string;
  nameEn: string;
  roleEn: string;
}

/** የሰበካ ጉባዬ — Parish Council board (June 2026). */
export const boardMembers: BoardMember[] = [
  {
    id: "chairman",
    tier: "leadership",
    nameAm: "ቀሲስ አንዱዓለም ይርዳው",
    roleAm: "ሊቀመንበር",
    nameEn: "Qesis Andualem Yiredaw",
    roleEn: "Chairman",
  },
  {
    id: "vice-chairman",
    tier: "leadership",
    nameAm: "ደስታ ተሰማ",
    roleAm: "ምክትል ሊቀመንበር",
    nameEn: "Desta Tesema",
    roleEn: "Vice Chairman",
  },
  {
    id: "chief-secretary",
    tier: "officer",
    nameAm: "አውግቸው አበበ",
    roleAm: "ዋና ፀሐፊ",
    nameEn: "Awgechew Abebe",
    roleEn: "Chief Secretary",
  },
  {
    id: "accountant",
    tier: "officer",
    nameAm: "ጥላሁን ድልነሴ",
    roleAm: "ሒሳብ ሹም",
    nameEn: "Tilahun Dilnese",
    roleEn: "Accountant",
  },
  {
    id: "chief-treasurer",
    tier: "officer",
    nameAm: "ምትኩ መኩሪያ",
    roleAm: "ዋና ገንዘብ ያዥ",
    nameEn: "Miteku Mekuria",
    roleEn: "Chief Treasurer",
  },
  {
    id: "deputy-treasurer",
    tier: "officer",
    nameAm: "ሀና ነጋሽ",
    roleAm: "ምክትል ገንዘብ ያዥ",
    nameEn: "Hana Negash",
    roleEn: "Deputy Treasurer",
  },
  {
    id: "public-relations",
    tier: "department",
    nameAm: "ሳባ ስንታየሁ",
    roleAm: "የህዝብ ግንኙነት",
    nameEn: "Saba Sintayehu",
    roleEn: "Public Relations",
  },
  {
    id: "property",
    tier: "department",
    nameAm: "ታምራት ዓለሙ",
    roleAm: "ንብረት ክፍል",
    nameEn: "Tamrat Alemu",
    roleEn: "Property Department",
  },
  {
    id: "law",
    tier: "department",
    nameAm: "ገነት ተሰማ",
    roleAm: "የህግ ክፍል",
    nameEn: "Genet Tesema",
    roleEn: "Law Department",
  },
  {
    id: "audit-1",
    tier: "committee",
    nameAm: "ክብር ዘውዴ",
    roleAm: "ቁጥጥር ኮሚቴ",
    nameEn: "Kibir Zewde",
    roleEn: "Control Committee",
  },
  {
    id: "audit-2",
    tier: "committee",
    nameAm: "ምናለ እጅጉ",
    roleAm: "ቁጥጥር ኮሚቴ",
    nameEn: "Minale Egegu",
    roleEn: "Control Committee",
  },
  {
    id: "audit-3",
    tier: "committee",
    nameAm: "ግርማንተ አበበ",
    roleAm: "ቁጥጥር ኮሚቴ",
    nameEn: "Girumante Abebe",
    roleEn: "Control Committee",
  },
];

export const boardTiers: BoardTier[] = ["leadership", "officer", "department", "committee"];

export function membersByTier(tier: BoardTier) {
  return boardMembers.filter((m) => m.tier === tier);
}
