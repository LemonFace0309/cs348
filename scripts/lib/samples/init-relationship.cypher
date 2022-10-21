LOAD CSV WITH HEADERS FROM 'file:///sample-relationship.csv' AS line
MATCH
  (a:User {username: line.from}),
  (b:User {username: line.to})
CREATE (a)-[r:Follows]->(b);
