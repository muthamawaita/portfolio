import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { services } from "@/data/platform";
import { HireMeForm } from "@/components/service/hire-me-form";

export default function HireMePage() {
  return (
    <main className="content-page">
      <div className="wrap content-hero">
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> Home
        </Link>
        <p className="section-kicker">19 / HIRE ME</p>
        <h1>Tell me what you need.<br /><em>Let&apos;s shape the work.</em></h1>
        <p className="content-lead">This request goes to the review workflow: lead review, quotation, customer approval, payment, then the order starts.</p>
      </div>

      <div className="wrap contact-grid">
        <div className="contact-note">
          <p>Share the problem, the outcome you need, and the constraints you are working with.</p>
          {services.slice(0, 3).map((service) => (
            <span key={service.slug}>
              {service.title} · {service.price}
            </span>
          ))}
          <span>Typical workflow: Lead → Admin Review → Quotation → Payment → Order</span>
        </div>
        <HireMeForm />
      </div>
    </main>
  );
}
