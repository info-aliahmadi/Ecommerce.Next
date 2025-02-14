
interface MessageUserModel {
    messageId: number;
    toUser: AuthorModel;
    toUserId: number;
    isRead: boolean;
    isDeleted: boolean;
    isPin: boolean;
}

enum MessageType {
    Private = 0,
    Public = 1,
    Contact = 2,
    Request = 3,
}

interface MessageModel {
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