import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  description: string;
  facultyId: mongoose.Types.ObjectId;
  institution: string;
  semester: string;
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    institution: { type: String, required: true, trim: true },
    semester: { type: String, default: '' },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

courseSchema.index({ facultyId: 1 });
courseSchema.index({ institution: 1 });
courseSchema.index({ students: 1 });

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
