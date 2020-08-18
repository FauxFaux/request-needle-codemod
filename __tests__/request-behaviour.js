const nock = require('nock');
const requestCb = require('request');
// request-promise-native monkey-patches, do not include it here

afterEach(() => {
  nock.cleanAll();
});

afterAll(() => {
  nock.restore();
});

async function asyncRequestCb(url, opts) {
  return new Promise(async (resolve) => {
    try {
      requestCb(url, opts, (err, resp, body) =>
        resolve(['after', err, resp, body]),
      );
    } catch (err) {
      resolve(['before', err]);
    }
  });
}

describe('request', () => {
  it('normally returns a triple', async () => {
    nock('http://foo').get('/').reply(200, 'ay okay');
    await expect(asyncRequestCb('http://foo', {})).resolves.toStrictEqual([
      'after',
      null,
      expect.objectContaining({
        statusCode: 200,
      }),
      'ay okay',
    ]);
  });

  it('returns a triple for http status codes', async () => {
    nock('http://foo').get('/').reply(404, 'cannae find it');
    await expect(asyncRequestCb('http://foo', {})).resolves.toStrictEqual([
      'after',
      null,
      expect.objectContaining({
        statusCode: 404,
      }),
      'cannae find it',
    ]);
  });

  it('returns an err for errors', async () => {
    nock('http://foo').get('/').replyWithError({ code: 'EWUT' });
    await expect(asyncRequestCb('http://foo', {})).resolves.toStrictEqual([
      'after',
      { code: 'EWUT' },
      undefined,
      undefined,
    ]);
  });

  it('rejects for insane input', async () => {
    await expect(asyncRequestCb(null, null)).resolves.toStrictEqual([
      'after',
      expect.any(Error),
      undefined,
      undefined,
    ]);
  });

  it('rejects for insane url', async () => {
    await expect(asyncRequestCb('wot', {})).resolves.toStrictEqual([
      'after',
      expect.any(Error),
      undefined,
      undefined,
    ]);
  });
});
