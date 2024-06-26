import { IMessage } from "./IMessage.interface";
import { IRole } from "./IRole.interface";

export interface IUser {
  id: number;
  userName: string;
  email: string;
  role: IRole;
  sentMessages?: IMessage[];
  receivedMessages?: IMessage[];
}