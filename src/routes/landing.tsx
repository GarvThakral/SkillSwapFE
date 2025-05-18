import { Link } from "react-router-dom";
import { Button } from "../components/Button.tsx";
import { RightArrowIcon } from "../components/icons/RightArrowIcon.tsx";
import { VideoCallIcon } from "../components/icons/VideoCallIcon";
import { MessageIcon } from "../components/icons/MessageIcon.tsx";
import { PersonIcon } from "../components/icons/PersonIcon";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl -z-10" />
        <div className="flex flex-col items-center py-16 px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Exchange Knowledge, No Money Needed!
          </h1>
          <h2 className="text-3xl font-bold mb-6 text-gray-700">
            Trade Skills, Grow Together!
          </h2>
          <p className="text-lg max-w-3xl mb-8 text-gray-600 leading-relaxed">
            Why pay when you can trade? SkillSwap is a platform where you can
            exchange skills with others—teach what you know, learn what you
            don't. Whether it's coding for design, music for marketing, or any
            skill under the sun, connect with like-minded people and grow your
            expertise in a barter-style system.
          </p>
          <div className="flex gap-4 mt-4">
            <Button
              text="Get started"
              icon={<RightArrowIcon />}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-purple-300/50"
            />
            <Link to="about">
              <Button
                text="Learn More"
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="flex flex-col items-center space-y-10 w-full max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 relative">
          How SkillTrade Works
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-purple-500 rounded-full"></span>
        </h2>

        <div className="flex flex-wrap justify-center gap-8 w-full mt-8">
          {/* Video Calls */}
          <FeatureCard
            icon={<VideoCallIcon />}
            title="Video Calls"
            color="blue"
            description="Connect face-to-face and learn in real-time with high-quality video sessions."
          />
          {/* Messaging */}
          <FeatureCard
            icon={<MessageIcon />}
            title="Messaging"
            color="purple"
            description="Chat, plan, and collaborate seamlessly with our intuitive messaging system."
          />
          {/* Skill Exchange */}
          <FeatureCard
            icon={<PersonIcon />}
            title="Skill Exchange"
            color="teal"
            description="Schedule sessions and exchange skills with our token-based system."
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 relative">
          Success Stories
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-teal-500 rounded-full"></span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Testimonial
            text="SkillSwap changed my life! I learned web development by teaching graphic design."
            initials="JD"
            name="Jane Doe"
            role="Graphic Designer"
            color="purple"
          />
          <Testimonial
            text="I was able to learn three new languages by teaching programming."
            initials="MS"
            name="Mike Smith"
            role="Software Engineer"
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}

type FeatureColor = "blue" | "purple" | "teal";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: FeatureColor;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorMap: Record<FeatureColor, string> = {
    blue: "blue-500",
    purple: "purple-500",
    teal: "teal-500",
  };

  const bgColor: Record<FeatureColor, string> = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    teal: "bg-teal-100 text-teal-600",
  };

  return (
    <div
      className={`w-80 h-64 rounded-2xl flex flex-col items-center justify-center p-6 bg-white shadow-xl hover:shadow-2xl transition-all border-t-4 border-${colorMap[color]} group`}
    >
      <div
        className={`w-20 h-20 rounded-full ${bgColor[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <span className="font-bold text-xl text-gray-800 mb-2">{title}</span>
      <span className="max-w-52 text-center text-gray-600">{description}</span>
    </div>
  );
}

type TestimonialColor = "purple" | "blue";

interface TestimonialProps {
  text: string;
  initials: string;
  name: string;
  role: string;
  color: TestimonialColor;
}

function Testimonial({ text, initials, name, role, color }: TestimonialProps) {
  const bgColor: Record<TestimonialColor, string> = {
    purple: "bg-purple-200 text-purple-700 border-purple-500",
    blue: "bg-blue-200 text-blue-700 border-blue-500",
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${bgColor[color]}`}>
      <p className="text-gray-600 italic mb-4">"{text}"</p>
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${bgColor}`}
        >
          <span className="font-bold">{initials}</span>
        </div>
        <div>
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
