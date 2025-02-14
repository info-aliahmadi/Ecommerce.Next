interface SubscribeModel {
    id: number; // long becomes number in TypeScript
    subscribeLabelId: number;
    subscribeLabelTitle?: string;
    email: string;
    insertDate?: string;
  }
  interface SubscribeLabelModel {
    id: number;
    title: string;
    insertDate?: Date;
  }