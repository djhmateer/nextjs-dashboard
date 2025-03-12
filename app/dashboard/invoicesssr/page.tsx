// This makes it server-rendered
export default function Page() {
  // Using server-side only data like cookies or headers
  // const data = getSampleData();
  // const timestamp = new Date().toISOString(); // Different for each request
  const timestamp = new Date().toString(); // Different for each request
  
  return (
    <div>
      <h1>Invoices</h1>
      <p>Generated at: {timestamp}</p>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}

// Tell Next.js to render dynamically
export const dynamic = 'force-dynamic';