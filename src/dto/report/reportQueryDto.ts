export class ReportQueryDto {
  bookId?: string;
  from?: string;
  size?: string;

  constructor(data: Partial<ReportQueryDto>) {
    this.bookId = data.bookId;
    this.from = data.from;
    this.size = data.size;
  }
}