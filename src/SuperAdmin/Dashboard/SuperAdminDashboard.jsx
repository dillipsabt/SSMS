import { Building2, CircleCheck, Clock3, UsersRound } from "lucide-react";

const stats = [
  ["Total Schools", "04", Building2],
  ["Active Tenants", "04", CircleCheck],
  ["Trial Accounts", "01", Clock3],
  ["Total Students", "4,000", UsersRound]
];

export default function SuperAdminDashboard() {
  return (
    <div className="sa-page">
    <h1>Dashboard</h1>
    <p className="sa-breadcrumb">Home / Dashboard</p>
    <div className="sa-dashboard-grid">{stats.map((stat) => {
      const StatIcon = stat[2]; return <article className="sa-stat" key={stat[0]}><span><StatIcon size={24} /></span>
        <div>
          <p>{stat[0]}</p>
          <strong>{stat[1]}</strong>
        </div></article>;
    })}</div>
    <section className="sa-card sa-dashboard-welcome">
      <h2>Super Admin Dashboard</h2><p>Select <strong>School Details</strong> from the sidebar to manage school information.</p>
    </section>
    </div>
  );
}
