import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Cairo } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MaintenanceGuard from "../../components/MaintenanceGuard";

const cairo = Cairo({ subsets: ["latin", "arabic"], weight: ["400", "700"] });

export const metadata = {
  title: "Parq - Heavy Machinery & Transport Rental",
  description: "Rent heavy machinery, transport, and professional drivers in Morocco.",
};

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={cairo.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <MaintenanceGuard>
              <Header locale={locale} />
              <main>{children}</main>
              <Footer />
            </MaintenanceGuard>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
