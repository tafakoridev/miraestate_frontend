// Education.ts

interface Education {
    id: string;
    educational_level: string;
    field_of_study: string;
    educational_institution: string;
    from: string; // Assuming 'from' and 'to' are date strings, adjust as needed
    to: string | null; // Assuming 'to' can be null, adjust as needed
    currently_enrolled: boolean;
    user_id: number;
  }
  
  export default Education;
  