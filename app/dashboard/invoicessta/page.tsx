export default function Page() {
    const timestamp = new Date().toString(); 
    return <p>Server Side Rendered. Static. Cached: {timestamp}</p>;
  }