import AuthorModel from "../../(cms)/_types/Article/AuthorModel";

export interface MessageUserModel {
    messageId: number;
    toUser: AuthorModel;
    toUserId: number;
    isRead: boolean;
    isDeleted: boolean;
    isPin: boolean;
}

export enum MessageType {
    Private = 0,
    Public = 1,
    Contact = 2,
    Request = 3,
}

export default interface MessageModel {
    id: number;
    messageType: MessageType;
    name?: string;
    family?: string;
    email?: string;
    fromUserId?: number;
    fromUser?: AuthorModel;
    knowing?: string;
    subject: string;
    content: string;
    registerDate?: Date;
    isDraft: boolean;
    isDeleted: boolean;
    toUser?: MessageUserModel;
    toUsers: MessageUserModel[];
    toUserIds: number[];
    haveAttachment?: boolean;
    attachments: number[];
}