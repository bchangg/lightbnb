SELECT properties.id, properties.title, avg(property_reviews.rating) AS average_rating
FROM properties
JOIN property_reviews ON properties.id = property_reviews.property_id
-- WHERE city LIKE '%ancouv%'
GROUP BY properties.id
HAVING avg(property_reviews.rating) > 4
ORDER BY cost_per_night
LIMIT 10;


-- SELECT properties.id, title, cost_per_night, avg(rating)
-- FROM properties
-- JOIN property_reviews ON property_reviews.property_id = properties.id
-- GROUP BY properties.id
-- HAVING avg(rating) > 4
-- ORDER BY cost_per_night
-- LIMIT 10;