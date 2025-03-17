import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    //  
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log("  ");
            console.log("auth callback start");
            const currentUrl = nextUrl.pathname;
            console.log(" current url is - ", currentUrl);
 
            const isLoggedIn = !!auth?.user;
            console.log('isLoggedIn', isLoggedIn);
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            console.log('isOnDashboard', isOnDashboard);

            // only the dashboard route is protected
            if (isOnDashboard) {
                if (isLoggedIn) return true; // logged in so continue with request pipeline
                else return false; // On dashbaord and not logged in so redirect unauthenticated users to login page
            }

            // any other route - lets redirect to the dashboard
            // eg from /login page, /seed
            // actually this is bad as even /asdfsadf will redirect to dashboard
            //   if (isLoggedIn) {
            //     const currentUrl = nextUrl.pathname;
            //     console.log(`  **auth.config.ts callback - ${currentUrl} - logged in so redirecting to dashboard`);
            //     return Response.redirect(new URL('/dashboard', nextUrl));
            //   }


           // keep going with request pipeline?
            console.log(" keep going with request pipeline - ", currentUrl);
 
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;