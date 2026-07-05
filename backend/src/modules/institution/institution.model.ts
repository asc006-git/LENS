import mongoose, { Schema, Document } from 'mongoose';

export interface IInstitution extends Document {
  name: string;
  code: string;
  domain?: string;
  createdAt: Date;
  updatedAt: Date;
}

const institutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    domain: { type: String, trim: true },
  },
  { timestamps: true }
);

const Institution = mongoose.model<IInstitution>('Institution', institutionSchema);
export default Institution;
