import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ar', 'fr'],
    defaultLocale: 'ar',
    pathnames: {
        '/': '/',
        '/rent': {
            fr: '/location',
            ar: '/location'
        },
        '/buy': {
            fr: '/achat',
            ar: '/achat'
        },
        '/rent/[slug]/[subSlug]': {
            fr: '/location/[slug]/[subSlug]',
            ar: '/location/[slug]/[subSlug]'
        },
        '/buy/[slug]/[subSlug]': {
            fr: '/achat/[slug]/[subSlug]',
            ar: '/achat/[slug]/[subSlug]'
        },
        // Legacy/Direct category routes
        '/rent/[slug]': {
            fr: '/location/[slug]',
            ar: '/location/[slug]'
        },
        '/buy/[slug]': {
            fr: '/achat/[slug]',
            ar: '/achat/[slug]'
        },
        '/tableau-de-bord': {
            fr: '/tableau-de-bord',
            ar: '/lawhat-tahakum'
        },
        '/login': {
            fr: '/connexion',
            ar: '/connexion'
        },
        '/register': {
            fr: '/inscription',
            ar: '/inscription'
        },
        '/forgot-password': {
            fr: '/mot-de-passe-oublie',
            ar: '/nisyan-kalimat-sir'
        },
        '/annonce/[slug]': {
            fr: '/annonce/[slug]',
            ar: '/annonce/[slug]'
        },
        '/profil/[id]': {
            fr: '/profil/[id]',
            ar: '/profil/[id]'
        },
        '/maintenance': {
            fr: '/maintenance',
            ar: '/maintenance'
        },
        '/admin': {
            fr: '/admin',
            ar: '/admin'
        },
        '/admin/settings': {
            fr: '/admin/parametres',
            ar: '/admin/parametres'
        },
        '/admin/maintenance': {
            fr: '/admin/maintenance',
            ar: '/admin/maintenance'
        },
        '/tableau-de-bord/annonces': {
            fr: '/tableau-de-bord/annonces',
            ar: '/tableau-de-bord/annonces'
        },
        '/tableau-de-bord/messages': {
            fr: '/tableau-de-bord/messages',
            ar: '/tableau-de-bord/messages'
        },
        '/tableau-de-bord/settings': {
            fr: '/tableau-de-bord/parametres',
            ar: '/tableau-de-bord/parametres'
        },
        '/tableau-de-bord/wallet': {
            fr: '/tableau-de-bord/portefeuille',
            ar: '/tableau-de-bord/portefeuille'
        },
        '/tableau-de-bord/wallet/history': {
            fr: '/tableau-de-bord/portefeuille/historique',
            ar: '/tableau-de-bord/portefeuille/sijil'
        },
        '/create': {
            fr: '/creer',
            ar: '/creer'
        }
    }
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
