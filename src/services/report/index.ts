import {ReportSaveDto} from "../../dto/report/reportSaveDto";
import Report from 'src/model/report';
import {ReportQueryDto} from "../../dto/report/reportQueryDto";
import {ReportArrayDto} from "../../dto/report/reportArrayDto";
import axios from 'axios';


export const createReport = async (dto: ReportSaveDto)=> {
  await validateReport(dto);
  const report = await new Report(dto).save();
  return report._id;
};

export const validateReport = async (dto: ReportSaveDto) => {
  const bookId = dto.bookId;
  if (bookId) {
    const response = await axios.get(`http://localhost:8080/api/book/${bookId}`);
    if (response.status !== 200) {
      throw new Error(`book with id ${bookId} doesn't exist`);
    }
  } else {
    throw new Error('Book id is not provided');
  }
  if (!dto.text || !dto.text.length) {
    throw new Error('There is must to have text in report');
  }
};

export const getReportsByBookIdService = async (dto: ReportQueryDto) => {
  let size, from : number;
  if (!dto.from || !dto.size) {
    size = 10;
    from = 0;
  }
  else {
    size = parseInt(dto.size);
    from = parseInt(dto.from);
  }
  return Report.find({bookId: dto.bookId}).skip(from).limit(size).sort({createdAt: -1});
};
export const getReportCountsByBookIdService = async (dto: ReportArrayDto) => {
  if (!dto.bookIds) {
    throw new Error('bookIds is not provided');
  }

  const counts: Record<string, number> = dto.bookIds.reduce((acc: Record<string, number>, id) => {
    acc[id] = 0;
    return acc;
  }, {});

  const results = await Report.aggregate([
    {$match: {bookId: {$in: dto.bookIds}}},
    {$group: {_id: "$bookId", count: {$sum: 1}}},
  ]);


  results.forEach(result => {
    counts[result._id] = result.count;
  });
  return counts;
};
