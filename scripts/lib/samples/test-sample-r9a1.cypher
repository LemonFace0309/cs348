MATCH tweets=(:User {username: "taylorswift13"})-[rel:Author]-(:Tweet)
RETURN tweets
