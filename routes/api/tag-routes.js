const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll({
      order: ['tag_name'],
      include: [{ model: Product },],
      attributes: {
        // exclude: ['category_id'],
      }
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product },],
      // attributes: {
      // exclude: ['category_id'],
      // }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that ID.' })
    };
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// I put this one in as a .then instead of an async cause... practice I guess.
router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then((tag) =>
  res.status(200).json(tag))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  // How would I capture a bad request here with the .then-based async?
  .then((updatedTag) => {
    if (!updatedTag) {
    res.status(404).json({ message: 'No tag found with that ID.' })
    }
  })
  // This works, but for some reason the updatedTag call is just returning [0].
  .then((updatedTag) => res.status(200).json(`Tag changed to ${req.body.tag_name}`))
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that ID.' });
      return;
    }
    // Like the above, tagData just returns 1. But everything works.
    res.status(200).json(`Tag ${req.params.id} successfully deleted.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
