import { motion } from "framer-motion"
import {
  Video,
  MessageCircle,
  Code,
  Music2,
  Palette,
  Languages,
  Coins,
  ArrowRight,
  Users,
  Globe,
  Clock,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/buttons"

export default function AboutPage() {

  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "Live Video Sessions",
      description: "Connect face-to-face with skilled mentors through our HD video calling feature",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Instant Messaging",
      description: "Coordinate sessions and discuss skills with our built-in chat system",
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Token Economy",
      description: "Earn and spend tokens teaching or learning new skills. Easy integration with RazorPay",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Countries", icon: <Globe className="h-6 w-6" /> },
    { number: "100,000+", label: "Hours Taught", icon: <Clock className="h-6 w-6" /> },
  ]

  const popularSkills = [
    { icon: <Code className="h-6 w-6" />, name: "Programming" },
    { icon: <Music2 className="h-6 w-6" />, name: "Music" },
    { icon: <Palette className="h-6 w-6" />, name: "Art" },
    { icon: <Languages className="h-6 w-6" />, name: "Languages" },
  ]

  const testimonials = [
    {
      quote: "SkillSwap helped me learn guitar while teaching Python. The video quality is amazing!",
      author: "Alex Chen",
      role: "Software Developer",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote: "The token system makes it easy to balance teaching and learning. Great community!",
      author: "Sarah Miller",
      role: "Music Teacher",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      quote: "I've learned three new languages by teaching art. This platform is revolutionary!",
      author: "Marco Rossi",
      role: "Digital Artist",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-white pt-16 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Share Skills,
                <br />
                Grow Together
              </h1>
              <p className="mt-4 text-lg text-gray-600 md:text-xl">
                Welcome to SkillSwap, where knowledge meets opportunity. Trade your expertise, learn new skills, and be
                part of a growing community of lifelong learners.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center justify-center " >
                  <Button style = "Primary" text = {"Start Learning"} icon = {<ArrowRight className="ml-2 h-4 w-4" />}/>
                </Link>
                <Button style = "Secondary" text = "Watch Demo"/>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-200">
                <section className="py-24 bg-gray-100">
                  <div className="container mx-auto px-4 md:px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                    <div className="grid gap-8 md:grid-cols-3">
                      <div className="p-6 bg-white rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-2">1. Create an Account</h3>
                        <p className="text-gray-600">Sign up and set up your profile with the skills you want to learn or teach.</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-2">2. Find a Match</h3>
                        <p className="text-gray-600">Browse skills and connect with users who match your learning or teaching needs.</p>
                      </div>
                      <div className="p-6 bg-white rounded-xl shadow">
                        <h3 className="text-xl font-semibold mb-2">3. Start Learning</h3>
                        <p className="text-gray-600">Use video sessions and messaging to exchange knowledge and grow together.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="p-3 rounded-full bg-indigo-100">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center space-y-2 p-6 bg-gray-100 rounded-xl"
              >
                {stat.icon}
                <span className="text-3xl font-bold">{stat.number}</span>
                <span className="text-gray-600">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Skills</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {popularSkills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl"
              >
                {skill.icon}
                <span className="font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-gray-100 rounded-xl space-y-4"
              >
                <p className="italic">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="rounded-full w-12 h-12"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold">Ready to Start Your Learning Journey?</h2>
            <p className="text-white max-w-[600px]">
              Join thousands of users who are already sharing skills and growing together. Get started today and unlock
              your potential.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="inline-flex items-center justify-center " >
                <Button style = "Primary" text = {"Create Account"} icon = {<ArrowRight className="ml-2 h-4 w-4" />}/>
              </Link>
              <Button style = "Secondary" text = "Browse Skills"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}