export class ReportSaveDto {
  bookId?: string;
  text?: string;
    
  constructor(data: Partial<ReportSaveDto>) {
    this.bookId = data.bookId;
    this.text = data.text;
  }
}