LOAD CSV WITH HEADERS FROM 'file:///sample-users.csv' AS line 
CREATE (:User {username: line.username, followCount: toInteger(line.following), 
followerCount: toInteger(line.follower), createdAt: toInteger(line.created_at),
name: line.name, domain: line.domain, tweetCount: toInteger(line.tweetCount),
isAdmin: False});
