export interface Scheme {
  id: string;
  name: string;
  description: string;
  totalBudget: number;
  spent: number;
  department: string;
  state: string;
  category: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed" | "Upcoming";
  districts: DistrictAllocation[];
  expenses: Expense[];
}

export interface DistrictAllocation {
  district: string;
  allocated: number;
  spent: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  department: string;
  location: string;
  date: string;
  status: "Verified" | "Pending" | "Flagged";
  hasProof: boolean;
}

export interface DepartmentSpending {
  name: string;
  allocated: number;
  spent: number;
}

export const schemes: Scheme[] = [
  {
    id: "1",
    name: "Pradhan Mantri Gram Sadak Yojana",
    description: "Rural road connectivity programme to provide all-weather road access to unconnected habitations.",
    totalBudget: 10000_00_00_000,
    spent: 6500_00_00_000,
    department: "Ministry of Rural Development",
    state: "Maharashtra",
    category: "Infrastructure",
    startDate: "2024-04-01",
    endDate: "2026-03-31",
    status: "Active",
    districts: [
      { district: "Pune", allocated: 1500_00_00_000, spent: 1100_00_00_000 },
      { district: "Nagpur", allocated: 1200_00_00_000, spent: 800_00_00_000 },
      { district: "Nashik", allocated: 1000_00_00_000, spent: 720_00_00_000 },
      { district: "Aurangabad", allocated: 900_00_00_000, spent: 650_00_00_000 },
      { district: "Thane", allocated: 800_00_00_000, spent: 600_00_00_000 },
    ],
    expenses: [
      { id: "e1", title: "Road construction - Phase 1", amount: 250_00_00_000, category: "Construction", department: "PWD", location: "Pune", date: "2024-06-15", status: "Verified", hasProof: true },
      { id: "e2", title: "Bridge construction - Nashik", amount: 180_00_00_000, category: "Construction", department: "PWD", location: "Nashik", date: "2024-08-20", status: "Verified", hasProof: true },
      { id: "e3", title: "Material procurement", amount: 95_00_00_000, category: "Procurement", department: "Supply", location: "Nagpur", date: "2024-09-10", status: "Pending", hasProof: false },
    ],
  },
  {
    id: "2",
    name: "National Health Mission",
    description: "Comprehensive healthcare programme to provide accessible, affordable, and quality healthcare.",
    totalBudget: 8000_00_00_000,
    spent: 4200_00_00_000,
    department: "Ministry of Health",
    state: "Karnataka",
    category: "Healthcare",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    status: "Active",
    districts: [
      { district: "Bengaluru", allocated: 2000_00_00_000, spent: 1200_00_00_000 },
      { district: "Mysuru", allocated: 1200_00_00_000, spent: 700_00_00_000 },
      { district: "Hubli", allocated: 800_00_00_000, spent: 500_00_00_000 },
    ],
    expenses: [
      { id: "e4", title: "Hospital equipment", amount: 320_00_00_000, category: "Equipment", department: "Health", location: "Bengaluru", date: "2024-03-15", status: "Verified", hasProof: true },
      { id: "e5", title: "Staff training programme", amount: 45_00_00_000, category: "Training", department: "Health", location: "Mysuru", date: "2024-05-20", status: "Flagged", hasProof: true },
    ],
  },
  {
    id: "3",
    name: "Samagra Shiksha Abhiyan",
    description: "Integrated scheme for school education covering pre-school to class XII.",
    totalBudget: 5000_00_00_000,
    spent: 1800_00_00_000,
    department: "Ministry of Education",
    state: "Tamil Nadu",
    category: "Education",
    startDate: "2024-06-01",
    endDate: "2026-05-31",
    status: "Active",
    districts: [
      { district: "Chennai", allocated: 1200_00_00_000, spent: 500_00_00_000 },
      { district: "Coimbatore", allocated: 800_00_00_000, spent: 350_00_00_000 },
      { district: "Madurai", allocated: 600_00_00_000, spent: 280_00_00_000 },
    ],
    expenses: [
      { id: "e6", title: "School building renovation", amount: 150_00_00_000, category: "Construction", department: "Education", location: "Chennai", date: "2024-07-10", status: "Verified", hasProof: true },
    ],
  },
  {
    id: "4",
    name: "PM Kisan Samman Nidhi",
    description: "Income support of ₹6,000 per year for all farmer families across the country.",
    totalBudget: 12000_00_00_000,
    spent: 9800_00_00_000,
    department: "Ministry of Agriculture",
    state: "Uttar Pradesh",
    category: "Agriculture",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    status: "Active",
    districts: [
      { district: "Lucknow", allocated: 2500_00_00_000, spent: 2100_00_00_000 },
      { district: "Varanasi", allocated: 2000_00_00_000, spent: 1800_00_00_000 },
      { district: "Agra", allocated: 1500_00_00_000, spent: 1300_00_00_000 },
    ],
    expenses: [
      { id: "e7", title: "Direct benefit transfer - Q1", amount: 3200_00_00_000, category: "Transfer", department: "Agriculture", location: "Lucknow", date: "2024-03-31", status: "Verified", hasProof: true },
    ],
  },
  {
    id: "5",
    name: "Swachh Bharat Mission",
    description: "Clean India initiative for sanitation facilities and waste management systems.",
    totalBudget: 6000_00_00_000,
    spent: 3100_00_00_000,
    department: "Ministry of Housing",
    state: "Gujarat",
    category: "Welfare",
    startDate: "2024-04-01",
    endDate: "2026-03-31",
    status: "Active",
    districts: [
      { district: "Ahmedabad", allocated: 1200_00_00_000, spent: 700_00_00_000 },
      { district: "Surat", allocated: 1000_00_00_000, spent: 600_00_00_000 },
      { district: "Vadodara", allocated: 800_00_00_000, spent: 450_00_00_000 },
    ],
    expenses: [
      { id: "e8", title: "Toilet construction - Phase 2", amount: 280_00_00_000, category: "Construction", department: "Housing", location: "Ahmedabad", date: "2024-05-15", status: "Verified", hasProof: true },
    ],
  },
];

