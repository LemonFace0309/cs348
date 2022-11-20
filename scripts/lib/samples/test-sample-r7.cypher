MATCH relationships=(:User {username: "rihanna"})-[:Follows]-(:User)
RETURN relationships AS Relationships