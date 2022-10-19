LOAD CSV WITH HEADERS FROM 'file:///nodes.csv' AS line 
CREATE (:User {username: line.name});
