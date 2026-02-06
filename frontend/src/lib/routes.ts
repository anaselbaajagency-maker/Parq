export const routes = {
    home: () => '/',
    rent: () => '/rent',
    buy: () => '/buy',
    category: (type: 'rent' | 'buy', slug: string) => {
        const basePath = type === 'rent' ? '/rent' : '/buy';
        if (slug === 'all') return basePath;
        return `${basePath}/${slug}`;
    },
    listing: (slug: string) => `/annonce/${slug}`,
    login: () => '/login',
    register: () => '/register',
};
