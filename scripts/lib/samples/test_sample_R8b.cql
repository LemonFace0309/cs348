CREAT (n: User {name: 'Barack Obama', 
                    username: 'BarackObama', 
                    createdAt: '2007-04-18T20:50:14.000Z', 
                    followerCount: 113895387, 
                    followCount: 282270})

MATCH (n: User), (m: User) 
WHERE n.username = 'BarackObama' and m.username = 'justinbieber'
CREAT (n)-[r: Follow]->(m)
