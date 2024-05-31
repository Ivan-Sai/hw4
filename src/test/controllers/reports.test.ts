import express from 'express';
import chai from 'chai';
import chaiHttp from 'chai-http';
import bodyParser from "body-parser";
import routers from "../../routers/reports";
import sinon from "sinon";
import Report from "../../model/report";
import nock from "nock";

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

describe('Report Controller', () => {


  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new report', (done) => {
    const bookId = '1';
    const dto = {
      bookId: bookId,
      text: 'Report 1',
    };

    nock('http://localhost:8080')
      .get(`/api/book/${bookId}`)
      .reply(200, { id: bookId, title: 'Test book' });

    const saveOneStub = sandbox.stub(
      Report.prototype,
      'save',
    );
    saveOneStub.resolves({ _id: 'new_report_id' });
    chai.request(app)
      .post('')
      .send(dto)
      .end((_, res) => {
        res.should.have.status(201);
        expect(res.body).to.have.property('id');
        done();
      });
  });



  it('should get report by book id', () => {
    const bookId = '1';
    const reports = [
      {
        bookId: bookId,
        text: "Report 1",
      },
      {
        bookId: bookId,
        text: "Report 2",
      },
    ];
    const dto = {
      bookId,
      from: 0,
      size: 10,
    };
    const findStub = sandbox.stub(Report, 'find');
    findStub.resolves(reports);
    chai.request(app)
      .get('')
      .send(dto)
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(reports);
      });
  });

  it('should return report counts by book ids', (done) => {
    const requestBody = {bookIds: ['1', '2', '3']};
    const aggregateResults = [
      {_id: '1', count: 5},
      {_id: '2', count: 3},
      {_id: '3', count: 7},
    ];

    const expectedResponse = {
      '1': 5,
      '2': 3,
      '3': 7,
    };

    const aggregateStub = sandbox.stub(Report, 'aggregate');
    aggregateStub.resolves(aggregateResults);

    chai.request(app)
      .get('/statistics')
      .send(requestBody)
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(expectedResponse);
        done();
      });

  });
});

