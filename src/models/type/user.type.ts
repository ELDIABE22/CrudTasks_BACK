export interface IUser {
  name: string;
  lastname?: string;
  email: string;
  password: string;
  rol: 'admin' | 'user';
  state: 'active' | 'desactive';
}
