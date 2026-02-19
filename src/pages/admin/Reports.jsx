function Reports() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-base-content">Reports & Analytics</h1>
      <p className="text-lg text-base-content/70">Platform insights and growth metrics</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Growth</h2>
            <p className="text-center py-12 text-6xl font-bold text-primary">+245%</p>
            <p className="text-center text-base-content/70">Since launch</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Application Trends</h2>
            <p className="text-center py-12">Charts coming soon 📊</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;