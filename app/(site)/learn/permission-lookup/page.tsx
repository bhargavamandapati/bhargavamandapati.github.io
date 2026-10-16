import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { PermissionLookup } from '@/components/tools/permission-lookup'
import { carPermissions } from '@/lib/vehicle-properties'
import { site } from '@/data/site'

const total = Object.keys(carPermissions).length

export const metadata: Metadata = {
  title: 'Car API permission lookup',
  description: `Every one of the ${total} android.car.permission.* strings, with its protection level and exactly which vehicle properties it grants read or write access to.`,
  alternates: { canonical: '/learn/permission-lookup/' },
  openGraph: {
    type: 'website',
    title: `Car API permission lookup · ${site.name}`,
    description: `Which permission a property needs, and what privilege level it requires — all ${total} of them.`,
    url: `${site.url}/learn/permission-lookup/`,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Car API permission lookup' }],
  },
}

export default function PermissionLookupPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learn AAOS · Reference"
        title="Car API permission lookup"
        description="Search by property to find the permission it needs, or by permission to find which properties it gates — with the exact protection level manifest merger will enforce."
      >
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck aria-hidden className="size-4 text-accent" />
            {total} permissions
          </span>
          <span>read and write access, separately</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/learn/vehicle-properties/"
            className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-line-strong hover:bg-surface"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Property reference
          </Link>
        </div>
      </PageHeader>

      <div className="container-page py-10 md:py-14">
        <div className="max-w-3xl">
          <PermissionLookup />
        </div>
      </div>
    </>
  )
}
