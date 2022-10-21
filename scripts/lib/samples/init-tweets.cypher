LOAD CSV WITH HEADERS FROM 'file:///sample-tweets.csv' AS line 
CREATE (t:Tweet {text: line.text, createdAt: toInteger(line.created_at)})
WITH t, line.author as username
MATCH (u:User {username: username})
CREATE (u)-[r:Author]->(t);