
MATCH (n: User) 
WHERE n.username IN ["justinbieber", "katyperry"]
RETURN n;
