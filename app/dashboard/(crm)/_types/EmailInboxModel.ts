
export default interface EmailInboxModel {
   /**
   * The unique identifier for the email.
   */
   id: number;

   /**
    * The unique identifier of the email in the mailbox.
    */
   uID: string;
 
   /**
    * The subject of the email.
    */
   subject: string;
 
   /**
    * The content of the email.
    */
   content: string;
 
   /**
    * The date and time the email was received.
    */
   date: Date;
 
   /**
    * Indicates whether the email has been deleted.
    */
   isDeleted: boolean;
 
   /**
    * Indicates whether the email has been read.
    */
   isRead: boolean;
 
   /**
    * Indicates whether the email is pinned.
    */
   isPin: boolean;
 
   /**
    * The ID of the outbox email this email is a reply to (if applicable).
    */
   replayedOutboxId?: number;
 
   /**
    * The date and time the email was registered in the system.
    */
   registerDate: Date;
 
   /**
    * The sender(s) of the email.
    */
   fromAddress: EmailInboxFromAddressModel[];
 
   /**
    * The recipient(s) of the email.
    */
   toAddress: EmailInboxToAddressModel[];
 
   /**
    * The IDs of attachments associated with the email.
    */
   attachments: number[];
 
   /**
    * Indicates whether the email has any attachments.
    */
   haveAttachment: boolean;
}
export interface EmailInboxFromAddressModel {
    /**
* 
*/
    emailInboxId: number;

    /**
     * 
     */
    name: string;

    /**
     * 
     */
    address: string;
}

export interface EmailInboxToAddressModel {
  /**
* 
*/
  emailInboxId: number;

  /**
   * 
   */
  name: string;

  /**
   * 
   */
  address: string;
}
export interface EmailInboxAttachmentModel {
  /**
   * 
   */
  emailInboxId: number;

  /**
   * 
   */
  attachmentId: number;
}