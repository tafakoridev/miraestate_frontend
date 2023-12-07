// Employee.ts

interface Employee {
    id: string;
    company_name: string;
    job_title: string;
    from: string; // Assuming 'from' and 'to' are date strings, adjust as needed
    to: string | null; // Assuming 'to' can be null, adjust as needed
    currently_enrolled: boolean;
    user_id: number;
  }
  
  export default Employee;
  