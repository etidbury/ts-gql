/* eslint-env jest */
require('dotenv').config()
import axios from 'axios'
import urljoin from 'url-join'
import { assert } from 'chai'

const {
    PORT,
    HOST
} = process.env

const clientUrl = `http://${HOST || 'localhost'}:${PORT}`

// A simple example test
describe('Server environment has been setup correctly for tests', () => {

    it('Check development server is up', async () => {

        const { data } = await axios.get(
            urljoin(clientUrl,'/')
        ).catch((err)=>{

            console.error("Make sure server is running first!")

            throw err
        })
        
        assert.strictEqual(data.env || 'development','development','Server needs to be ran in development')
    })

})