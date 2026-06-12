import React from 'react'
import Image from 'next/image'
import { db } from '@/lib/db'
import { Leaf, Mail, Phone } from 'lucide-react'

export const metadata = {
  title: 'About Us | Calendula Herbs',
  description: 'Learn about our history, our farm, and the team behind Calendula Herbs.',
}

export default async function AboutPage() {
  const teamMembers = await db.teamMember.findMany({
    where: { isActive: true },
    include: { photo: true, contacts: true },
    orderBy: { order: 'asc' }
  })

  const board = teamMembers.filter(m => m.memberType === 'BOARD')
  const team = teamMembers.filter(m => m.memberType === 'TEAM')

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero */}
      <section className="bg-neutral-900 pt-32 pb-24 text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">About Calendula Herbs</h1>
          <p className="text-xl text-neutral-300 font-light leading-relaxed">
            Cultivating purity and delivering excellence. We are dedicated to providing the world with the finest organic herbs, rooted in generations of agricultural expertise.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] relative rounded-3xl overflow-hidden bg-neutral-100 flex items-center justify-center">
               <Leaf className="w-32 h-32 text-neutral-200" />
               {/* Replace with actual farm image if available */}
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900">Our Heritage & Mission</h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Founded with a vision to connect local farmers with global markets, Calendula Herbs has grown into a leading exporter of organic botanicals. Our farms are located in the most pristine agricultural regions, ensuring that every crop is grown in optimal conditions.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                We believe in sustainable agriculture, ethical trading, and uncompromising quality. From seed selection to final packaging, our rigorous quality control processes guarantee that our clients receive products that exceed international standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Board & Team */}
      <section className="py-24 bg-neutral-50 border-t">
        <div className="container mx-auto px-6 max-w-7xl">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-neutral-900 mb-4">Leadership & Team</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Meet the dedicated professionals driving our vision forward.
            </p>
          </div>

          {board.length > 0 && (
            <div className="mb-20">
              <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-8 border-b pb-4">Board of Directors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {board.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {team.length > 0 && (
            <div>
              <h3 className="text-2xl font-heading font-bold text-neutral-900 mb-8 border-b pb-4">Executive Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map(member => (
                  <MemberCard key={member.id} member={member} small />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  )
}

function MemberCard({ member, small = false }: { member: any, small?: boolean }) {
  const photoUrl = member.photo?.url

  return (
    <div className="bg-white rounded-2xl overflow-hidden border transition-shadow hover:shadow-lg">
      <div className={`${small ? 'aspect-square' : 'aspect-[3/4]'} relative bg-neutral-100 overflow-hidden`}>
        {photoUrl ? (
          <Image src={photoUrl} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
            <span className="text-4xl font-heading font-bold text-neutral-400">{member.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h4 className="text-xl font-heading font-bold text-neutral-900 mb-1">{member.name}</h4>
        <p className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">{member.title}</p>
        
        {member.bio && (
          <p className="text-sm text-neutral-600 mb-6 line-clamp-3">{member.bio}</p>
        )}

        {member.contacts.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-4 border-t border-neutral-100">
            {member.contacts.map((c: any) => (
              <a 
                key={c.id} 
                href={c.type === 'EMAIL' ? `mailto:${c.value}` : c.type === 'PHONE' || c.type === 'WHATSAPP' ? `tel:${c.value.replace(/[^\d+]/g, '')}` : c.value}
                target={c.type !== 'EMAIL' && c.type !== 'PHONE' ? "_blank" : undefined}
                rel="noreferrer"
                className="text-neutral-400 hover:text-primary transition-colors"
                title={c.label || c.type}
              >
                {c.type === 'LINKEDIN' ? <span className="text-xs uppercase font-bold">IN</span> : 
                 c.type === 'EMAIL' ? <Mail className="w-5 h-5" /> :
                 c.type === 'TWITTER' ? <span className="text-xs uppercase font-bold">TW</span> :
                 c.type === 'PHONE' || c.type === 'WHATSAPP' ? <Phone className="w-5 h-5" /> :
                 <span className="text-xs uppercase">{c.type}</span>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
