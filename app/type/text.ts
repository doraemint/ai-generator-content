export type TextResult = {
  output: string;
};

export type GenerationLog = {
  id?: string;
  userId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  platform: string;
  contentType: string;
  style: string;
  generatedAt: Date;
  result: string;
};
