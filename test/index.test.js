import chai from 'chai';
import axios from 'axios';

import mocha from 'mocha';

const assert = chai.assert;

describe('checkRoles()', function() {
  it("should return false if there isn't role inside permission", async function() {
    // assert.isNotTrue(checkRoles(['author', 'owner'], ['unverfied_user']));
    const responseCheckroles = await axios.post(
      'http://localhost:3030/checkRoles',
      {
        roles: ['admin', 'contributor'],
        permission: 'owner',
      },
    );
    assert.isNotTrue(responseCheckroles.data, 'hey');
  });
  it('should return true if there is role inside permission', async function() {
    // assert.isNotTrue(checkRoles(['author', 'owner'], ['unverfied_user']));
    const responseCheckroles = await axios.post(
      'http://localhost:3030/checkRoles',
      {
        roles: ['admin', 'owner'],
        permission: 'admin',
      },
    );
    assert.isTrue(responseCheckroles.data, 'hey');
  });
});
