
MATCH (n: User) 
WHERE n.username in ['justinbieber', 'katyperry'] 
RETURN n.name as Name, 
       n.followCount as Following; 
