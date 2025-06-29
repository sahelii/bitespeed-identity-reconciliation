export interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
}

export const getHealthStatus = (): HealthStatus => {
  return {
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}; 