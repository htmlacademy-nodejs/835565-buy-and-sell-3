'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH, UPLOAD_PATH, MAX_UPLOAD_FILE_SIZE, DATE_FORMAT} = require(`../../const`);
const {getLogger} = require(`../../service/lib/logger`);
const {humanizeDate} = require(`../../utils/utils-common`);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const logger = getLogger({name: `front-api/offers`});
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_PATH);

const utils = {
  humanizeDate,
  DATE_FORMAT,
};

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(MAX_ID_LENGTH);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: MAX_UPLOAD_FILE_SIZE}
}).single(`avatar`);


offersRouter.get(`/add`, async (req, res) => {
  try {
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {categories});
  } catch (error) {
    logger.error(`Error on '/offers/add' route: ${error.message}`);
    res.render(`errors/500`);
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));
// WIP

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const [offer, categories] = await Promise.all([
      api.getOffer(id),
      api.getCategories()
    ]);
    res.render(`offers/ticket-edit`, {offer, categories});
  } catch (error) {
    res.render(`errors/404`);
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  try {
    const offer = await api.getOffer(id, true);
    res.render(`offers/ticket`, {offer, ...utils});
  } catch (error) {
    res.render(`errors/404`);
  }
});

offersRouter.post(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  upload(req, res, async (err) => {
    if (err) {
      const errorMessage = err.message;
      if (err instanceof multer.MulterError) {
        res.render(`offers/new-ticket`, {categories, errorMessage});
      } else {
        logger.error(`Unknown error on file upload: ${errorMessage}`);
        res.render(`offers/new-ticket`, {categories, errorMessage});
      }
      return;
    }

    const {body, file} = req;
    const newOfferData = {
      title: body[`ticket-name`],
      type: body.action,
      picture: file.filename,
      description: body.comment,
      sum: body.price,
      categories: body.categories,
      createdAt: new Date(),
    };

    try {
      await api.createOffer(newOfferData);
      res.redirect(`/my`);
    } catch (error) {
      logger.error(`Unable to create new offer: ${error.message}`);
      res.redirect(`back`);
    }
  });
});

module.exports = offersRouter;
