// /app/dashboard/layout.tsx
// `use client`;

import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout2({ children }: { children: React.ReactNode }) {
    return (
        // on mobile stacks vertically (flex-col)
        // on md: and up it shows side by side (flex-row)
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            {/* left hand column */}
            {/* fixed sidebar of 64 on medium and up */}
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>

            {/* right hand column containing the page content */}
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}