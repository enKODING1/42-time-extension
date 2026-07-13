export type PageContext = {
  login: string;
  getLocationStats: () => Promise<Record<string, string> | null>;
};

export type Feature = {
  id: string;
  shouldRun: (ctx: PageContext) => boolean;
  run: (ctx: PageContext) => Promise<void>;
};
