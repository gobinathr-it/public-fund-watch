import { createContext, useContext, useState, ReactNode } from "react";

const INDIAN_STATES = [
  "All India",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

type StateContextType = {
  selectedState: string;
  setSelectedState: (s: string) => void;
  states: string[];
};

const StateContext = createContext<StateContextType>({
  selectedState: "All India",
  setSelectedState: () => {},
  states: INDIAN_STATES,
});

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedState, setSelectedState] = useState("All India");
  return (
    <StateContext.Provider value={{ selectedState, setSelectedState, states: INDIAN_STATES }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export { INDIAN_STATES };