export const departmentSpending: DepartmentSpending[] = [
  { name: "Rural Development", allocated: 15000, spent: 9800 },
  { name: "Health & Family Welfare", allocated: 12000, spent: 7200 },
  { name: "Education", allocated: 10000, spent: 5800 },
  { name: "Agriculture", allocated: 18000, spent: 14200 },
  { name: "Housing & Urban Affairs", allocated: 8000, spent: 4500 },
  { name: "Social Justice", allocated: 6000, spent: 3200 },
];

export const monthlySpending = [
  { month: "Apr", budget: 3000, spent: 1200 },
  { month: "May", budget: 3000, spent: 2100 },
  { month: "Jun", budget: 3500, spent: 2800 },
  { month: "Jul", budget: 3500, spent: 3100 },
  { month: "Aug", budget: 4000, spent: 3400 },
  { month: "Sep", budget: 4000, spent: 3800 },
  { month: "Oct", budget: 4500, spent: 4100 },
  { month: "Nov", budget: 4500, spent: 4300 },
  { month: "Dec", budget: 5000, spent: 4600 },
  { month: "Jan", budget: 5000, spent: 4800 },
  { month: "Feb", budget: 5500, spent: 5100 },
  { month: "Mar", budget: 5500, spent: 5400 },
];

export const categoryDistribution = [
  { name: "Infrastructure", value: 35, fill: "hsl(215, 50%, 15%)" },
  { name: "Healthcare", value: 22, fill: "hsl(160, 84%, 30%)" },
  { name: "Education", value: 18, fill: "hsl(38, 92%, 50%)" },
  { name: "Agriculture", value: 15, fill: "hsl(210, 100%, 50%)" },
  { name: "Welfare", value: 10, fill: "hsl(280, 60%, 50%)" },
];

export function formatCurrency(amount: number): string {
  if (amount >= 1_00_00_00_000) {
    return `₹${(amount / 1_00_00_00_000).toFixed(1)}K Cr`;
  }
  if (amount >= 1_00_00_000) {
    return `₹${(amount / 1_00_00_000).toFixed(0)} Cr`;
  }
  if (amount >= 1_00_000) {
    return `₹${(amount / 1_00_000).toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyShort(crores: number): string {
  return `₹${crores.toLocaleString("en-IN")} Cr`;
}
