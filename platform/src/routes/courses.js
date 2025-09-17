const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/courseController');
const { auth, requireAdmin } = require('../utils/authMiddleware');

router.get('/', courseCtrl.list);
router.get('/:id', courseCtrl.get);
router.post('/', auth, requireAdmin, courseCtrl.create); // create by admin

module.exports = router;