import EmailInboxModel from "./EmailInboxModel";

export default interface EmailOutboxModel {
     /**
   * The unique identifier for the email.
   */
  id: number;

  /**
   * The inbox email this email is a reply to (if applicable).
   */
  replayTo?: EmailInboxModel;

  /**
   * The ID of the inbox email this email is a reply to (if applicable).
   */
  replayToId?: number;

  /**
   * The subject of the email.
   */
  subject: string;

  /**
   * The content of the email.
   */
  content: string;

  /**
   * The date and time the email was registered in the system.
   */
  registerDate?: Date;

  /**
   * Indicates whether the email is a draft.
   */
  isDraft?: boolean;

  /**
   * The sender(s) of the email.
   */
  fromAddress: string[];

  /**
   * The recipient(s) of the email.
   */
  toAddress: string[];

  /**
   * The IDs of attachments associated with the email.
   */
  attachments: number[];
  }