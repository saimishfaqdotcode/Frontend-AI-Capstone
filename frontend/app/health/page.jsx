export default async function HealthPage() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch health-check data");
  }

  const data = await response.json();

  return (
    <main className="health-page">
      <h1>Health Check</h1>

      <p>Application is running successfully.</p>

      <div className="health-data">
        <p>
          <strong>Fetched Data:</strong>
        </p>

        <p>Title: {data.title}</p>
        <p>Completed: {data.completed ? "Yes" : "No"}</p>
      </div>
    </main>
  );
}