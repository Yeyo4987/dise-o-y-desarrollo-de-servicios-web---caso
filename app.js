const express = require('express');
const dbconnect = require('./config');
const ModelUser = require('./userModel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const router = express.Router();
router.post("/", async(req,res) => {
    const body = req.body;
    const addUser = await ModelUser.create(body)
    return res.status(201).json(addUser)
})


router.get("/", async(req,res) => {
    const getUser = await ModelUser.find()
    return res.json(getUser)
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await ModelUser.findOne({ email });
        if (!user) return res.status(401).json({ message: "El usuario no existe" });
        
        if(password === user.password){
        const token = jwt.sign(
            { user },
            '8de99e3849e5e4e1c27050de8f3eedcb07f3178bc07e762396b71f274dd90f152159197a515cc80f4f7b837031c1a6f1adc016a696746ba5c4d7f11e67b1d85d',
            { expiresIn: "1d" }
        );
        
        return res.json({ user, token });

        }else{
            return res.status(401).json({ message: "La contraseña es incorrecta" });
        }
        

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
     }
});

router.get("/:id", async (req,res) => {
    const id = req.params.id;
    const respuesta = await ModelUser.findById(id)
    return res.send(respuesta)
})

router.put("/:id", async (req,res) =>{
    const body = req.body;
    const id = req.params.id;
    const respuesta = await ModelUser.findByIdAndUpdate({_id:id}, body)
    return res.send(respuesta)
})

router.delete("/:id", async (req,res) => {
    const id = req.params.id;
    const respuesta = await ModelUser.findByIdAndDelete({_id:id})
    return res.json({message:"El usuario se elimino exitosamente"});
})

app.use(express.json())
app.use(router)


app.listen(8080, () => {
    console.log("El servidor esta en el puerto 8080");
})

dbconnect();