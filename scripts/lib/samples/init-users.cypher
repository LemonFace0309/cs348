LOAD CSV WITH HEADERS FROM 'file:///sample-users.csv' AS line 
CREATE (:User {username: line.username, followingCount: toInteger(line.following), 
followersCount: toInteger(line.follower), createdAt: toInteger(line.created_at),
name: line.name, tweetCount: toInteger(line.tweetCount),
isAdmin: False});
