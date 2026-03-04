import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActionCard = ({
  to,
  title,
  desc,
  icon,
  bg,
}: {
  to: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  bg: string;
}) => {
  return (
    <Link
      to={to}
      className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition border border-gray-100 group"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`bg-${bg}-100 p-4 rounded-full group-hover:bg-${bg}-200 transition`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
      <div className={`flex items-center text-${bg}-600 font-medium`}>
        Go <ChevronRight size={18} className="ml-1" />
      </div>
    </Link>
  );
};

export default QuickActionCard;
