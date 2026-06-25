"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  FlaskConical,
  Beaker,
  Users,
  BookOpen,
  FileText,
  Plus,
  Loader2,
  BarChart3,
  Clock,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import toast from "react-hot-toast"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const researchTopics = [
  { name: "Quantum Computing", icon: Beaker, papers: 12, color: "bg-purple-100 text-purple-600" },
  { name: "ML in Healthcare", icon: FlaskConical, papers: 8, color: "bg-blue-100 text-blue-600" },
  { name: "Renewable Energy", icon: Beaker, papers: 15, color: "bg-green-100 text-green-600" },
  { name: "Computational Biology", icon: FlaskConical, papers: 6, color: "bg-teal-100 text-teal-600" },
  { name: "Natural Language Processing", icon: BookOpen, papers: 10, color: "bg-indigo-100 text-indigo-600" },
  { name: "Robotics & Automation", icon: Beaker, papers: 7, color: "bg-amber-100 text-amber-600" },
]

const publications = [
  { id: 1, title: "Neural Network Approaches in African Language Processing", authors: "Dr. Okafor et al.", journal: "Journal of AI Research", date: "2 days ago" },
  { id: 2, title: "Economic Impacts of Mobile Money in Sub-Saharan Africa", authors: "Adebayo, K. et al.", journal: "African Economic Review", date: "1 week ago" },
  { id: 3, title: "Low-Cost Water Filtration Using Biodegradable Polymers", authors: "Nwachukwu, C. et al.", journal: "Nature Sustainability", date: "2 weeks ago" },
]

export default function ResearchPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => { setTimeout(() => setLoading(false), 300) }, [])

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-600" /></div>

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="mx-auto max-w-7xl">
      <motion.div variants={stagger.item} className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-700 p-3">
            <FlaskConical className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Research Hub</h1>
            <p className="text-sm text-gray-500">Explore research topics and publications</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600">
          <Plus className="h-4 w-4" /> New Research
        </button>
      </motion.div>

      <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Research", value: "24", icon: Beaker, color: "text-purple-500" },
          { label: "Papers Published", value: "89", icon: FileText, color: "text-blue-500" },
          { label: "Collaborations", value: "16", icon: Users, color: "text-green-500" },
          { label: "Citations", value: "1,247", icon: BarChart3, color: "text-indigo-500" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm text-gray-500">{s.label}</span><s.icon className={cn("h-5 w-5", s.color)} /></div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={stagger.item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Research Focus Areas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {researchTopics.map(topic => (
            <div key={topic.name} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow">
              <div className={cn("mb-3 inline-flex rounded-lg p-2.5", topic.color)}><topic.icon className="h-5 w-5" /></div>
              <h3 className="font-semibold text-gray-900">{topic.name}</h3>
              <p className="mt-1 text-sm text-gray-400">{topic.papers} active papers</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={stagger.item} className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Publications</h2>
        <div className="space-y-3">
          {publications.map(pub => (
            <div key={pub.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-900">{pub.title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{pub.authors} &middot; {pub.journal}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pub.date}</span>
                    <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800">
                      <ExternalLink className="h-3 w-3" /> View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
