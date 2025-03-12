export default function Page() {
  const timestamp = new Date().toString(); 
  
  return (
    <div>
      <p>Server Side Rendered. Dynamic. Not cached. {timestamp}</p>
    </div>
  );
}

// Tell Next.js to render dynamically
export const dynamic = 'force-dynamic';