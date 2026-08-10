function StatCard({ icon, color, value, label }) {
  return (
    <div className="card stat-card h-100">
      <div className="card-body">
        <div className={`stat-icon ${color}`}>{icon}</div>
        <div>
          <div className="stat-value text-dark">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default StatCard;