import bcrypt from 'bcrypt'
import connectDB from '../../../utils/connectDB'
import User from '../../../models/userModel'
import valid from '../../../utils/valid'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await register(req, res)
            break;
    }
}

const register = async (req, res) => {
    try {
        const {name, email, password, cf_password} = req.body
        const errMsg = valid(name, email, password, cf_password)
        if (errMsg) return res.status(400).json({err: errMsg})

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({err: 'This email already exists'})

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = new User({
            name, email, password: passwordHash, cf_password
        })

        await newUser.save()
        res.json({ msg: "Register Success" })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}