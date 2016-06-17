# Raise the Bar

Raise the Bar is the second of Free Code Camp's full-stack challenges. It's a nightlife coordination app that enables users to plan nighttime outings. They can search for local bars served via the Yelp API. They can login and add themselves to individual bars to let friends know where they are going out. When logged in, their searches also are saved.

These are the "user stories" this app must fulfill:

* As an unauthenticated user, I can view all bars in my area.
* As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
* As an authenticated user, I can remove myself from a bar if I no longer want to go there.
* As an unauthenticated user, when I login I should not have to search again.

App is Node based, with Express and Angular with MongoDB for user database. Authentication is with the Angular module [Satellizer](https://github.com/sahat/satellizer) by Sahat Yakalbov. Frontend auth controllers and backend user API are based on his tutorial on [making an Instagram clone](https://hackhands.com/building-instagram-clone-angularjs-satellizer-nodejs-mongodb), but with Twitter login.

Custom fonts are Liberation Sans and Vera, came from Font Squirrel. Photos came from Unsplash and other free photo sites.