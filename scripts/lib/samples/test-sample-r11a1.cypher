MATCH (A:User {username: "taylorswift13"}), (B:User {username: "rihanna"})
WITH [(A)--(N)--(B) WHERE N:User|N.username] AS mutual_names
RETURN mutual_names
