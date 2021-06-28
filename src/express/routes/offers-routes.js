'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH, UPLOAD_PATH, MAX_UPLOAD_FILE_SIZE} = require(`../../const`);
const {getLogger} = require(`../../service/lib/logger`);

const api = require(`../api`).getAPI();
const offersRouter = new Router();

const logger = getLogger({name: `front-api`});
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_PATH);

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
});


offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const newOfferData = {
    title: body[`ticket-name`],
    type: body.action,
    picture: file.filename,
    description: body.comment,
    sum: body.price,
    categories: Array.isArray(body.categories) ? body.categories : [body.categories],
  };

  try {
    await api.createOffer(newOfferData);
    res.redirect(`/my`);
  } catch (error) {
    logger.error(`An error occurred on file upload: ${error.message}`);
    res.redirect(`back`);
  }
});

module.exports = offersRouter;
