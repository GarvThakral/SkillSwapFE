// src/pages/About.tsx
import React from "react";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-6">About SkillSwap</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're building a world where knowledge flows freely, and everyone has access to the skills they need to grow.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              SkillSwap was born from a simple idea: what if we could create a platform where people could exchange
              knowledge directly, without money as a barrier?
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Our mission is to democratize learning by creating a global skill exchange network where everyone can both
              teach and learn, regardless of their financial situation.
            </p>
            <div className="flex items-center space-x-4 text-lg text-gray-700 font-medium">
              <Stat count="10k+" label="Users" color="purple" />
              <Stat count="5k+" label="Skills" color="blue" />
              <Stat count="20k+" label="Exchanges" color="teal" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">How Our Token System Works</h3>
            <p className="text-gray-600 mb-6">Instead of using money, SkillSwap operates on a token-based system:</p>
            <ul className="space-y-4">
              <Step number="1" text="Earn tokens by teaching others your skills" />
              <Step number="2" text="Spend tokens to learn new skills from others" />
              <Step number="3" text="Set your own token rates based on your expertise" />
              <Step number="4" text="Everyone starts with 100 tokens to begin their journey" />
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 relative">
            Meet Our Team
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-purple-500 rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Member initials="JD" name="Jane Doe" role="Co-Founder & CEO" color="purple">
              Passionate about making education accessible to everyone, regardless of financial background.
            </Member>
            <Member initials="JS" name="John Smith" role="Co-Founder & CTO" color="blue">
              Tech enthusiast with a vision to build platforms that connect people and knowledge.
            </Member>
            <Member initials="AL" name="Amy Lee" role="Head of Community" color="teal">
              Community builder focused on creating meaningful connections between learners and teachers.
            </Member>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Skill Exchange Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of others who are already teaching, learning, and growing together.
          </p>
          <Link to="/">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold transition-all shadow-lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Reusable sub-components, all in this file so you don’t need to import
   anything else.
─────────────────────────────────────────────────────────────────────────────*/

// Simple Button
function Button({ children, className = "", onClick }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <button onClick={onClick} className={`inline-block font-medium ${className}`}>
      {children}
    </button>
  );
}

// Statistic bubble (Users, Skills, Exchanges)
function Stat({
  count,
  label,
  color,
}: {
  count: string;
  label: string;
  color: "purple" | "blue" | "teal";
}) {
  const bg = color === "purple" ? "bg-purple-100" : color === "blue" ? "bg-blue-100" : "bg-teal-100";
  const text = color === "purple" ? "text-purple-600" : color === "blue" ? "text-blue-600" : "text-teal-600";
  return (
    <div className="flex items-center">
      <div className={`${bg} ${text} w-10 h-10 rounded-full flex items-center justify-center mr-2 font-bold`}>
        {count}
      </div>
      <span>{label}</span>
    </div>
  );
}

// Numbered step in token system
function Step({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex items-start">
      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-1 mr-3 font-bold text-purple-600">
        {number}
      </div>
      <p className="text-gray-700">{text}</p>
    </li>
  );
}

// Team Member card
function Member({
  initials,
  name,
  role,
  color,
  children,
}: {
  initials: string;
  name: string;
  role: string;
  color: "purple" | "blue" | "teal";
  children: React.ReactNode;
}) {
  const bgGradient =
    color === "purple"
      ? "bg-gradient-to-b from-purple-50 to-white"
      : color === "blue"
      ? "bg-gradient-to-b from-blue-50 to-white"
      : "bg-gradient-to-b from-teal-50 to-white";
  const circleBg = color === "purple" ? "bg-purple-200 text-purple-600" : color === "blue" ? "bg-blue-200 text-blue-600" : "bg-teal-200 text-teal-600";
  const borderColor = color === "purple" ? "border-purple-500" : color === "blue" ? "border-blue-500" : "";
  return (
    <div className={`${bgGradient} p-6 rounded-xl shadow-lg text-center group hover:shadow-xl transition-all`}>
      <div className={`w-24 h-24 rounded-full ${circleBg} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform text-3xl font-bold`}>
        {initials}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
      <p className={`${color === "purple" ? "text-purple-600" : color === "blue" ? "text-blue-600" : "text-teal-600"} font-medium mb-3`}>
        {role}
      </p>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}
