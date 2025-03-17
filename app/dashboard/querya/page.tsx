import { fetchQueryA } from '@/app/lib/data';

export default async function Page() {
  const timestamp = new Date().toString(); 
  
  const now = await fetchQueryA();

  return (

    <div>
      <p>Server Side Rendered. Cached. ie no dynamic = 'force-dynamic' {timestamp}</p>
      <p>Time is from page is {timestamp}</p>
      <p>Time is from db is {now}</p>
    </div>
  );
}

// Tell Next.js to render dynamically
// export const dynamic = 'force-dynamic';