import { useState } from "react";

// Country name → ISO alpha-2 (mirrors backend COUNTRY_ISO map)
export const COUNTRY_NAME_ISO = {
  "russia": "ru", "ukraine": "ua", "kazakhstan": "kz", "china": "cn",
  "philippines": "ph", "myanmar": "mm", "indonesia": "id", "malaysia": "my",
  "kenya": "ke", "tanzania": "tz", "vietnam": "vn", "kyrgyzstan": "kg",
  "israel": "il", "hong kong": "hk", "poland": "pl", "united kingdom": "gb",
  "madagascar": "mg", "dr congo": "cd", "nigeria": "ng", "macao": "mo",
  "egypt": "eg", "india": "in", "ireland": "ie", "cambodia": "kh",
  "laos": "la", "haiti": "ht", "ivory coast": "ci", "gambia": "gm",
  "serbia": "rs", "yemen": "ye", "south africa": "za", "romania": "ro",
  "colombia": "co", "estonia": "ee", "azerbaijan": "az", "canada": "ca",
  "morocco": "ma", "ghana": "gh", "argentina": "ar", "uzbekistan": "uz",
  "cameroon": "cm", "chad": "td", "germany": "de", "lithuania": "lt",
  "croatia": "hr", "sweden": "se", "iraq": "iq", "netherlands": "nl",
  "latvia": "lv", "austria": "at", "belarus": "by", "thailand": "th",
  "saudi arabia": "sa", "mexico": "mx", "taiwan": "tw", "spain": "es",
  "iran": "ir", "algeria": "dz", "slovenia": "si", "bangladesh": "bd",
  "senegal": "sn", "turkey": "tr", "czech": "cz", "sri lanka": "lk",
  "peru": "pe", "pakistan": "pk", "new zealand": "nz", "guinea": "gn",
  "mali": "ml", "venezuela": "ve", "ethiopia": "et", "mongolia": "mn",
  "brazil": "br", "afghanistan": "af", "uganda": "ug", "angola": "ao",
  "cyprus": "cy", "france": "fr", "papua": "pg", "mozambique": "mz",
  "nepal": "np", "belgium": "be", "bulgaria": "bg", "hungary": "hu",
  "moldova": "md", "italy": "it", "paraguay": "py", "honduras": "hn",
  "tunisia": "tn", "nicaragua": "ni", "timor-leste": "tl", "bolivia": "bo",
  "costa rica": "cr", "guatemala": "gt", "uae": "ae", "zimbabwe": "zw",
  "puerto rico": "pr", "sudan": "sd", "togo": "tg", "kuwait": "kw",
  "salvador": "sv", "libya": "ly", "jamaica": "jm", "trinidad and tobago": "tt",
  "ecuador": "ec", "swaziland": "sz", "oman": "om", "bosnia": "ba",
  "dominican republic": "do", "syria": "sy", "qatar": "qa", "panama": "pa",
  "cuba": "cu", "mauritania": "mr", "sierra leone": "sl", "jordan": "jo",
  "portugal": "pt", "barbados": "bb", "burundi": "bi", "benin": "bj",
  "brunei": "bn", "bahamas": "bs", "botswana": "bw", "belize": "bz",
  "central african republic": "cf", "dominica": "dm", "grenada": "gd",
  "georgia": "ge", "greece": "gr", "guinea-bissau": "gw", "guyana": "gy",
  "iceland": "is", "comoros": "km", "saint kitts and nevis": "kn",
  "liberia": "lr", "lesotho": "ls", "malawi": "mw", "namibia": "na",
  "niger": "ne", "rwanda": "rw", "slovakia": "sk", "suriname": "sr",
  "tajikistan": "tj", "monaco": "mc", "bahrain": "bh", "reunion": "re",
  "zambia": "zm", "armenia": "am", "somalia": "so", "congo": "cg",
  "chile": "cl", "burkina faso": "bf", "lebanon": "lb", "gabon": "ga",
  "albania": "al", "uruguay": "uy", "mauritius": "mu", "bhutan": "bt",
  "maldives": "mv", "guadeloupe": "gp", "turkmenistan": "tm",
  "french guiana": "gf", "finland": "fi", "saint lucia": "lc",
  "luxembourg": "lu", "saint vincent and the grenadines": "vc",
  "equatorial guinea": "gq", "djibouti": "dj", "antigua and barbuda": "ag",
  "cayman islands": "ky", "montenegro": "me", "denmark": "dk",
  "switzerland": "ch", "norway": "no", "australia": "au", "eritrea": "er",
  "south sudan": "ss", "sao tome and principe": "st", "aruba": "aw",
  "montserrat": "ms", "anguilla": "ai", "japan": "jp",
  "north macedonia": "mk", "seychelles": "sc", "new caledonia": "nc",
  "cape verde": "cv", "usa": "us", "palestine": "ps", "fiji": "fj",
  "south korea": "kr", "singapore": "sg", "samoa": "ws", "malta": "mt",
  "gibraltar": "gi", "kosovo": "xk", "niue": "nu",
  // common aliases
  "united states": "us", "united states of america": "us", "uk": "gb",
  // hidden countries (may become visible)
  "usa (virtual)": "us", "north korea": "kp", "western sahara": "eh",
  "solomon islands": "sb", "jersey": "je", "bermuda": "bm", "tonga": "to",
  "liechtenstein": "li", "faroe islands": "fo",
};

