LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS line 
CREATE (:User {username: line.name});

LOAD CSV WITH HEADERS FROM 'file:///edges.csv' AS line
MATCH
  (a:User {username: line.from}),
  (b:User {username: line.to})
CREATE (a)-[r:Follows]->(b);
