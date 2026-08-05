import { getLawyerById } from "@/services/lawyerService";
import type { Lawyer } from "@/types/lawyer";
import HireLawyerButton from "@/components/lawyers/HireLawyerButton";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LawyerDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const response = await getLawyerById(id);
  const lawyer: Lawyer = response.data;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <img
        src={lawyer.image}
        alt={lawyer.name}
        className="mb-6 h-80 w-full rounded-lg object-cover"
      />

      <h1 className="text-4xl font-bold">{lawyer.name}</h1>

      <p className="mt-3 text-lg text-gray-600">{lawyer.specialization}</p>

      <div className="mt-6 space-y-2">
        <p>
          <strong>Email:</strong> {lawyer.email}
        </p>

        <p>
          <strong>Experience:</strong> {lawyer.experience} Years
        </p>

        <p>
          <strong>Consultation Fee:</strong> ${lawyer.consultationFee}
        </p>

        <p>
          <strong>Location:</strong> {lawyer.location}
        </p>

        <p>
          <strong>Availability:</strong>{" "}
          {lawyer.availability ? "Available" : "Unavailable"}
        </p>

        <p>
          <strong>Bio:</strong> {lawyer.bio}
        </p>
      </div>

      <HireLawyerButton lawyerId={lawyer._id} />
    </main>
  );
}
