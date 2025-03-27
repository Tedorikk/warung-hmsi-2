import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;

    // Komponen konten yang akan digunakan di kedua layout
    const AppearanceContent = () => (
        <div className="space-y-6">
            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
            <AppearanceTabs />
        </div>
    );

    // Render layout berdasarkan role user
    if (auth.user.roles && Array.isArray(auth.user.roles) && auth.user.roles.includes('admin')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance settings" />
                <SettingsLayout>
                    <AppearanceContent />
                </SettingsLayout>
            </AppLayout>
        );
    } else {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance settings" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-6 md:min-h-min">
                        <SettingsLayout>
                            <AppearanceContent />
                        </SettingsLayout>
                    </div>
                </div>
            </AppHeaderLayout>
        );
    }
}
