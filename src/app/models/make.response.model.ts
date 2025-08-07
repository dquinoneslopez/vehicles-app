import { Make } from "./make.model";

export interface MakeResponse {
  Results: Make[];
  Count: number;
  SearchCriteria: string;
}
