MERGE (n: User {username: 'alexzhang'})
SET n.domain = 'alexzhang.123', n.name = 'Alex Zhang'
RETURN n;