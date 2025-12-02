import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserProfile = {
  name: string;
  age: string;
  gender: string;
  weight: string; // Needed for Water Goal
  isDiabetic: string;
  hasHypertension: string;
  existingConditions: string;
  isAssessmentDone: boolean;
};

// New Structure for Meds
type Medication = {
  id: string;
  name: string;
  taken: boolean; // True = Checked, False = Unchecked
};

type TrackerState = {
  lastResetDate: string; // To track when to reset daily stats
  water: number;
  meds: Medication[]; // Changed from string[] to Object[]
  vaccines: string[];
  periodDate: string | null;
};

type UserState = {
  profile: UserProfile;
  trackers: TrackerState;
  
  setProfile: (data: Partial<UserProfile>) => void;
  completeAssessment: () => void;
  
  // Actions
  checkDailyReset: () => void; // Checks if it's a new day
  addWater: (amount?: number) => void;
  
  addMed: (name: string) => void;
  toggleMed: (id: string, status?: boolean) => void; // Manual or Agent toggle
  removeMed: (id: string) => void;
  
  addVaccine: (name: string) => void;
  removeVaccine: (name: string) => void;
  setPeriodDate: (date: string) => void;
  
  getWaterGoal: () => number; // Helper to calculate goal
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: {
        name: '', age: '', gender: '', weight: '', isDiabetic: 'No', 
        hasHypertension: 'No', existingConditions: '', isAssessmentDone: false
      },
      trackers: {
        lastResetDate: new Date().toDateString(),
        water: 0,
        meds: [],
        vaccines: [],
        periodDate: null
      },
      
      setProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),
      completeAssessment: () => set((state) => ({ profile: { ...state.profile, isAssessmentDone: true } })),
      
      // --- LOGIC: Check for New Day ---
      checkDailyReset: () => {
        const today = new Date().toDateString();
        const { lastResetDate, meds } = get().trackers;

        if (lastResetDate !== today) {
          // It's a new day! Reset Water and uncheck all Meds
          set((state) => ({
            trackers: {
              ...state.trackers,
              lastResetDate: today,
              water: 0,
              meds: state.trackers.meds.map(m => ({ ...m, taken: false })) // Uncheck all
            }
          }));
        }
      },

      // --- LOGIC: Dynamic Water Goal ---
      getWaterGoal: () => {
        const weight = parseInt(get().profile.weight) || 60; // Default 60kg if missing
        // Formula: 35ml per kg of body weight
        return weight * 35;
      },

      addWater: (amount = 250) => set((state) => ({ 
        trackers: { ...state.trackers, water: state.trackers.water + amount } 
      })),

      // --- MEDS LOGIC ---
      addMed: (name) => set((state) => ({ 
        trackers: { 
          ...state.trackers, 
          meds: [...state.trackers.meds, { id: Date.now().toString(), name, taken: false }] 
        } 
      })),
      
      toggleMed: (id, status) => set((state) => ({
        trackers: {
          ...state.trackers,
          meds: state.trackers.meds.map(m => 
            m.id === id ? { ...m, taken: status !== undefined ? status : !m.taken } : m
          )
        }
      })),

      removeMed: (id) => set((state) => ({
        trackers: { ...state.trackers, meds: state.trackers.meds.filter(m => m.id !== id) }
      })),

      // --- VACCINES (Persistent) ---
      addVaccine: (name) => set((state) => ({ 
        trackers: { ...state.trackers, vaccines: [...state.trackers.vaccines, name] } 
      })),
      removeVaccine: (name) => set((state) => ({
        trackers: { ...state.trackers, vaccines: state.trackers.vaccines.filter(v => v !== name) }
      })),

      setPeriodDate: (date) => set((state) => ({ 
        trackers: { ...state.trackers, periodDate: date } 
      })),
    }),
    { name: 'pranaya-storage' }
  )
);