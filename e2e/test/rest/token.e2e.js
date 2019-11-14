const assert = require('chai').assert;
const Axios = require('axios');

const config = require('../../wdio.conf.js').config;
const url = require('url');

const utls = require('./utls');
const helper = require('./helper');

const API_PATH = '/api/token';
const API_URL = url.resolve(config.baseUrl, API_PATH);

describe(`REST ${API_PATH} `, function() {
  const user = utls.generateUserDto();
  let axios = Axios;

  beforeAll(async function() {
    await helper.signup(user);
    axios = axios.create({
      baseURL: API_URL
    });
  });

  describe('post ', function() {
    it('should post', async function() {
      const response = await axios.post('/', {
        login: user.username,
        password: user.password
      });

      assert.equal(response.status, 200);
      assert(response.data.access_token !== undefined);
    });

    it('should not post for nonexistent user', async function() {
      try {
        await axios.post('/', {
          login: "nonexistent",
          password: user.password
        });
      } catch (err) {
        assert.equal(err.response.status, 401);
        return;
      }
      assert(false);
    });

    it('should not post for nonvalid request', async function() {
      try {
        await axios.post('/', {
          user: user.username,
          password: user.password
        });
      } catch (err) {
        assert.equal(err.response.status, 400);
        return;
      }
      assert(false);
    });
  });

  describe('delete ', function() {
    it('should delete', async function() {
      const response = await axios.delete();

      assert.equal(response.status, 204);
    });
  });
});
