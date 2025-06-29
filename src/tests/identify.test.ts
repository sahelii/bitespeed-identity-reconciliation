import request from 'supertest';
import app from '../index';

describe('Identify Endpoint', () => {
  it('should return 400 when neither email nor phoneNumber is provided', async () => {
    const response = await request(app)
      .post('/identify')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toHaveProperty('message', 'Either email or phoneNumber must be provided');
  });

  it('should create a new primary contact when no existing contacts found', async () => {
    const response = await request(app)
      .post('/identify')
      .send({
        email: 'newuser@example.com',
        phoneNumber: '+1234567890'
      })
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('primaryContatctId');
    expect(response.body.data).toHaveProperty('emails');
    expect(response.body.data).toHaveProperty('phoneNumbers');
    expect(response.body.data).toHaveProperty('secondaryContactIds');
  });
}); 