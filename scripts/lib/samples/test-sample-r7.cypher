MATCH relationships=(:User {username: "taylorswift13"})-[:Follows]-(:User)
RETURN relationships AS Relationships