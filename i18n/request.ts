import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  let locale = "ca";
  const supportedLocales = ["ca", "es", "en"];

  for (const lang of acceptLanguage.split(",")) {
    const langCode = lang.split(";")[0].trim().toLowerCase();

    for (const supported of supportedLocales) {
      if (langCode === supported || langCode.startsWith(`${supported}-`)) {
        locale = supported;
        break;
      }
    }

    if (locale !== "ca") break;
  }

  return {
    locale,
    messages: (await import(`../public/locales/${locale}.json`)).default,
  };
});
