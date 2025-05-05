import { DailyRecord, GoalType } from '../types';

export function calculateTotalEarnings(records: DailyRecord[]): number {
  return records.reduce((total, record) => total + record.earnings, 0);
}

export function calculateTotalExpenses(records: DailyRecord[]): number {
  return records.reduce((total, record) => {
    const { fuel, maintenance, food, other } = record.expenses;
    return total + fuel + maintenance + food + other;
  }, 0);
}

export function calculateNetProfit(records: DailyRecord[]): number {
  const totalEarnings = calculateTotalEarnings(records);
  const totalExpenses = calculateTotalExpenses(records);
  return totalEarnings - totalExpenses;
}

export function calculateTotalMileage(records: DailyRecord[]): number {
  return records.reduce((total, record) => total + record.mileage, 0);
}

export function calculateTotalTrips(records: DailyRecord[]): number {
  return records.reduce((total, record) => total + record.tripCount, 0);
}

export function calculateAverageEarningsPerTrip(records: DailyRecord[]): number {
  const totalEarnings = calculateTotalEarnings(records);
  const totalTrips = calculateTotalTrips(records);
  return totalTrips === 0 ? 0 : totalEarnings / totalTrips;
}

export function calculateAverageEarningsPerKm(records: DailyRecord[]): number {
  const totalEarnings = calculateTotalEarnings(records);
  const totalMileage = calculateTotalMileage(records);
  return totalMileage === 0 ? 0 : totalEarnings / totalMileage;
}

export function calculateFuelEfficiency(records: DailyRecord[]): number {
  const totalFuel = records.reduce((total, record) => total + record.fuelConsumption.liters, 0);
  const totalMileage = calculateTotalMileage(records);
  return totalFuel === 0 ? 0 : totalMileage / totalFuel; // km/l
}

export function calculateGoalProgress(goal: GoalType, records: DailyRecord[]): number {
  // Filter records that fall within the goal's date range
  const relevantRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);
    return recordDate >= startDate && recordDate <= endDate;
  });

  let currentValue = 0;

  switch (goal.type) {
    case 'earnings':
      currentValue = calculateTotalEarnings(relevantRecords);
      break;
    case 'trips':
      currentValue = calculateTotalTrips(relevantRecords);
      break;
    case 'mileage':
      currentValue = calculateTotalMileage(relevantRecords);
      break;
  }

  // Calculate progress percentage
  return goal.target === 0 ? 0 : Math.min(100, (currentValue / goal.target) * 100);
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export function getWeekRange(date: Date): { start: Date, end: Date } {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return { start: monday, end: sunday };
}

export function getMonthRange(date: Date): { start: Date, end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}