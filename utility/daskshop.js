const axios = require("axios");
const { getWebSettings } = require("./general");

/**
 * Manual translation mapping
 */
const translations = {
  "Сервисы накрутки": "Boosting Services",
  "Сайты знакомств": "Dating Sites",
  "Одноклассники": "Classmates",
  "ВКонтакте": "VK",
  "РАЗНОЕ": "Miscellaneous",
  "Software (Программы)": "Software",
  "Форумы": "Forums",
  "Кинотеатры (Private)": "Cinemas (Private)",
  "Саморазвитие": "Self Development",
  "Почты": "Email Services",
  "Автореги": "Auto Registration",
  "Игры": "Games",
  "Сайты для взрослых": "Adult Sites",
  "Онлайн Кинотеатры": "Online Cinemas",
};

const patterns = [
  { regex: /^Ручная регистрация (.+)$/i, replace: "Manual Registration $1" },
  { regex: /^Авторег (.+)$/i, replace: "Auto Registration $1" },
  { regex: /^Раскрученные аккаунты (.+)$/i, replace: "Aged $1" },
  { regex: /^Разное (.+)$/i, replace: "$1 Miscellaneous" },
  { regex: /^Аккаунты (.+)$/i, replace: "$1 Accounts" },
];

function applyLocalTranslation(text) {
  if (!text) return text;
  if (translations[text]) return translations[text];

  for (const p of patterns) {
    if (p.regex.test(text)) {
      return text.replace(p.regex, p.replace);
    }
  }
  return null;
}

/**
 * Normalize name for comparison (handles RU → EN)
 */
function normalizeName(name) {
  const translated = applyLocalTranslation(name);
  return (translated || name).trim().toLowerCase();
}

async function googleTranslateBatch(texts) {
  const prepared = texts.map(t => applyLocalTranslation(t) || t);
  const q = prepared.join("\n");

  const res = await axios.get(
    "https://translate.googleapis.com/translate_a/single",
    {
      params: {
        client: "gtx",
        sl: "auto",
        tl: "en",
        dt: "t",
        q,
      },
    }
  );

  return res.data[0].map(t => t[0]);
}

async function fetchAllItems(endpoint) {
  const { dark_api_key, dark_base_url } = await getWebSettings();

  let page = 1;
  let items = [];
  let total = 0;

  do {
    const res = await axios.get(`${dark_base_url}/${endpoint}`, {
      params: {
        key: dark_api_key,
        page,
        "per-page": 100,
      },
    });

    const data = res.data?.data;
    items.push(...(data?.items || []));
    total = data?._meta?.totalCount || 0;
    page++;
  } while (items.length < total);

  return items;
}

async function getCategoriesWithGroups() {
  const [categories, groups] = await Promise.all([
    fetchAllItems("category/list"),
    fetchAllItems("group/list"),
  ]);

  /**
   * Categories to remove (EN names)
   */
  const removeCategories = [
    "VK",
    "ICQ",
    "Fortnite",
    "Amedtkaa",
    "OLX.UZ",
    "Nintendo",
    "Origin accounts",
    "Minecraft accounts",
    "Supercell Accounts",
    "Read the city",
    "Accounts forums",
    "Services",
    "Skype",
    "GOG",
    "Origin",
    "Battle.NET",
    "Minecraft",
    "League of Legends",
    "Self Development",
    "Cinemas (Private)",
    "Epic Games",
    "PS4/PS5",
    "Boosting Services",
    "Classmates",
    "Discord",
    "World of Tanks",
    "OLX",
    "Software",
  ];

  const removeSet = new Set(
    removeCategories.map(c => c.trim().toLowerCase())
  );

  /**
   * Filter categories BEFORE mapping
   */
  const filteredCategories = categories.filter(c => {
    const normalized = normalizeName(c.name);
    return !removeSet.has(normalized);
  });

  /**
   * Build category map
   */
  const map = new Map();
  filteredCategories.forEach(c => {
    map.set(c.id, { ...c, groups: [] });
  });

  /**
   * Attach only allowed groups
   */
  groups.forEach(g => {
    if (!map.has(g.category_id)) return;

    const normalizedGroup = normalizeName(g.name);
    if (removeSet.has(normalizedGroup)) return;

    map.get(g.category_id).groups.push(g);
  });

  /**
   * Prepare texts for translation
   */
  const texts = [];
  [...map.values()].forEach(c => {
    texts.push(c.name);
    c.groups.forEach(g => texts.push(g.name));
  });

  const translated = await googleTranslateBatch(texts);
  let i = 0;

  /**
   * Final response
   */
  const result = [...map.values()].map(c => ({
    ...c,
    name: translated[i++] || c.name,
    groups: c.groups.map(({ additional_category_id, ...g }) => ({
      ...g,
      name: translated[i++] || g.name,
    })),
  }));

  return {
    success: true,
    data: {
      items: result,
    },
  };
}

module.exports = { getCategoriesWithGroups };
