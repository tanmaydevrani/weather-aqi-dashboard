import type { AqiInfo } from '@/types/aqi.d';

export function getAqiInfo(aqi: number): AqiInfo {
  if (aqi <= 50)
    return { level: 'good', label: 'Good', color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)', description: 'Air quality is satisfactory.' };
  if (aqi <= 100)
    return { level: 'moderate', label: 'Moderate', color: '#eab308', bgColor: 'rgba(234,179,8,0.15)', description: 'Acceptable; some pollutants may concern sensitive people.' };
  if (aqi <= 150)
    return { level: 'unhealthy-sensitive', label: 'Unhealthy for Sensitive', color: '#f97316', bgColor: 'rgba(249,115,22,0.15)', description: 'Sensitive groups may experience health effects.' };
  if (aqi <= 200)
    return { level: 'unhealthy', label: 'Unhealthy', color: '#ef4444', bgColor: 'rgba(239,68,68,0.15)', description: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300)
    return { level: 'very-unhealthy', label: 'Very Unhealthy', color: '#a855f7', bgColor: 'rgba(168,85,247,0.15)', description: 'Health warnings of emergency conditions.' };
  return { level: 'hazardous', label: 'Hazardous', color: '#7f1d1d', bgColor: 'rgba(127,29,29,0.15)', description: 'Health alert: everyone may experience serious effects.' };
}
