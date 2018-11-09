
import {Express} from 'express'
import {prisma} from '../generated/prisma-client'

export default (app:Express)=>{

    app.get('/', async (req, res) => {
        res.json({
            version:require('../../package').version
        })
    })

    app.get('/users', async (req, res) => {
        const users = await prisma.users()
        res.json({users})
    })
    
}
