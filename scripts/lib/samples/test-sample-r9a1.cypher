MATCH tweets=(:User {username: "katyperry"})-[rel:Author]-(:Tweet)
RETURN tweets
