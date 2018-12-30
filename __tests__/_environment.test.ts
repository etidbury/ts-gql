/* eslint-env jest */
require('dotenv').config()
import axios from 'axios'
import * as urljoin from 'url-join'
import { assert } from 'chai'

const {
    PORT,
    HOST
} = process.env

const clientUrl = `http://${HOST || 'localhost'}:${PORT}`

// A simple example test
describe('Server environment has been setup correctly for tests', () => {

    it('Check development server is up', async () => {

        const baseURL=urljoin(clientUrl,'/')
        const { data } = await axios.get(
            baseURL
        ).catch((err)=>{

            console.error("Make sure server is running first!")

            throw err
        })
        
        assert.strictEqual(data.env || 'development','development','Server needs to be ran in development')
    })

    it('Check Prisma server is up', async () => {

        assert.isDefined(process.env.PRISMA_URL,'process.env.PRISMA_URL not set')

        const prismaURL:any = process.env.PRISMA_URL


        const baseURL=urljoin(clientUrl,'/')
        const { data } = await axios.get(prismaURL).catch((err)=>{

            console.error("Make sure prisma server is setup first and you have internet")

            throw err
        })
    })

})