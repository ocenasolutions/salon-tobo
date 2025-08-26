"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <Image
                src="/HUSN.png"
                alt="HUSN Logo"
                width={140}
                height={140}
                className="rounded-full object-cover shadow-2xl ring-4 ring-white/50 relative z-10 group-hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute top-2 right-2 z-20">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-800 leading-tight">
              Transform Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Beauty Business
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"></div>
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-4xl mx-auto">
              Streamline operations, delight clients, and grow your salon with our comprehensive management platform
              designed for modern beauty professionals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth">
              <Button
                size="lg"
                className="text-xl px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl group transform hover:scale-105 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Loved by 1000+ salons</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span>Industry leading</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Easy setup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
