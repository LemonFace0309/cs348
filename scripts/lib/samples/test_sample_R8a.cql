MATCH (n: User) 
WHERE n.username = "justinbieber"
RETURN n

MATCH (n: User) 
WHERE n.username IN ["justinbieber", "katyperry"]
RETURN n

MATCH (n: User) 
WHERE n.username in ['justinbieber', 'katyperry'] 
RETURN n.name as Name, 
       n.followCount as Following





