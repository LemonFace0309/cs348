MERGE (n: User {username: 'alexzhang'})
SET n.followCount = 1000000000
RETURN n;