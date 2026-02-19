import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";

function ApplicantCard({ applicant, onViewProfile }) {
  const { name, role, skills = [], status = "Pending", resumeUrl } = applicant;

  const statusVariant = {
    Pending: "warning",
    Interview: "success",
    Rejected: "error",
    Offered: "primary",
  }[status] || "ghost";

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(applicant);
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title">{name}</h3>
            <p className="text-base-content/70">{role}</p>
          </div>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {skills.slice(0, 5).map((skill, i) => (
            <Badge key={i} variant="ghost" size="sm">
              {skill}
            </Badge>
          ))}
          {skills.length > 5 && <Badge variant="ghost" size="sm">+{skills.length - 5} more</Badge>}
        </div>

        <div className="card-actions mt-6 flex gap-3">
          <Button variant="outline" size="sm" onClick={handleViewProfile}>
            View Profile
          </Button>
          {resumeUrl && (
            <Button variant="ghost" size="sm" as="a" href={resumeUrl} target="_blank">
              Download Resume 📄
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicantCard;