import mongoose, {Schema} from "mongoose";

export interface IReport extends Document {
    bookId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema = new Schema({
  bookId: {
    required: true,
    type: String,
  },
  text: {
    required: true,
    type: String,
  },
}, {
  timestamps: true,
  timezone: 'UTC',
});

const Report = mongoose.model<IReport>('Report',ReportSchema);

export default Report;