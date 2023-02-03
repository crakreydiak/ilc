const Cookie = require("cookie");

const LANGUAGES = {
  EN: "en",
  FR: "fr",
  ES: "es",
  PT: "pt",
  DE: "de",
  IT: "it",
};

const DEFAULT_LANGUAGE = LANGUAGES.EN;
const SUPPORTED_LANGUAGES = Object.values(LANGUAGES);

function getHostnameFromHeaderHost(headerHost) {
  const findStartWithWwwAndOrLang = /^www\.|(^en\.|(?<=www\.)en\.)|(^fr\.|(?<=www\.)fr\.)|(^es\.|(?<=www\.)es\.)|(^pt\.|(?<=www\.)pt\.)|(^de\.|(?<=www\.)de\.)|(^it\.|(?<=www\.)it\.)/gmi;
  return headerHost.replace(findStartWithWwwAndOrLang, '');
}

function getCurrentLocaleFromHeaderHost(headerHost) {
  const [locale] = headerHost.split(".");
  if (!isLanguageSupported(locale)) {
    return DEFAULT_LANGUAGE;
  }

  return locale;
}

function isLanguageSupported(lang) {
  return !!lang && SUPPORTED_LANGUAGES.includes(lang);
}

const COOKIE_NAME = "user-language";

function getCookieOpts(domain = "") {
  return {
    path: "/",
    domain,
    expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  };
}

function encodeCookie(val) {
  return isLanguageSupported(val) ? val : DEFAULT_LANGUAGE;
}

function decodeCookie(val) {
  return {
    lang: isLanguageSupported(val) ? val : DEFAULT_LANGUAGE,
  };
}

function serializeCookie({ value, domain }) {
  return Cookie.serialize(
    COOKIE_NAME,
    encodeCookie(value),
    getCookieOpts(domain)
  );
}

function deserializeCookie(cookies) {
  const cookie = Cookie.parse(cookies || "")[COOKIE_NAME];
  return decodeCookie(cookie);
}

module.exports = {
  getHostnameFromHeaderHost,
  getCurrentLocaleFromHeaderHost,

  LANGUAGES,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  isLanguageSupported,

  COOKIE_NAME,
  encodeCookie,
  decodeCookie,
  getCookieOpts,
  serializeCookie,
  deserializeCookie,
};
