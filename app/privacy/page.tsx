"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PrivacyPage() {
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
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
              Privacy{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information
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
                  At HUSN Beauty Salon, we value your privacy and are committed to safeguarding the personal information
                  you share with us. This Privacy Policy explains how we collect, use, store, and protect your data when
                  you visit our salon, book services, or interact with us.
                </p>

                <p className="text-slate-700 mb-8">
                  By booking an appointment or using our services, you agree to the terms outlined in this Privacy
                  Policy.
                </p>

                <div className="space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      1. Information We Collect
                    </h2>
                    <p className="text-slate-700 mb-4">
                      To provide our services effectively, we may collect the following information:
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Identification Details:</h3>
                        <p className="text-slate-700">
                          Name, contact number, email address, and address (for home services or delivery of products).
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Booking and Transaction Data:</h3>
                        <p className="text-slate-700">
                          Appointment details, service history, and payment information (processed through secure
                          gateways).
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Health and Safety Information:</h3>
                        <p className="text-slate-700">
                          Details about allergies, skin sensitivities, or relevant medical conditions (shared
                          voluntarily) to ensure safe treatments.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Feedback and Communication:</h3>
                        <p className="text-slate-700">
                          Any information provided through reviews, inquiries, or customer support interactions.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      2. How We Use Your Information
                    </h2>
                    <p className="text-slate-700 mb-4">We use the information we collect for the following purposes:</p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">1</span>
                        </div>
                        <p className="text-slate-700">To book, confirm, and manage appointments effectively.</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">2</span>
                        </div>
                        <p className="text-slate-700">To process payments securely and generate invoices.</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">3</span>
                        </div>
                        <p className="text-slate-700">
                          To personalize services based on your preferences and service history.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">4</span>
                        </div>
                        <p className="text-slate-700">
                          To send reminders about upcoming appointments or notify you of special offers, promotions, and
                          updates (with your consent).
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">5</span>
                        </div>
                        <p className="text-slate-700">To improve our services, products, and customer experience.</p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-purple-600 text-sm font-semibold">6</span>
                        </div>
                        <p className="text-slate-700">To comply with any legal obligations or regulations.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      3. Data Security
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        We take appropriate technical and organizational measures to keep your personal data secure and
                        protected against unauthorized access, loss, or misuse.
                      </p>
                      <p>Data is stored securely and is only accessible to authorized salon staff.</p>
                      <p>Payment information is processed through secure and encrypted payment gateways.</p>
                      <p>We regularly review our security practices to maintain the highest level of protection.</p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      4. Sharing of Information
                    </h2>
                    <p className="text-slate-700 mb-4">
                      We do not sell, rent, or trade your personal data with third parties. However, we may share your
                      information in the following limited situations:
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-pink-600 text-sm font-semibold">1</span>
                        </div>
                        <p className="text-slate-700">
                          With trusted third-party service providers (e.g., payment gateways or SMS/email platforms)
                          strictly for processing appointments and payments.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-pink-600 text-sm font-semibold">2</span>
                        </div>
                        <p className="text-slate-700">
                          If required by law, government authorities, or regulatory agencies.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-pink-600 text-sm font-semibold">3</span>
                        </div>
                        <p className="text-slate-700">
                          In the event of a business transfer, such as a merger or acquisition, where client data may be
                          transferred as part of the business assets.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      5. Marketing and Communications
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>
                        With your permission, we may use your email or phone number to send promotional messages,
                        offers, or updates about our services.
                      </p>
                      <p>
                        You may opt-out of marketing communications anytime by contacting us directly or following the
                        unsubscribe instructions in our messages.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      6. Retention of Data
                    </h2>
                    <p className="text-slate-700 mb-4">We retain your personal data only as long as necessary for:</p>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>Providing services</li>
                      <li>Fulfilling legal, tax, and accounting obligations</li>
                      <li>Resolving disputes or enforcing agreements</li>
                    </ul>
                    <p className="text-slate-700 mt-4">
                      Once the retention period ends, we securely delete or anonymize your data.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      7. Your Rights
                    </h2>
                    <p className="text-slate-700 mb-4">
                      As a customer, you have the following rights regarding your personal data:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <h4 className="font-semibold text-purple-800 mb-2">Access</h4>
                        <p className="text-purple-700 text-sm">
                          Request a copy of the personal data we hold about you.
                        </p>
                      </div>

                      <div className="p-4 bg-pink-50 rounded-lg border border-pink-100">
                        <h4 className="font-semibold text-pink-800 mb-2">Correction</h4>
                        <p className="text-pink-700 text-sm">
                          Request correction of any inaccurate or incomplete information.
                        </p>
                      </div>

                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-indigo-800 mb-2">Deletion</h4>
                        <p className="text-indigo-700 text-sm">
                          Request deletion of your personal data, subject to legal requirements.
                        </p>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <h4 className="font-semibold text-emerald-800 mb-2">Withdrawal of Consent</h4>
                        <p className="text-emerald-700 text-sm">Opt-out of receiving promotional messages anytime.</p>
                      </div>
                    </div>

                    <p className="text-slate-700 mt-4">
                      To exercise these rights, you can email us at{" "}
                      <a
                        href="mailto:contact.husn@gmail.com"
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        contact.husn@gmail.com
                      </a>
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      8. Changes to This Privacy Policy
                    </h2>
                    <div className="space-y-4 text-slate-700">
                      <p>HUSN Beauty Salon reserves the right to update or modify this Privacy Policy at any time.</p>
                      <p>Updates will be posted at the salon and communicated through our official channels.</p>
                      <p>
                        Your continued use of our services after changes are made will signify your acceptance of the
                        updated policy.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-gradient-to-r from-purple-200 to-pink-200">
                      9. Contact Us
                    </h2>
                    <p className="text-slate-700">
                      For questions, concerns, or requests related to this Privacy Policy, please contact us at:
                    </p>
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
                      <p className="text-slate-700">
                        <strong>HUSN Beauty Salon</strong>
                        <br />
                        Chandigarh, India
                        <br />
                        Email:{" "}
                        <a
                          href="mailto:contact.husn@gmail.com"
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          contact.husn@gmail.com
                        </a>
                      </p>
                    </div>
                  </section>
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <p className="text-center text-slate-600 mb-4">
                    <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-center text-slate-600">
                    For questions about this privacy policy, please contact us at{" "}
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