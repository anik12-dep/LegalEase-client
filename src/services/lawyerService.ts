import type { Lawyer } from "@/types/lawyer";

interface LawyersResponse {
  success: boolean;
  count: number;
  data: Lawyer[];
}

const API_URL = "http://localhost:5000/lawyers";

export const getLawyers = async (
  search: string = "",
  availability: string = "",
  minFee: string = "",
  maxFee: string = "",
  sort: string = "",
): Promise<LawyersResponse> => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (availability) params.append("availability", availability);
  if (minFee) params.append("minFee", minFee);
  if (maxFee) params.append("maxFee", maxFee);
  if (sort) params.append("sort", sort);

  const response = await fetch(`${API_URL}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lawyers");
  }

  return response.json();
};

export const getLawyerById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lawyer");
  }

  return response.json();
};
