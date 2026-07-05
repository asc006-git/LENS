import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  facultyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate?: Date;
  fileAttachment?: string;
  expectedConcepts?: string[];
  rubricCriteria?: string[];
  learningObjectives?: string[];
  facultyNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    fileAttachment: { type: String },
    expectedConcepts: [{ type: String }],
    rubricCriteria: [{ type: String }],
    learningObjectives: [{ type: String }],
    facultyNotes: { type: String },
  },
  { timestamps: true }
);

assignmentSchema.index({ courseId: 1, createdAt: -1 });

const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);
export default Assignment;
