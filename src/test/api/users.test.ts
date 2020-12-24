import { expect } from 'chai'
import axios from 'axios'
import keys from '../../config/keys'
import getDatabase from '../../utilities/serverContext/database'
const { rootURL, test, adminEmail } = keys

const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${test.token}`,
  },
}

describe('/api/users', () => {
  it('returns a list of users', async () => {
    const { data: users } = await axios.get(
      `${rootURL}/api/users`,
      axiosConfig
    )
    expect(users).to.be.an('array')
  }).timeout(10000)

  describe('/makeAdmin', () => {
    it('makes a non-admin user an admin', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      const putData = { userId: testUser._id, isAdmin: true }
      const { status } = await axios.put(
        `${rootURL}/api/users/makeAdmin`,
        putData,
        axiosConfig
      )
      const updatedUser = await findOne(User, {
        email: 'test@example.com',
      })

      expect(status).to.equal(200) &&
        expect(updatedUser.isAdmin).to.equal(true)
    }).timeout(10000)

    it('make an admin user into a non-admin', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      const putData = { userId: testUser._id, isAdmin: false }
      const { status } = await axios.put(
        `${rootURL}/api/users/makeAdmin`,
        putData,
        axiosConfig
      )
      const updatedUser = await findOne(User, {
        email: 'test@example.com',
      })

      expect(status).to.equal(200) &&
        expect(updatedUser.isAdmin).to.equal(false)
    }).timeout(10000)
  })

  describe('/ban', () => {
    it('makes a non-banned user an banned', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      const putData = { userId: testUser._id, isBanned: true }
      const { status } = await axios.put(
        `${rootURL}/api/users/ban`,
        putData,
        axiosConfig
      )
      const updatedUser = await findOne(User, {
        email: 'test@example.com',
      })

      expect(status).to.equal(200) &&
        expect(updatedUser.isBanned).to.equal(true)
    }).timeout(10000)

    it('make a banned user into a non-banned', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      const putData = { userId: testUser._id, isBanned: false }
      const { status } = await axios.put(
        `${rootURL}/api/users/ban`,
        putData,
        axiosConfig
      )
      const updatedUser = await findOne(User, {
        email: 'test@example.com',
      })

      expect(status).to.equal(200) &&
        expect(updatedUser.isBanned).to.equal(false)
    }).timeout(10000)
  })

  describe('/[id]', () => {
    it('does not delete a user if the request was sent by a non-admin', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      try {
        await axios.delete(`${rootURL}/api/users/${testUser._id}`)
        expect(1).to.equal(2)
      } catch (err) {
        expect(err.response.status).to.equal(403)
      }
    }).timeout(10000)

    it('does not delete the user who sent the request', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const adminUser = await findOne(User, { email: adminEmail })

      try {
        await axios.delete(
          `${rootURL}/api/users/${adminUser._id}`,
          axiosConfig
        )
        expect(1).to.equal(2)
      } catch (err) {
        expect(err.response.status).to.equal(401)
      }
    }).timeout(10000)

    it('deletes a user', async () => {
      const database = await getDatabase()
      const { findOne, User } = database
      const testUser = await findOne(User, {
        email: 'test@example.com',
      })

      const response = await axios.delete(
        `${rootURL}/api/users/${testUser._id}`,
        axiosConfig
      )
      const deletedUser = await findOne(User, {
        email: 'test@example.com',
      })

      expect(response.data.message).to.equal('user deleted') &&
        expect(deletedUser).to.equal(null)
    }).timeout(10000)
  })
})
