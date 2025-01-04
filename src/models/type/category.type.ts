import mongoose from "mongoose";

export interface ICategory {
  user: {
    id: mongoose.StringSchemaDefinition;
    name: string;
  };
  name: string;
  description?: string;
  state: 'active' | 'desactive';
}
