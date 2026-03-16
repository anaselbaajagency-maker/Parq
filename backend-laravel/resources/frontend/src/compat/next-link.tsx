import React from 'react';
import { AppLink } from './spa-router';

interface NextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    locale?: string;
    replace?: boolean;
}

export default function NextLink({ href, locale, replace, ...props }: NextLinkProps) {
    return <AppLink href={href} locale={locale} replace={replace} {...props} />;
}
