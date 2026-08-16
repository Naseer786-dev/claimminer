import { neon } from "@neondatabase/serverless"

async function seed() {
  const sql = neon(process.env.DATABASE_URL!)
  console.log("Seeding database...")

  const sampleRfps = [
    {
      title: "IT Support Services - VA Nationwide",
      agency: "Dept of Veterans Affairs",
      agencyLevel: "Federal",
      state: null,
      description: "Comprehensive IT support services including help desk, network administration, and system maintenance for VA facilities nationwide.",
      value: "$2.5M",
      dueDate: "2026-08-25",
      naics: "541511",
      matchScore: 96,
      category: "IT Services",
    },
    {
      title: "Cybersecurity Assessment - State of Texas",
      agency: "Texas Dept of Information Resources",
      agencyLevel: "State",
      state: "TX",
      description: "Comprehensive cybersecurity assessment and penetration testing for state agencies.",
      value: "$850K",
      dueDate: "2026-09-10",
      naics: "541512",
      matchScore: 92,
      category: "Cybersecurity",
    },
    {
      title: "Cloud Migration Services - City of Austin",
      agency: "City of Austin IT Dept",
      agencyLevel: "Local",
      state: "TX",
      description: "Migration of city services to cloud infrastructure including data migration and application modernization.",
      value: "$1.2M",
      dueDate: "2026-09-05",
      naics: "541511",
      matchScore: 88,
      category: "Cloud Services",
    },
    {
      title: "Network Infrastructure Upgrade - DHS",
      agency: "Department of Homeland Security",
      agencyLevel: "Federal",
      state: null,
      description: "Upgrade of network infrastructure including routers, switches, and firewalls across DHS facilities.",
      value: "$5.8M",
      dueDate: "2026-10-01",
      naics: "541513",
      matchScore: 85,
      category: "Network Infrastructure",
    },
    {
      title: "Software Development - California DMV",
      agency: "California DMV",
      agencyLevel: "State",
      state: "CA",
      description: "Custom software development for modernizing DMV online services and backend systems.",
      value: "$3.2M",
      dueDate: "2026-09-20",
      naics: "541511",
      matchScore: 90,
      category: "Software Development",
    },
    {
      title: "Data Analytics Platform - NYC",
      agency: "NYC Mayor's Office",
      agencyLevel: "Local",
      state: "NY",
      description: "Implementation of a city-wide data analytics platform for urban planning and public safety.",
      value: "$4.1M",
      dueDate: "2026-10-15",
      naics: "541511",
      matchScore: 78,
      category: "Data Analytics",
    },
  ]

  for (const rfp of sampleRfps) {
    await sql`
      INSERT INTO rfps (title, agency, agency_level, state, description, value, due_date, naics, match_score, category)
      VALUES (${rfp.title}, ${rfp.agency}, ${rfp.agencyLevel}, ${rfp.state}, ${rfp.description}, ${rfp.value}, ${rfp.dueDate}, ${rfp.naics}, ${rfp.matchScore}, ${rfp.category})
    `
  }

  console.log("Seeded", sampleRfps.length, "RFPs")
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})