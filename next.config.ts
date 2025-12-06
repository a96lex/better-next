import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  turbopack: {},
  i18n: {
    locales: ["en-US", "ca-ES", "es-ES"],
    defaultLocale: "ca-ES",
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
