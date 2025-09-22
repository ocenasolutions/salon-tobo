"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, BarChart3, Star, ArrowRight, Package2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import HeroSection from "@/components/hero-section"

function Header() {
  return (
    <header className="border-b border-white/20 backdrop-blur-md bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="/HUSN.png"
              alt="HUSN Logo"
              width={44}
              height={44}
              className="rounded-full object-cover shadow-lg ring-2 ring-purple-200"
              priority
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-sm"></div>
          </div>
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HUSN
            </span>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Beauty Management</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
            Features
          </a>
          <a href="#testimonials" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
            Testimonials
          </a>
          <a href="#contact" className="text-slate-600 hover:text-purple-600 transition-colors font-medium">
            Contact
          </a>
          <Link href="/auth">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            >
              Get Started
            </Button>
          </Link>
        </nav>
        <div className="md:hidden">
          <Link href="/auth">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Package Management",
      description: "Create stunning service packages with flexible pricing for Basic and Premium offerings.",
      gradient: "from-purple-500 to-pink-500",
      bg: "from-white to-purple-50/50",
    },
    {
      icon: Users,
      title: "Smart Billing",
      description: "Generate professional invoices, track payments, and maintain comprehensive billing history.",
      gradient: "from-pink-500 to-rose-500",
      bg: "from-white to-pink-50/50",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Track performance, analyze trends, and make data-driven decisions to grow your business.",
      gradient: "from-indigo-500 to-blue-500",
      bg: "from-white to-indigo-50/50",
    },
    {
      icon: Package2,
      title: "Inventory Control",
      description: "Track products, manage expiry dates, and monitor payment status for all your inventory.",
      gradient: "from-emerald-500 to-teal-500",
      bg: "from-white to-emerald-50/50",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Powerful, intuitive tools designed specifically for beauty professionals who want to focus on what they do
            best
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br ${feature.bg} group`}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      <Header />
      <HeroSection />
      <FeaturesSection />

      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Trusted by Beauty{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Professionals
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how HUSN has transformed salons and spas across the country
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "HUSN completely transformed how we manage our salon. The package management system is intuitive and
                  our billing is now seamless. Our clients love the professional invoices!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold">MJ</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Maria Johnson</p>
                    <p className="text-sm text-slate-500">Luxe Hair Studio</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "The analytics dashboard gives us insights we never had before. We've increased our revenue by 30%
                  since implementing HUSN. The ROI has been incredible!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold">DK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">David Kim</p>
                    <p className="text-sm text-slate-500">Elite Beauty Lounge</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed italic">
                  "Professional, reliable, and exactly what our growing salon needed. The customer support is
                  exceptional and the platform is so easy to use!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold">SP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Sarah Parker</p>
                    <p className="text-sm text-slate-500">Glamour Salon & Spa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Salon?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of beauty professionals who have elevated their business with HUSN!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="text-xl px-8 py-6 bg-white text-purple-600 hover:bg-gray-50 shadow-xl group transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/HUSN.png"
                  alt="HUSN Logo"
                  width={44}
                  height={44}
                  className="rounded-full object-cover shadow-lg ring-2 ring-purple-400/30"
                />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    HUSN
                  </span>
                  <p className="text-xs text-slate-400">Beauty Management Platform</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md mb-6">
                Empowering beauty professionals with cutting-edge management tools designed for growth, efficiency, and
                exceptional client experiences.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a href="#features" className="hover:text-purple-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-purple-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/delete-account" className="hover:text-red-400 transition-colors text-red-300">
                    Delete Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-slate-400">&copy; 2024 HUSN Beauty Management Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
