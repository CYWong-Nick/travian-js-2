export enum CurrentPageEnum {
  Field = "Field",
  Town = "Town",
  Building = "Building",
  Report = "Report",
  OffensiveReport = "OffensiveReport",
  ScoutReport = "ScoutReport",
  Login = "Login",
  Unknown = "Unknown",
  PlusResources = "PlusResources",
  PlusOverview = "PlusOverview",
  UserProfile = "UserProfile",
  Adventure = 'Adventure'
}

export enum Tab {
  Villages = 'Villages',
  Settings = 'Settings'
}

export enum Tribe {
  Gauls = 'Gauls',
  Teutons = 'Teutons',
  Romans = 'Romans',
  Huns = 'Huns',
  Egyptians = 'Egyptians',
  Spartans = 'Spartans',
  Natars = 'Natars',
  Nature = 'Nature',
  Unknown = 'Unknown'
}

export interface Troop {
  id: string
  tribe: Tribe
  troopId: string
  name: string
  type: TroopType
  attack: number
  infantryDefense: number
  calvaryDefense: number
  speed: number
  carry: number
  lumber: number
  clay: number
  iron: number
  crop: number
  consumption: number
  trainingTime: number
}

export enum TroopType {
  Infantry = 'Infantry',
  Calvary = 'Calvary',
  Siege = 'Siege',
  Settler = 'Settler',
  Hero = 'Hero',
  Others = 'Others'
}