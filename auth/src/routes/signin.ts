import express from 'express';

const router = express.Router();

router.get('/api/users/signin', (req, res) => {
    res.send('H')
})

export { router as signinRouter };