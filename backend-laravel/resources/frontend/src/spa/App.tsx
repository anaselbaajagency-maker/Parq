import React, { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NextIntlClientProvider } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '@/navigation';
import { useRouteState } from '@/compat/spa-router';
import ClientProviders from '@/components/ClientProviders';
import HeaderClient from '@/components/HeaderClient';
import Footer from '@/components/Footer';
import MaintenanceGuard from '@/components/MaintenanceGuard';

import HomeClient from '@/app/[locale]/HomeClient';
import LoginPage from '@/app/[locale]/login/page';
import RegisterPage from '@/app/[locale]/register/page';
import ForgotPasswordPage from '@/app/[locale]/forgot-password/page';
import BuyPage from '@/app/[locale]/buy/page';
import RentPage from '@/app/[locale]/rent/page';
import MaintenanceClient from '@/app/[locale]/maintenance/MaintenanceClient';
import AnnoncesPage from '@/app/[locale]/annonces/page';
import ListingClient from '@/app/[locale]/annonce/[slug]/ListingClient';
import ProfileClient from '@/app/[locale]/profil/[id]/ProfileClient';
import CreateListingClient from '@/app/[locale]/create/CreateListingClient';
import BuyCategoryClient from '@/app/[locale]/buy/[slug]/BuyCategoryClient';
import RentCategoryClient from '@/app/[locale]/rent/[slug]/RentCategoryClient';

import DashboardLayoutClient from '@/app/[locale]/tableau-de-bord/DashboardLayoutClient';
import DashboardClient from '@/app/[locale]/tableau-de-bord/DashboardClient';
import ListingsClient from '@/app/[locale]/tableau-de-bord/annonces/ListingsClient';
import EditListingClient from '@/app/[locale]/tableau-de-bord/annonces/edit/[id]/EditListingClient';
import DashboardMessagesPage from '@/app/[locale]/tableau-de-bord/messages/page';
import DashboardSettingsPage from '@/app/[locale]/tableau-de-bord/settings/page';
import WalletClient from '@/app/[locale]/tableau-de-bord/wallet/WalletClient';
import HistoryClient from '@/app/[locale]/tableau-de-bord/wallet/history/HistoryClient';

import AdminLayoutClient from '@/app/[locale]/admin/AdminLayoutClient';
import AdminPage from '@/app/[locale]/admin/page';
import AdminFeaturedPage from '@/app/[locale]/admin/featured/page';
import AdminUsersPage from '@/app/[locale]/admin/users/page';
import AdminHomepagePage from '@/app/[locale]/admin/homepage/page';
import AdminListingsPage from '@/app/[locale]/admin/listings/page';
import AdminCreateListingPage from '@/app/[locale]/admin/listings/create/page';
import AdminSettingsPage from '@/app/[locale]/admin/settings/page';
import AdminMaintenancePage from '@/app/[locale]/admin/maintenance/page';
import CategoriesClient from '@/app/[locale]/admin/categories/CategoriesClient';
import CitiesClient from '@/app/[locale]/admin/cities/CitiesClient';
import AdminWalletsClient from '@/app/[locale]/admin/wallets/AdminWalletsClient';
import PaymentMethodsClient from '@/app/[locale]/admin/payment-methods/PaymentMethodsClient';

interface RouteRenderContext {
    locale: string;
    routePattern: string | null;
    params: Record<string, string>;
}

function RedirectTo({ href }: { href: string }) {
    const router = useRouter();

    useEffect(() => {
        router.replace(href);
    }, [href, router]);

    return null;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
    const { hasHydrated, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!hasHydrated) return;
        if (!isAuthenticated) {
            router.replace('/login');
        }
    }, [hasHydrated, isAuthenticated, router]);

    if (!hasHydrated || !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}

function renderDashboardRoute(context: RouteRenderContext): React.ReactNode {
    const { routePattern, params } = context;

    let page: React.ReactNode = null;

    switch (routePattern) {
        case '/tableau-de-bord':
            page = <DashboardClient />;
            break;
        case '/tableau-de-bord/annonces':
            page = <ListingsClient />;
            break;
        case '/tableau-de-bord/annonces/edit/:id':
            page = <EditListingClient id={params.id || ''} />;
            break;
        case '/tableau-de-bord/messages':
            page = <DashboardMessagesPage />;
            break;
        case '/tableau-de-bord/settings':
            page = <DashboardSettingsPage />;
            break;
        case '/tableau-de-bord/wallet':
            page = <WalletClient />;
            break;
        case '/tableau-de-bord/wallet/history':
            page = <HistoryClient />;
            break;
        default:
            return null;
    }

    return <DashboardLayoutClient>{page}</DashboardLayoutClient>;
}

