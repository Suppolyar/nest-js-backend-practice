import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title',
  description: 'Description',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', async (): Promise<void> => {
    const { body }: request.Response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createdId = body._id;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', async (): Promise<void> => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200);

    expect(body.length).toBe(1);
  });

  it('/review/byProduct/:productId (GET) - fail', async (): Promise<void> => {
    const { body }: request.Response = await request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200);

    expect(body.length).toBe(0);
  });

  it('/review/delete (DELETE) - success', async (): Promise<void> => {
    await request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(200);
  });

  it('/review/delete (DELETE) - fail', async (): Promise<void> => {
    const incorrectId = new Types.ObjectId().toHexString();
    await request(app.getHttpServer())
      .delete('/review/' + incorrectId)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
