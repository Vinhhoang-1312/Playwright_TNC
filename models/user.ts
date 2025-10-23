export interface User {
  email: string;
  password: string;
  caseType?: string;
  [key: string]: any;
}
