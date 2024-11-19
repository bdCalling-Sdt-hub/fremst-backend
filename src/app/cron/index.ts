import cron from 'node-cron';
import { upcomingInspectionReminder } from './jobs/upcomingInspectionReminder';

export const cronJobs = () => {
  cron.schedule('0 12 * * *', async () => {
    console.log('running a task every minute');
    upcomingInspectionReminder();
  });
};
