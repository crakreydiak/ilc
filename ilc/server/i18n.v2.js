const {
  getHostnameFromHeaderHost,
  getCurrentLocaleFromHeaderHost,

  serializeCookie,
  deserializeCookie,
} = require("../common/i18nHelpers");

const onRequestFactoryI18nV2 = () => async (req, reply) => {
  if (req.raw.url === "/ping" || req.raw.url.startsWith("/_ilc/")) {
    return;
  }

  const headerHost = req.headers["x-request-host"] ?? req.headers["host"];

  const subdomainUserLang = getCurrentLocaleFromHeaderHost(headerHost);

  req.raw.crakLabelState.lang = subdomainUserLang;

  const currentUserLangCookie = deserializeCookie(req.headers.cookie);
  const nextUserLangCookieValue = serializeCookie({
    value: subdomainUserLang,
    domain: getHostnameFromHeaderHost(headerHost),
  });

  if (!currentUserLangCookie.lang !== subdomainUserLang) {
    reply.res.setHeader("Set-Cookie", nextUserLangCookieValue);
  }
};

module.exports = {
  onRequestFactoryI18nV2,
};
