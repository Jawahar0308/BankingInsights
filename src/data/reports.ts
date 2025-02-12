import reportsData from './json/reports.json';
import { Report } from '../types/reportTypes';

export const getReports = (): Report[] => {
    return reportsData; // Return the reports data from the JSON file
};