export const getCountryFlag = (countryName) => {
  if (!countryName) return null;
  const iso = COUNTRY_NAME_ISO[String(countryName).toLowerCase()];
  return iso ? `https://flagcdn.com/w20/${iso}.png` : null;
};

// Only list exceptions that don't follow the "{name}.com" pattern
const DOMAIN_OVERRIDES = {
  gmail: "gmail.com",
  telegram: "telegram.org",
  signal: "signal.org",
  twitch: "twitch.tv",
  zoom: "zoom.us",
  line: "line.me",
  hinge: "hinge.co",
  imo: "imo.im",
  steam: "steampowered.com",
  cash: "cash.app",
  cocacola: "coca-cola.com",
  ola: "olacabs.com",
  whatsaround: "whatsaround.app",
  olacabs: "olacabs.com",
  clubhouse: "joinclubhouse.com",
  x: "x.com",
};

// HeroSMS service codes → domain (for when we have a code instead of a name)
const CODE_DOMAINS = {
  wa: "whatsapp.com",
  tg: "telegram.org",
  go: "google.com",
  fb: "facebook.com",
  ig: "instagram.com",
  tw: "twitter.com",
  tt: "tiktok.com",
  sc: "snapchat.com",
  dc: "discord.com",
  li: "linkedin.com",
  ub: "uber.com",
  am: "amazon.com",
  nf: "netflix.com",
  sp: "spotify.com",
  ms: "microsoft.com",
  ap: "apple.com",
  pp: "paypal.com",
  vi: "viber.com",
  si: "signal.org",
  rd: "reddit.com",
  zm: "zoom.us",
  yt: "youtube.com",
};

const getServiceDomain = (name) => {
  const key = name.toLowerCase().split(/[\s_\-(]/)[0];
  // Check if it's a short service code (≤4 chars)
  if (key.length <= 4 && CODE_DOMAINS[key]) return CODE_DOMAINS[key];
  return DOMAIN_OVERRIDES[key] || `${key}.com`;
};

const getInitialColor = (name) => {
  const colors = [
    "#E46300", "#3B82F6", "#10B981", "#8B5CF6",
    "#EF4444", "#F59E0B", "#06B6D4", "#EC4899",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const ServiceLogo = ({ name }) => {
  const [imgError, setImgError] = useState(false);
  const domain = getServiceDomain(name);
  const color = getInitialColor(name);
  const initial = name.charAt(0).toUpperCase();

  if (domain && !imgError) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={name}
        onError={() => setImgError(true)}
        className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-800 p-1.5 flex-shrink-0"
      />
    );
  }

  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-base"
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  );
};

export default ServiceLogo;
