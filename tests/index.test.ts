import { assert } from 'chai';
import axios from 'axios';
import checkRoles from '../src/controllers/checkRoles';

import mocha from 'mocha';

describe('checkRoles()', function() {
	it("should return false if there isn't role inside permission", async function() {
		assert.isNotTrue(checkRoles(['admin', 'contributor'], 'unverified_user'));
	});
	it('should return true if there is role inside permission', async function() {
		// assert.isNotTrue(checkRoles(['author', 'owner'], ['unverfied_user']));

		assert.isTrue(checkRoles(['admin', 'user'], 'user'));
	});
});
