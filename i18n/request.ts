import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";

export default getRequestConfig(async () => {
  const supportedLocales = ["ca", "es", "en"];

  // Check for cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");

  if (localeCookie && supportedLocales.includes(localeCookie.value)) {
    return {
      locale: localeCookie.value,
      messages: (await import(`../public/locales/${localeCookie.value}.json`)).default,
    };
  }

  // Fallback to accept-language header
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  let locale = "ca";

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
