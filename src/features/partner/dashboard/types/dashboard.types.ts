export interface RoyaltyInfo {
  levelrequired_client: string;
  levelachieve_client: number;
  lotrequired: number;
  lotachieve: string;
  royaltyname: string;
  running_level: number;
  total_lots: string;
}

export interface RewardLevel {
  level: string;
  name: string;
  reward: number;
  time: string;
  lotsize: number;
  tot_account: string;
}

export interface PartnerDashboardResponse {
  user_code: string;
  total_ib_commission: string;
  user_id: string;
  remaining_days: number;
  royaltyinfo: RoyaltyInfo;
  active_clients: number;
  running_level: number;
  levels: Record<string, unknown[]>;
  rewardlist: RewardLevel[];
  previous_royalty_list: unknown[];
}