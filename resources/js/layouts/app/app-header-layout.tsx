import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import ToastHandler from '@/components/ToastHandler';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <Toaster />
            <ToastHandler />
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
            <Footer />
        </AppShell>
    );
}

function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 mt-8 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold mb-2">Kelompok Gacor</h3>
                        <ul className="text-sm">
                            <li><p className="text-sm text-gray-600 dark:text-gray-300">
                                Tedrik Stepanus (H1101231027)
                            </p></li>
                            <li><p className="text-sm text-gray-600 dark:text-gray-300">
                                Hisyam Al Husaini (H1101231054)
                            </p></li>
                            <li><p className="text-sm text-gray-600 dark:text-gray-300">
                                Aura Rizkiatul Arsyi (H1101231003)
                            </p></li>
                            <li><p className="text-sm text-gray-600 dark:text-gray-300">
                                Aulia Dwi Jumarni (H1101231017)
                            </p></li>
                        </ul>
                        
                    </div>
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        
                    </div>
                    <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <Button variant="outline" size="icon">
                                <a href='https://www.instagram.com/tedorikkk/' target="_blank" rel="noreferrer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
                    © 2025 Kelompok Gacor Sejahtera. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
