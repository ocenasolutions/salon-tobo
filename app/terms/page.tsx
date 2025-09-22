"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50">
      {/* Header */}
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
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              Terms &{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Conditions
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Please read these terms and conditions carefully before using our services
            </p>
          </div>

          {/* Content Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 sm:p-12">
              <div className="prose prose-slate max-w-none">
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800 m-0">HUSN Beauty Salon</h3>
                  </div>
                  <p className="text-purple-700 m-0">
                    <strong>Location:</strong> Chandigarh, India
                    <br />
                    <strong>Email:</strong> contact.husn@gmail.com
                  </p>
                </div>

                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  Welcome to HUSN Beauty Salon. These Terms and Conditions govern all appointments, services, and
                  interactions at our salon. By booking an appointment or using our services, you agree to the following
                  terms:
                </p>

                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      1. Appointments and Scheduling
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>Clients are encouraged to book appointments in advance to ensure availability.</p>
                      <p>
                        Please arrive at least 10-15 minutes before your scheduled appointment. This helps us start on
                        time and provide the best service possible.
                      </p>
                      <p>
                        Late arrivals of more than 15 minutes may result in a reduced service time or, in some cases,
                        cancellation of the appointment to accommodate other clients.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      2. Cancellations and Rescheduling
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        We kindly request at least 24 hours' notice for any cancellation or rescheduling of
                        appointments.
                      </p>
                      <p>
                        Appointments canceled with less than 24 hours' notice may be subject to a cancellation fee or
                        forfeiture of any deposit paid.
                      </p>
                      <p>For group bookings or bridal packages, a 48-hour notice is required for cancellations.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      3. Payments and Pricing
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        All prices for services are displayed at the salon and may be subject to change without prior
                        notice.
                      </p>
                      <p>Payments can be made via cash, card, or UPI.</p>
                      <p>
                        Any discounts, offers, or packages are valid only during the specified promotional period and
                        are non-transferable.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      4. Refunds and Service Issues
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>Services once rendered are non-refundable.</p>
                      <p>
                        If you experience any issues with a service, please notify our management within 24 hours, and
                        we will do our best to resolve the matter with an adjustment or complimentary correction where
                        appropriate.
                      </p>
                      <p>
                        Refunds will only be considered in exceptional circumstances and at the sole discretion of salon
                        management.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      5. Liability and Health Conditions
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        While we take utmost care to ensure the safety of all clients, HUSN Beauty Salon is not liable
                        for any allergic reactions, skin irritations, or side effects resulting from treatments or
                        products used.
                      </p>
                      <p>
                        Clients are responsible for informing our staff about any allergies, skin sensitivities, medical
                        conditions, or injuries prior to treatment.
                      </p>
                      <p>
                        Pregnant clients or those with medical concerns should consult a doctor before undergoing
                        certain treatments.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      6. Personal Belongings
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>Clients are advised to take care of their personal belongings.</p>
                      <p>
                        The salon will not be held responsible for loss, theft, or damage to any personal items brought
                        into the premises.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      7. Conduct and Behavior
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>We maintain a professional, respectful, and safe environment for both clients and staff.</p>
                      <p>
                        Any form of abusive, inappropriate, or threatening behavior will result in immediate termination
                        of the appointment and refusal of service.
                      </p>
                      <p>The salon reserves the right to deny services to anyone who violates these standards.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      8. Gift Cards and Packages
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        Gift cards and prepaid packages are valid for six months from the date of purchase, unless
                        otherwise stated.
                      </p>
                      <p>They are non-refundable and non-exchangeable for cash.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      9. Changes to Terms
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        HUSN Beauty Salon reserves the right to update or modify these Terms and Conditions at any time.
                        The updated terms will be available at the salon and on our official communication channels.
                      </p>
                    </div>
                  </section>
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <p className="text-center text-slate-600 mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-center text-slate-600">
                    For questions about these terms, please contact us at{" "}
                    <a
                      href="mailto:contact.husn@gmail.com"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      contact.husn@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
