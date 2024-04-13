export interface IUser {
  id: number;
  userName: string;
  email: string;
  password: string;
  created_at: Date;
  role: IRole;
}

export interface UserCreationDto {
    userName: string;
    email: string;
    password: string;
    roleId: number;
  }

export interface ChangeUserDto {
    id: number;
    userName: string;
    email: string;
    password: string;
    roleId: number;
}
  

export interface IRole {
    id: number;
    name: string;
}