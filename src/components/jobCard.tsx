
import { Clock, User, Award, ArrowRight } from "lucide-react";

interface JobCardProps {
  id: number;
  createdAt: string;
  updatedAt: string;
  requesterId: number;
  tokenPrice: number;
  skillId: number;
  status: string;
  description: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
  skill: {
    id: number;
    title: string;
    description: string;
    proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | string;
  };
  clickFunction: (path: string) => void;
}

export function JobCard(props: JobCardProps) {
  // Format ISO date to "Mon DD, YYYY"
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Map proficiency to Tailwind badge colors
  function getProficiencyColor(level: string) {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-700";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-700";
      case "ADVANCED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  // Map status to Tailwind badge colors
  function getStatusColor(status: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div
      onClick={() => props.clickFunction(`/service/${props.id}`)}
      className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Top Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title & Status */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
            {props.skill.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              props.status
            )}`}
          >
            {props.status}
          </span>
        </div>

        {/* User & Proficiency */}
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <User className="w-4 h-4 mr-1" />
          <span>{props.user.username}</span>
          <span className="mx-2">•</span>
          <Award className="w-4 h-4 mr-1" />
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${getProficiencyColor(
              props.skill.proficiencyLevel
            )}`}
          >
            {props.skill.proficiencyLevel.charAt(0) +
              props.skill.proficiencyLevel.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {props.description}
        </p>

        {/* Posted Date */}
        <div className="flex items-center text-sm text-gray-500 mt-auto">
          <Clock className="w-4 h-4 mr-1" />
          <span>Posted on {formatDate(props.createdAt)}</span>
        </div>
      </div>

      {/* Footer with Token Price & Button */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center">
          <img src="/token.svg" alt="Token" className="w-5 h-5 mr-1" />
          <span className="font-bold text-purple-700">
            {props.tokenPrice}
          </span>
          <span className="text-gray-600 text-sm ml-1">tokens</span>
        </div>
        <button className="flex items-center text-purple-600 font-medium hover:text-purple-700 transition-colors">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
