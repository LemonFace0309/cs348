MATCH (A:User {username: "ladygaga"}), (B:User {username: "rihanna"})
WITH [(A)-[:Follows]->(N)<-[:Follows]-(B) WHERE N:User|N.username] AS mutual_names
RETURN mutual_names
