import $api from "../api";
import { IMessage } from "../interfaces/IMessage.interface";
import { GetMessagesBetweenDto, IMessageFromResponse } from "../interfaces/api-interfaces/MessagesApi.interface";

export default class MessagesService {
  static async fetchMessagesBetween(
    request: GetMessagesBetweenDto
  ): Promise<IMessageFromResponse[]> {
    try {
      const { senderId, receiverId } = request;
      const { data } = await $api.get<IMessageFromResponse[]>("/messages", {
        params: { senderId, receiverId },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching messages");
    }
  }

  static async sendMessageFromAdmin(request: IMessage): Promise<IMessage[]> {
    try {
      const { receiverId, senderId, content } = request;
      const { data } = await $api.post<IMessage[]>("/messages/send", {
        senderId,
        receiverId,
        content,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error sending message");
    }
  }
}
