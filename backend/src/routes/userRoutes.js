const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware')

const userController = require('../controllers/userController');


// Admin-only route
// router.get('/admin/data', auth, roleCheck(['manager']), userController.getManagerData);

// // Agent-only route
// router.get('/agent/tickets', auth, roleCheck(['agent']), userController.getAgentTickets);

// // Customer route
// router.get('/customer/tickets', auth, roleCheck(['customer']), userController.getCustomerTickets);

// // CRUD operations for users

router.get('/agents', userController.getAllAgents); // Get all agents
router.get('/email/:email', userController.getCustomerByEmail); // Get customer by email

// router.post('/', userController.createUser);
router.post('/', authMiddleware,roleMiddleware('manager'), userController.createUser);
console.log(userController.createUser)

router.get('/', userController.getAllUsers); // Optionally filter by role
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);


// // Additional routes
// router.get('/customers/email/:email', userController.getCustomerByEmail); // Get customer by email
// router.get('/agents/category/:categoryName', userController.getAgentsByCategory); // Get agents by category


// //agents
router.get('/agents', userController.getAllAgents);
module.exports = router;
