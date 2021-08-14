
/* Список всех категорий */
SELECT * FROM categories;

/* Список непустых категорий */
SELECT id, name FROM categories
  JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/* Категории с количеством объявлений */
SELECT id, name, count(offer_id) FROM categories
  LEFT JOIN offer_categories
  ON id = category_id
  GROUP BY id;

/* Список объявлений, сначала свежие */
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
  GROUP BY offers.id, users.id
  ORDER BY offers.date DESC;

/* Детальная информация по объявлению */
SELECT offers.*,
  COUNT(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
  users.first_name,
  users.last_name,
  users.email
FROM offers
  JOIN offer_categories ON offers.id = offer_categories.offer_id
  JOIN categories ON offer_categories.category_id = categories.id
  LEFT JOIN comments ON comments.offer_id = offers.id
  JOIN users ON users.id = offers.user_id
WHERE offers.id = 2
  GROUP BY offers.id, users.id;

/* Свежие комментарии */
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
  ORDER BY comments.date DESC
  LIMIT 5;

/* Комментарии к объявлению */
SELECT
  comments.id,
  comments.offer_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 2
  ORDER BY comments.date DESC;

/* Объявления о покупке */
SELECT * FROM offers
WHERE type = 'OFFER'
  LIMIT 2;

/* Обновить заголовок */
UPDATE offers
SET title = 'New Title'
WHERE id = 7