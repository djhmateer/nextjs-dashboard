// This makes it server-rendered
export default function Page() {
  const timestamp = new Date().toString(); 
  
  return (
    <div>
      <h1>Invoices</h1>
      <p>Generated at: {timestamp}</p>
    </div>
  );
}

// Tell Next.js to render dynamically
// export const dynamic = 'force-dynamic';