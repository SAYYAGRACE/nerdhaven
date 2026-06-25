"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Network,
  Users,
  Calendar,
  MapPin,
  Clock,
  UserPlus,
  ArrowRight,
  Circle,
  BookOpen,
  Globe,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const studyGroups = [
  { id: "g1", name: "Advanced Quantum Mechanics", members: 9, next: "Today, 4 PM", membersOnline: 3 },
  { id: "g2", name: "Econometrics with R", members: 12, next: "Tomorrow, 10 AM", membersOnline: 5 },
  { id: "g3", name: "ML Research Group", members: 18, next: "Wed, 2 PM", membersOnline: 7 },
  { id: "g4", name: "Organic Chemistry Lab Prep", members: 6, next: "Thu, 1 PM", membersOnline: 2 },
]

const collaborators = [
  { id: "c1", name: "Dr. Adebayo K.", field: "Machine Learning", institution: "University of Lagos", mutual: 4 },
  { id: "c2", name: "Prof. Nwachukwu C.", field: "Genomics", institution: "Stanford University", mutual: 2 },
  { id: "c3", name: "Dr. Okonkwo E.", field: "Renewable Energy", institution: "MIT", mutual: 6 },
  { id: "c4", name: "Prof. Bello A.", field: "Public Health", institution: "Oxford University", mutual: 3 },
]

const seminars = [
  { id: "s1", title: "Quantum Computing: Current Frontiers", speaker: "Dr. Sarah Chen", date: "Jun 28, 2 PM", location: "Online via Zoom" },
  { id: "s2", title: "Climate Modeling with Neural PDEs", speaker: "Prof. Michael Torres", date: "Jul 2, 11 AM", location: "Physics Lecture Hall" },
  { id: "s3", title: "Ethics in AI Research", speaker: "Dr. Amara Okafor", date: "Jul 5, 3 PM", location: "Online via Teams" },
  { id: "s4", title: "Grant Writing Workshop", speaker: "Research Office", date: "Jul 8, 10 AM", location: "Library Conference Room" },
]

export default function AcademicNetwork() {
  const [joining, setJoining] = useState<string | null>(null)
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleJoin = (id: string) => {
    setJoining(id)
    setTimeout(() => {
      setJoining(null)
      toast.success("Joined study group")
    }, 800)
  }

  const handleConnect = (id: string) => {
    setConnecting(id)
    setTimeout(() => {
      setConnecting(null)
      toast.success("Connection request sent")
    }, 800)
  }

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 p-3 shadow-lg">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Academic Network</h1>
            <p className="mt-0.5 text-slate-400">Connect with peers, join study groups, and discover research collaborators</p>
          </div>
        </motion.div>

        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Study Groups</h2>
          <div className="space-y-3">
            {studyGroups.map((group) => (
              <div key={group.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Users className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{group.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{group.members} members</span>
                        <span className="flex items-center gap-1">
                          <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                          {group.membersOnline} online
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-400">Next session</p>
                      <p className="text-sm font-medium text-slate-700">{group.next}</p>
                    </div>
                    <button
                      onClick={() => handleJoin(group.id)}
                      disabled={joining === group.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                    >
                      {joining === group.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Suggested Collaborators</h2>
            <div className="space-y-3">
              {collaborators.map((collab) => (
                <div key={collab.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800">{collab.name}</h3>
                        <p className="text-xs text-slate-500">{collab.field}</p>
                        <p className="text-xs text-slate-400">{collab.institution}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          <span className="font-medium text-slate-600">{collab.mutual}</span> mutual connections
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(collab.id)}
                      disabled={connecting === collab.id}
                      className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      {connecting === collab.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        "Connect"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Upcoming Seminars & Meetings</h2>
            <div className="space-y-3">
              {seminars.map((seminar) => (
                <div key={seminar.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-slate-100 p-2.5">
                      <Calendar className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800">{seminar.title}</h3>
                      <p className="text-xs text-slate-500">{seminar.speaker}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {seminar.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {seminar.location}
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
