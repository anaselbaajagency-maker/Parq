'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    fetchSettings,
    fetchCategories,
    authFetch,
    Settings,
    Category,
    API_BASE_URL
} from '@/lib/api';
import { useAlert } from '@/context/AlertContext';
import styles from './settings.module.css';
import {
    Save,
    Check,
    X,
    Layout,
    Type,
    Globe,
    PanelTop as HeaderIcon,
    CreditCard,
    Info,
} from 'lucide-react';

export default function AdminSettingsPage() {
    const params = useParams();
    const locale = params.locale as string;

    const [settings, setSettings] = useState<Settings | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Local form state
    const [homepageCategories, setHomepageCategories] = useState<string[]>([]);
    const [listingsCount, setListingsCount] = useState(6);
    const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(true);
    const [showLoginButton, setShowLoginButton] = useState(true);
    const [showSocialLinks, setShowSocialLinks] = useState(true);
    const [copyrightText, setCopyrightText] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const [settingsData, categoriesData] = await Promise.all([
                    fetchSettings(),
                    fetchCategories(),
                ]);

                setSettings(settingsData);
                setCategories(categoriesData);

                if (settingsData) {
                    setHomepageCategories(settingsData.homepage_categories || []);
                    setListingsCount(Number(settingsData.homepage_listings_count || 6));
                    setShowLanguageSwitcher(settingsData.header_show_language_switcher ?? true);
                    setShowLoginButton(settingsData.header_show_login_button ?? true);
                    setShowSocialLinks(settingsData.footer_show_social_links === true || settingsData.footer_show_social_links === '1' || settingsData.footer_show_social_links === 1);
                    setCopyrightText(settingsData.footer_copyright_text || '');
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const toggleCategory = (categoryId: string) => {
        setHomepageCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const { showAlert } = useAlert();

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            // We do NOT send homepage_categories here as it's managed by FeaturedCategoriesPage
            // and requires complex array handling which SettingController (bulk) expects strings for.
            const settingsToUpdate = {
                homepage_listings_count: listingsCount.toString(),
                header_show_language_switcher: showLanguageSwitcher ? '1' : '0',
                header_show_login_button: showLoginButton ? '1' : '0',
                footer_show_social_links: showSocialLinks ? '1' : '0',
                footer_copyright_text: copyrightText,
            };

            const response = await authFetch(`${API_BASE_URL}/admin/settings/bulk`, {
                method: 'POST',
                body: JSON.stringify(settingsToUpdate),
            });

            if (response.ok) {
                showAlert('success', 'Paramètres enregistrés avec succès.', 'Succès');
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Save settings error:', error);
            showAlert('error', "Échec de l'enregistrement.", 'Erreur');
        } finally {
            setSaving(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className="animate-pulse space-y-8">
                    <div className="h-10 w-64 bg-gray-200 rounded"></div>
                    <div className="h-48 bg-gray-100 rounded-2xl"></div>
                    <div className="h-64 bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Manage global configurations, homepage options, and platform appearance.</p>
            </header>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    {message.text}
                </div>
            )}

            <div className="space-y-8">
                {/* Homepage Categories Card Hidden as per request */}



                {/* Header & Logo */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <HeaderIcon size={20} />
                        Display & Header
                    </h2>
                    <p className={styles.sectionDesc}>
                        Control which interactive elements are visible in the top navigation bar.
                    </p>

                    <div className="divide-y divide-gray-50">
                        <label className={styles.toggleLabel}>
                            <span>Show Language Switcher (Globe)</span>
                            <div className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={showLanguageSwitcher}
                                    onChange={(e) => setShowLanguageSwitcher(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </div>
                        </label>

                        <label className={styles.toggleLabel}>
                            <span>Show Login & Register Buttons</span>
                            <div className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={showLoginButton}
                                    onChange={(e) => setShowLoginButton(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Footer & Branding */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        <CreditCard size={20} />
                        Footer & Branding
                    </h2>
                    <p className={styles.sectionDesc}>
                        Update copyright information and select common elements for the site footer.
                    </p>

                    <label className={styles.toggleLabel}>
                        <div className="flex flex-col">
                            <span>Enable Social Media Profiles</span>
                            <span className="text-[10px] text-gray-400 font-normal mt-0.5">Link icons will appear in footer columns</span>
                        </div>
                        <div className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={showSocialLinks}
                                onChange={(e) => setShowSocialLinks(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </div>
                    </label>

                    <div className={`${styles.field} mt-6`}>
                        <label className={styles.label}>Copyright Notice</label>
                        <input
                            type="text"
                            value={copyrightText}
                            onChange={(e) => setCopyrightText(e.target.value)}
                            className={styles.input}
                            placeholder="e.g. © 2026 Parq.ma. All rights reserved."
                        />
                        <div className="mt-2 flex items-start gap-2 text-[11px] text-gray-400 italic">
                            <Info size={12} className="mt-0.5 shrink-0" />
                            Use {new Date().getFullYear()} placeholder if needed.
                        </div>
                    </div>
                </section>
            </div>

            {/* Sticky Action Footer */}
            <div className={styles.actions}>
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save size={20} />}
                    {saving ? 'Processing...' : 'Save All Changes'}
                </button>
            </div>
        </div>
    );
}
