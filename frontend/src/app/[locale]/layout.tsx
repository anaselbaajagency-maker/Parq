import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "../globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MaintenanceGuard from "../../components/MaintenanceGuard";
import ClientProviders from "../../components/ClientProviders";

export const metadata = {
  title: "Parq - Heavy Machinery & Transport Rental",
  description: "Rent heavy machinery, transport, and professional drivers in Morocco.",
};


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
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <ClientProviders>
              <MaintenanceGuard>
                <Header locale={locale} />
                <main>{children}</main>
                <Footer />
              </MaintenanceGuard>
            </ClientProviders>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
