export class ReportArrayDto {
  bookIds?: string[];
  constructor(data: Partial<ReportArrayDto>) {
    this.bookIds = data.bookIds;
  }
}