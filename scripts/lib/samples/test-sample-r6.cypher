MATCH (A:User {username: "taylorswift13"}), (B:User {username: "rihanna"}),
p = shortestPath((A)-[*]-(B))
RETURN p