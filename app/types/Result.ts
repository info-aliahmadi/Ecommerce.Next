import ResultStatusEnum from "./enums/ResultStatusEnum";

export default class Result<T> {
    status: ResultStatusEnum;
    errors: Error[];
    message?: string;
    data?: T;
  
    constructor() {
      this.status = ResultStatusEnum.Succeeded;
      this.errors = [];
    }
  
    get succeeded(): boolean {
      return this.status === ResultStatusEnum.Succeeded;
    }
  
    get statusDescription(): string {
      return ResultStatusEnumDescription.description(this.status);
    }
  }
  
  
  export namespace ResultStatusEnumDescription {
    const descriptions: { [key in ResultStatusEnum]: string } = {
      [ResultStatusEnum.Succeeded]: "Succeeded",
      [ResultStatusEnum.Failed]: "Failed",
      [ResultStatusEnum.InvalidValidation]: "Invalid Validation",
      [ResultStatusEnum.NotFound]: "Not Found",
      [ResultStatusEnum.IsNotAuthorized]: "Is Not Authorized",
      [ResultStatusEnum.IsNotAllowed]: "Is Not Allowed",
      [ResultStatusEnum.ItsDuplicate]: "It's Duplicate",
      [ResultStatusEnum.ExceptionThrowed]: "Exception Throwed",
      [ResultStatusEnum.FileIsTooLarge]: "File Is Too Large",
      [ResultStatusEnum.FileIsTooSmall]: "File Is Too Small",
      [ResultStatusEnum.RequiresTwoFactor]: "Requires Two Factor",
      [ResultStatusEnum.IsLockedOut]: "User Is Locked",
      [ResultStatusEnum.InsufficientStock]: "Insufficient Stock"
    };
  
    export function description(val: ResultStatusEnum): string {
      return descriptions[val] || '';
    }
  }
  
  export class Error {
    property: string;
    description: string;
  
    constructor(property: string, description: string) {
      this.property = property;
      this.description = description;
    }
  }