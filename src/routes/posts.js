const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  bulkUpdatePosts,
  getPostStats,
  getPopularPosts
} = require('../controllers/postController');
const { protect, can } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all posts with filtering and pagination
// @route   GET /api/v1/posts
// @access  Public
router.get('/', getPosts);

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
router.get('/:id', getPost);

// @desc    Get popular posts
// @route   GET /api/v1/posts/popular
// @access  Public
router.get('/popular', getPopularPosts);

// @desc    Get post statistics
// @route   GET /api/v1/posts/stats
// @access  Private (Admin+)
router.get('/stats', protect, can('post:view'), getPostStats);

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private (Contributor+)
router.post('/', [
  protect,
  //can('post:create'),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('body').trim().isLength({ min: 50 }).withMessage('Body must be at least 50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  body('status').optional().isIn(['draft', 'review', 'scheduled', 'published']).withMessage('Invalid status'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid scheduled date'),
  body('seo.metaTitle').optional().isLength({ max: 60 }).withMessage('Meta title must be less than 60 characters'),
  body('seo.metaDescription').optional().isLength({ max: 160 }).withMessage('Meta description must be less than 160 characters'),
  body('contentSections').optional().isArray().withMessage('Content sections must be an array'),
  body('breadcrumb').optional().isObject().withMessage('Breadcrumb must be an object')
], createPost);

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @route   PATCH /api/v1/posts/:id
// @access  Private (Contributor+)
router.put('/:id', [
  protect,
  can('post:edit'),
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('body').optional().trim().isLength({ min: 50 }).withMessage('Body must be at least 50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  body('status').optional().isIn(['draft', 'review', 'scheduled', 'published', 'archived']).withMessage('Invalid status'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid scheduled date'),
  body('contentSections').optional().isArray().withMessage('Content sections must be an array'),
  body('breadcrumb').optional().isObject().withMessage('Breadcrumb must be an object')
], updatePost);

router.patch('/:id', [
  protect,
  can('post:edit'),
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('body').optional().trim().isLength({ min: 50 }).withMessage('Body must be at least 50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('categories').optional().isArray().withMessage('Categories must be an array'),
  body('status').optional().isIn(['draft', 'review', 'scheduled', 'published', 'archived']).withMessage('Invalid status'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid scheduled date'),
  body('contentSections').optional().isArray().withMessage('Content sections must be an array'),
  body('breadcrumb').optional().isObject().withMessage('Breadcrumb must be an object')
], updatePost);

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private (Admin only)
router.delete('/:id', [
  protect,
  can('post:delete'),
  param('id').isMongoId().withMessage('Invalid post ID')
], deletePost);

// @desc    Bulk update posts
// @route   PATCH /api/v1/posts/bulk
// @access  Private (Editor+)
router.patch('/bulk', [
  protect,
  can('post:edit'),
  body('postIds').isArray({ min: 1 }).withMessage('Post IDs must be an array'),
  body('action').isIn(['changeStatus', 'delete']).withMessage('Invalid action'),
  body('status').optional().isIn(['draft', 'review', 'scheduled', 'published', 'archived']).withMessage('Invalid status')
], bulkUpdatePosts);

module.exports = router;