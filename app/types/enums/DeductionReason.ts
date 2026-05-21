export enum DeductionReason {
  
  /**
   * انتخاب نشده
   */
  NotSelected = 0,
  
  /**
   * فاسد شده
   */
  Spoiled = 1,

  /**
   * منقضی شده
   */
  Expired = 2,

  /**
   * اشتباه ثبت شده
   */
  MistakenEntry = 3,

  /**
   * سایر
   */
  Other = 4,
}

export default DeductionReason;