function renderAdminRoute(context: RouteRenderContext): React.ReactNode {
    const { routePattern } = context;

    let page: React.ReactNode = null;

    switch (routePattern) {
        case '/admin':
            page = <AdminPage />;
            break;
        case '/admin/categories':
            page = <CategoriesClient />;
            break;
        case '/admin/featured':
            page = <AdminFeaturedPage />;
            break;
        case '/admin/wallets':
            page = <AdminWalletsClient />;
            break;
        case '/admin/maintenance':
            page = <AdminMaintenancePage />;
            break;
        case '/admin/payment-methods':
            page = <PaymentMethodsClient />;
            break;
        case '/admin/users':
            page = <AdminUsersPage />;
            break;
        case '/admin/cities':
            page = <CitiesClient />;
            break;
        case '/admin/listings':
            page = <AdminListingsPage />;
            break;
        case '/admin/listings/create':
            page = <AdminCreateListingPage />;
            break;
        case '/admin/homepage':
            page = <AdminHomepagePage />;
            break;
        case '/admin/settings':
            page = <AdminSettingsPage />;
            break;
        default:
            return null;
    }

    return <AdminLayoutClient>{page}</AdminLayoutClient>;
}

function renderMainRoute(context: RouteRenderContext): React.ReactNode {
    const { locale, routePattern, params } = context;

    switch (routePattern) {
        case '/':
            return <HomeClient locale={locale} />;
        case '/login':
            return <LoginPage />;
        case '/register':
            return <RegisterPage />;
        case '/forgot-password':
            return <ForgotPasswordPage />;
        case '/maintenance':
            return <MaintenanceClient />;
        case '/buy':
            return <BuyPage />;
        case '/buy/:slug':
            return <BuyCategoryClient categoryId={params.slug || ''} />;
        case '/buy/:slug/:subSlug':
            return <BuyCategoryClient categoryId={params.subSlug || ''} citySlug={params.slug || ''} />;
        case '/rent':
            return <RentPage />;
        case '/rent/:slug':
            return <RentCategoryClient categoryId={params.slug || ''} />;
        case '/rent/:slug/:subSlug':
            return <RentCategoryClient categoryId={params.subSlug || ''} citySlug={params.slug || ''} />;
        case '/annonce/:slug':
            return <ListingClient slug={params.slug || ''} />;
        case '/annonces':
            return <AnnoncesPage />;
        case '/annonces/:slug':
            return <ListingClient slug={params.slug || ''} />;
        case '/profil/:id':
            return <ProfileClient id={params.id || ''} />;
        case '/create':
            return (
                <RequireAuth>
                    <CreateListingClient />
                </RequireAuth>
            );
        case '/list':
            return <RedirectTo href="/create" />;
        default:
            return null;
    }
}

function NotFoundPage() {
    const router = useRouter();

    return (
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Page introuvable</h1>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={() => router.push('/')}
                >
                    Retour a l'accueil
                </button>
            </div>
        </div>
    );
}

function LocaleShell({ children, locale }: { children: React.ReactNode; locale: string }) {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.documentElement.lang = locale;
        document.documentElement.dir = dir;
    }, [dir, locale]);

    return (
        <NextIntlClientProvider locale={locale}>
            <GoogleOAuthProvider clientId={googleClientId}>
                <ClientProviders>
                    <MaintenanceGuard>
                        <HeaderClient locale={locale} />
                        <main>{children}</main>
                        <Footer />
                    </MaintenanceGuard>
                </ClientProviders>
            </GoogleOAuthProvider>
        </NextIntlClientProvider>
    );
}

export default function App() {
    const routeState = useRouteState();
    const router = useRouter();

    useEffect(() => {
        if (routeState.hasLocalePrefix) {
            return;
        }

        router.replace(routeState.canonicalPath || '/');
    }, [routeState.canonicalPath, routeState.hasLocalePrefix, router]);

    if (!routeState.hasLocalePrefix) {
        return null;
    }

    const context: RouteRenderContext = {
        locale: routeState.locale,
        routePattern: routeState.routePattern,
        params: routeState.params,
    };

    const dashboardRendered = renderDashboardRoute(context);
    const adminRendered = renderAdminRoute(context);
    const mainRendered = renderMainRoute(context);

    const page = dashboardRendered || adminRendered || mainRendered || <NotFoundPage />;

    return (
        <LocaleShell locale={routeState.locale}>
            {page}
        </LocaleShell>
    );
}
