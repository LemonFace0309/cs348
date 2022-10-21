LOAD CSV WITH HEADERS FROM 'file:///sample-nodes.csv' AS line 
CREATE (:User {username: line.username, followCount: toInteger(line.following), 
followerCount: toInteger(line.follower), createdAt: line.created_at,
name: line.name});
