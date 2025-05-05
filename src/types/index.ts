export interface DailyRecord {
  id: string;
  date: string;
  mileage: number;
  tripCount: number;
  earnings: number;
  expenses: {
    fuel: number;
    maintenance: number;
    food: number;
    rent: number;
    other: number;
  };
  fuelConsumption: {
    liters: number;
    cost: number;
  };
  notes: string;
}

export interface GoalType {
  id: string;
  name: string;
  target: number;
  currentValue: number;
  type: 'earnings' | 'trips' | 'mileage';
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

export interface AppState {
  records: DailyRecord[];
  goals: GoalType[];
  settings: {
    currency: string;
    distanceUnit: 'km' | 'mi';
    fuelUnit: 'l' | 'gal';
  };
}