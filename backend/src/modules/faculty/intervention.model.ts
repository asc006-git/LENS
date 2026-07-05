import mongoose, { Schema, Document } from 'mongoose';

export interface IIntervention extends Document {
  facultyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetStudents: mongoose.Types.ObjectId[];
  targetConcepts: string[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interventionSchema = new Schema<IIntervention>(
  {
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    targetStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    targetConcepts: [{ type: String }],
    status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'draft' },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

interventionSchema.index({ facultyId: 1, status: 1 });

const Intervention = mongoose.model<IIntervention>('Intervention', interventionSchema);
export default Intervention;
